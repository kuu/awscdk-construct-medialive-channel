import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { MediaLive } from '../src';

test('Create MediaLive', () => {
  const app = new App();
  const stack = new Stack(app, 'SmokeStack');

  new MediaLive(stack, 'MediaLive', {
    sources: [
      {
        url: 'https://example.com/test-1.mp4',
      },
      {
        url: 'https://example.com/test-2.mp4',
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
  });

  const template = Template.fromStack(stack);

  template.hasResource('AWS::MediaLive::Input', 2);
  template.hasResource('AWS::MediaLive::Channel', 1);
});