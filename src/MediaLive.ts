import * as crypto from 'crypto';
import { aws_iam as iam, Fn } from 'aws-cdk-lib';
import { CfnInput, CfnChannel, CfnInputSecurityGroup } from 'aws-cdk-lib/aws-medialive';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import { EncoderMidSettings, getEncoderMidSettings, getEncodingSettings } from './MediaLiveUtil';

export interface SourceSpec {
  readonly url: string; // The URL of the MP4 file.
  readonly conversionType?: 'NONE' | 'RTP_PUSH' | 'RTMP_PUSH' | 'MEDIACONNECT' | 'AWS_CDI'; // Which type of conversion to perform.
  readonly conversionSpec?: CfnChannel.EncoderSettingsProperty; // The encoding settings used for the conversion.
}

export type EncoderSettings = EncoderMidSettings | CfnChannel.EncoderSettingsProperty;

export interface MediaLiveProps {
  readonly sources: SourceSpec[]; // The list of URL of the MP4 files used by MediaLive as the sources.
  readonly destinations: CfnChannel.OutputDestinationProperty[]; // The destinations for the channel.
  readonly channelClass?: 'STANDARD' | 'SINGLE_PIPELINE'; // The class of the channel.
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
      encoderSpec,
    } = props;

    // Create MediaLive inputs
    let timecodeInSource = false;
    this.inputs = sources.map((source, i) => {
      const {
        url,
        conversionType = 'NONE',
        conversionSpec,
      } = source;

      if (conversionType === 'NONE') {
        // Create an MP4 file input
        return new CfnInput(this, `CfnInput-${i}`, {
          name: `${crypto.randomUUID()}`,
          type: 'MP4_FILE',
          sources: Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, () => ({ url: url })),
        });
      } else {
        // Create a dummy channel for embedding timecode in the source
        const fileInput = new CfnInput(this, `FileInput-${i}`, {
          name: `${crypto.randomUUID()}`,
          type: 'MP4_FILE',
          sources: Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, () => ({ url: url })),
        });
        const inputSecurityGroup = new CfnInputSecurityGroup(this, `InputSecurityGroup-${i}`, {
          whitelistRules: [{ cidr: '0.0.0.0/0' }],
        });
        const pushInput = new CfnInput(this, `PushInput-${i}`, {
          name: `${crypto.randomUUID()}`,
          type: conversionType,
          inputSecurityGroups: [inputSecurityGroup.ref],
          destinations: conversionType === 'RTMP_PUSH' ? Array.from({ length: channelClass === 'STANDARD' ? 2 : 1 }, (_, j) => ({ streamName: `stream-${i}-${j}` })) : undefined,
        });
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
          isAbr: false,
          timecodeInSource: false,
        });
        timecodeInSource = true;
        startChannel(this, `StartChannel-${i}`, ch.ref);
        return pushInput;
      }
    });

    // Create MediaLive channel
    this.channel = createChannel(this, 'Channel', this.inputs, {
      destinations,
      channelClass,
      encoderSpec,
      isAbr: true,
      timecodeInSource,
    });

  }
}

interface MediaLiveInternalProps {
  readonly destinations: CfnChannel.OutputDestinationProperty[]; // The destinations for the channel.
  readonly channelClass: 'STANDARD' | 'SINGLE_PIPELINE'; // The class of the channel.
  readonly encoderSpec: EncoderSettings; // The encoding settings for the channel.
  readonly isAbr: boolean; // Whether the channel is ABR.
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
    encoderSpec,
    isAbr,
    timecodeInSource,
  } = props;
  // Create IAM Policy for MediaLive to access MediaPackage and S3
  const customPolicyMediaLive = new iam.PolicyDocument({
    statements: [
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
    ],
  });
  //Create a Role for MediaLive to access MediaPackage and S3
  const role = new iam.Role(scope, `IamRole${id}`, {
    inlinePolicies: {
      policy: customPolicyMediaLive,
    },
    assumedBy: new iam.ServicePrincipal('medialive.amazonaws.com'),
  });
  // Create MediaLive channel
  return new CfnChannel(scope, `CfnChannel${id}`, {
    name: `${crypto.randomUUID()}-${id}`,
    channelClass,
    roleArn: role.roleArn,
    inputAttachments: inputs.map((input) => ({
      inputId: input.ref,
      inputAttachmentName: input.name,
      inputSettings: {
        sourceEndBehavior: input.type === 'MP4_FILE' ? 'LOOP' : 'CONTINUE',
      },
    })),
    destinations,
    encoderSettings: isEncoderMidSettings(encoderSpec) ? getEncodingSettings(
      encoderSpec.outputGroupSettingsList,
      encoderSpec.outputSettingsList,
      encoderSpec.gopLengthInSeconds,
      isAbr,
      timecodeInSource,
      encoderSpec.timecodeBurninPrefix,
    ) : encoderSpec,
  });
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
