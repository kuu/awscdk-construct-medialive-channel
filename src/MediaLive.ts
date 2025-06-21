import * as crypto from 'crypto';
import { aws_iam as iam, Fn, RemovalPolicy } from 'aws-cdk-lib';
import { CfnInput, CfnChannel, CfnInputSecurityGroup } from 'aws-cdk-lib/aws-medialive';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { EncoderMidSettings, getEncoderMidSettings, getEncodingSettings } from './MediaLiveUtil';

export interface SourceSpec {
  readonly url: string; // The URL of the source file
  readonly type?: 'MP4_FILE' | 'TS_FILE';
  readonly conversionType?: 'NONE' | 'RTP_PUSH' | 'RTMP_PUSH' | 'MEDIACONNECT' | 'AWS_CDI'; // Which type of conversion to perform.
  readonly conversionSpec?: CfnChannel.EncoderSettingsProperty; // The encoding settings used for the conversion.
}

export type EncoderSettings = EncoderMidSettings | CfnChannel.EncoderSettingsProperty;

export interface MediaLiveProps {
  readonly sources: SourceSpec[]; // The list of URL of the files used by MediaLive as the sources.
  readonly destinations: CfnChannel.OutputDestinationProperty[]; // The destinations for the channel.
  readonly channelClass?: 'STANDARD' | 'SINGLE_PIPELINE'; // The class of the channel.
  readonly vpc?: CfnChannel.VpcOutputSettingsProperty; // The VPC settings for the channel, if applicable.
  readonly secret?: ISecret; // The secret used for the MediaLive channel.
  readonly encoderSpec: EncoderSettings; // The encoding settings for the channel.
}

export class MediaLive extends Construct {
  public readonly inputs: CfnInput[]; // The reference to the MediaLive inputs.
  public readonly channel: CfnChannel; // The reference to the MediaLive channel.

  constructor(scope: Construct, id: string, props: MediaLiveProps) {

    super(scope, id);

    const {
      sources,
      destinations,
      channelClass = 'SINGLE_PIPELINE',
      vpc,
      secret,
      encoderSpec,
    } = props;

    // Create MediaLive inputs
    let timecodeInSource = false;
    this.inputs = sources.map((source, i) => {
      const {
        url,
        type = 'MP4_FILE',
        conversionType = 'NONE',
        conversionSpec,
      } = source;

      if (conversionType === 'NONE') {
        // Create a file input
        const input = new CfnInput(this, `CfnInput-${i}`, {
          name: `${crypto.randomUUID()}`,
          type,
          sources: Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, () => ({ url: url })),
        });
        input.applyRemovalPolicy(RemovalPolicy.DESTROY);
        return input;
      } else {
        // Create a dummy channel for embedding timecode in the source
        const fileInput = new CfnInput(this, `FileInput-${i}`, {
          name: `${crypto.randomUUID()}`,
          type,
          sources: Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, () => ({ url: url })),
        });
        fileInput.applyRemovalPolicy(RemovalPolicy.DESTROY);
        const inputSecurityGroup = new CfnInputSecurityGroup(this, `InputSecurityGroup-${i}`, {
          whitelistRules: [{ cidr: '0.0.0.0/0' }],
        });
        const pushInput = new CfnInput(this, `PushInput-${i}`, {
          name: `${crypto.randomUUID()}`,
          type: conversionType,
          inputSecurityGroups: [inputSecurityGroup.ref],
          destinations: conversionType === 'RTMP_PUSH' ? Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, (_, j) => ({ streamName: `stream-${i}-${j}` })) : undefined,
        });
        pushInput.applyRemovalPolicy(RemovalPolicy.DESTROY);
        const ch = createChannel(this, `${i}`, [fileInput], {
          destinations: [
            {
              id: `push-output-destination-${i}`,
              // settings: Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, (_, j) => ({ url: Fn.select(j, pushInput.attrDestinations) })),
              settings: Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, (_, j) => ({
                url: Fn.select(j, pushInput.attrDestinations),
                streamName: conversionType === 'RTMP_PUSH' ? `rtmp-stream-name-${i}` : undefined,
              })),
            },
          ],
          channelClass,
          encoderSpec: conversionSpec ? conversionSpec : getEncoderMidSettings(conversionType, i),
          timecodeInSource: false,
        });
        ch.applyRemovalPolicy(RemovalPolicy.DESTROY);
        timecodeInSource = true;
        startChannel(this, `StartChannel-${i}`, ch.ref);
        return pushInput;
      }
    });

    // Create MediaLive channel
    this.channel = createChannel(this, 'Channel', this.inputs, {
      destinations,
      channelClass,
      vpc,
      secret,
      encoderSpec,
      timecodeInSource,
    });

  }
}

