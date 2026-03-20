import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { MediaLive } from '../src';

test('Create MediaLive', () => {
  const app = new App();
  const stack = new Stack(app, 'SmokeStack', { env: { account: '123456789012', region: 'us-east-1' } });

  new MediaLive(stack, 'MediaLive', {
    sources: [
      {
        url: 'https://example.com/test-1.mp4',
      },
      {
        type: 'TS_FILE',
        url: 'https://example.com/test-2.ts',
      },
      {
        type: 'SRT_CALLER',
        url: 'srt://example.com:1234?streamid=example',
      },
    ],
    destinations: [{
      id: 'MediaPackageV1',
      mediaPackageSettings: [
        {
          channelId: '12345',
        },
      ],
    }],
    encoderSpec: {
      gopLengthInSeconds: 2,
      outputGroupSettingsList: [
        {
          mediaPackageGroupSettings: {
            destination: {
              destinationRefId: 'MediaPackageV1',
            },
          },
        },
      ],
      outputSettingsList: [
        {
          mediaPackageOutputSettings: {},
        },
      ],
    },
    secret: Secret.fromSecretNameV2(stack, 'Secret', 'example'),
  });

  const template = Template.fromStack(stack);

  template.hasResource('AWS::MediaLive::Input', 2);
  template.hasResource('AWS::MediaLive::Channel', 1);
});