interface MediaLiveInternalProps {
  readonly destinations: CfnChannel.OutputDestinationProperty[]; // The destinations for the channel.
  readonly channelClass: 'STANDARD' | 'SINGLE_PIPELINE'; // The class of the channel.
  readonly vpc?: CfnChannel.VpcOutputSettingsProperty; // The VPC settings for the channel, if applicable.
  readonly secret?: ISecret; // The secret used for the MediaLive channel.
  readonly encoderSpec: EncoderSettings; // The encoding settings for the channel.
  readonly timecodeInSource: boolean; // Whether the source has timecode.
}

function isEncoderMidSettings(props: EncoderSettings): props is EncoderMidSettings {
  return (props as EncoderMidSettings).gopLengthInSeconds !== undefined
  || (props as EncoderMidSettings).outputGroupSettingsList !== undefined
  || (props as EncoderMidSettings).outputSettingsList !== undefined
  || (props as EncoderMidSettings).timecodeBurninPrefix !== undefined;
}

function createChannel(scope: Construct, id: string, inputs: CfnInput[], props: MediaLiveInternalProps): CfnChannel {
  const {
    channelClass,
    destinations,
    vpc,
    secret,
    encoderSpec,
    timecodeInSource,
  } = props;
  // Create an IAM statements
  const statements = [
    new iam.PolicyStatement({
      resources: [
        '*',
      ],
      actions: [
        's3:ListBucket',
        's3:GetObject',
        'mediapackage:DescribeChannel',
        'mediapackagev2:PutObject',
      ],
    }),
  ];
  if (secret) {
    statements.push(
      new iam.PolicyStatement({
        resources: [secret.secretArn],
        actions: [
          'secretsmanager:GetResourcePolicy',
          'secretsmanager:GetSecretValue',
          'secretsmanager:DescribeSecret',
          'secretsmanager:ListSecretVersionIds',
        ],
      }),
    );
  }
  //Create a Role for MediaLive to access the client's AWS resources
  const role = new iam.Role(scope, `IamRole${id}`, {
    inlinePolicies: {
      policy: new iam.PolicyDocument({ statements }),
    },
    managedPolicies: vpc ? [
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonVPCFullAccess'),
    ] : [],
    assumedBy: new iam.ServicePrincipal('medialive.amazonaws.com'),
  });
  // Create MediaLive channel
  const ch = new CfnChannel(scope, `CfnChannel${id}`, {
    name: `${crypto.randomUUID()}-${id}`,
    channelClass,
    roleArn: role.roleArn,
    inputAttachments: inputs.map((input) => ({
      inputId: input.ref,
      inputAttachmentName: input.name,
      inputSettings: {
        sourceEndBehavior: input.type?.endsWith('_FILE') ? 'LOOP' : 'CONTINUE',
      },
    })),
    destinations,
    encoderSettings: isEncoderMidSettings(encoderSpec) ? getEncodingSettings(
      encoderSpec.outputGroupSettingsList,
      encoderSpec.outputSettingsList,
      encoderSpec.gopLengthInSeconds,
      timecodeInSource,
      encoderSpec.timecodeBurninPrefix,
    ) : encoderSpec,
    vpc,
  });
  ch.applyRemovalPolicy(RemovalPolicy.DESTROY);
  return ch;
}

export function startChannel(scope: Construct, id: string, channelId: string): Date {
  // Start channel
  new AwsCustomResource(scope, id, {
    onCreate: {
      service: 'MediaLive',
      action: 'StartChannel',
      parameters: {
        ChannelId: channelId,
      },
      physicalResourceId: PhysicalResourceId.of(`${crypto.randomUUID()}`),
      ignoreErrorCodesMatching: '*',
      outputPaths: ['Id', 'Arn'],
    },
    onDelete: {
      service: 'MediaLive',
      action: 'StopChannel',
      parameters: {
        ChannelId: channelId,
      },
      physicalResourceId: PhysicalResourceId.of(`${crypto.randomUUID()}`),
      ignoreErrorCodesMatching: '*',
      outputPaths: ['Id', 'Arn'],
    },
    //Will ignore any resource and use the assumedRoleArn as resource and 'sts:AssumeRole' for service:action
    policy: AwsCustomResourcePolicy.fromSdkCalls({
      resources: AwsCustomResourcePolicy.ANY_RESOURCE,
    }),
  });
  return new Date();
}
