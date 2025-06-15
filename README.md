# awscdk-construct-medialive-channel
[![View on Construct Hub](https://constructs.dev/badge?package=awscdk-construct-medialive-channel)](https://constructs.dev/packages/awscdk-construct-medialive-channel)

CDK Construct for deploying an AWS Elemental MediaLive channel
* The input is MP4 files
* You can specify encoding settings or leave them default

## Install
[![NPM](https://nodei.co/npm/awscdk-construct-medialive-channel.png?mini=true)](https://nodei.co/npm/awscdk-construct-medialive-channel/)

## Usage

### Sample code
Here's an example for setting up a SINGLE_PIPELINE MediaLive channel using a local MP4 file (`./upload/test.mp4`) as an input

```ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { FilePublisher } from 'awscdk-construct-file-publisher';
import { MediaLive } from 'awscdk-construct-medialive-channel';

export class ExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Upload all the files in the local folder (./upload) to S3
    const publicFolder = new FilePublisher(this, 'FilePublisher', {
      path: './upload',
    });

    // Create MediaLive channel
    const eml = new MediaLive(this, 'MediaLive', {
      sources: [`${publicFolder.url}/test.mp4`],
      destinations: [{
        id: 'SRT',
        settings: [{
            url: "srt:0.0.0.0:5000",
        }],
      }],
      channelClass: 'SINGLE_PIPELINE',
    });

    // Start channel
    startChannel(this, 'StartMediaLiveChannel', eml.channel.ref);

    // Access MediaLive channel attributes via `eml.channel`
    new cdk.CfnOutput(this, "MediaLiveChannelId", {
      value: eml.channel.ref,
      exportName: cdk.Aws.STACK_NAME + "MediaLiveChannelId",
      description: "MediaLive channel ID",
    });
  }
}
```

### Encoding parameters
By default, the following parameters will be used for encoding:
* Encoding
  * SINGLE_PIPELINE --> configurable
  * Frame rate 29.97fps
  * ABR with 3x bitrates (720p/540p/360p)
  * GOP length: 3 seconds --> configurable
  * Time-code burn-in: none --> configurable

You can further configure the encoding behavior using low-level settings:
```ts
// Create a live channel using CfnChannel props
const eml = new MediaLive(this, 'MediaLive', {
  sources: ['s3://aems-input/test-1.mp4'],
  encoderSpec: { // CfnChannel.EncoderSettingsProperty
    outputGroups, // CfnChannel.OutputGroupProperty[]
    videDescriptions, // CfnChannel.VideoDescriptionProperty[]
    audioDescriptions, // CfnChannel.AudioDescriptionProperty[]
    timecodeConfig, // 'SYSTEMCLOCK' | 'EMBEDDED'
    availBlanking, // CfnChannel.AvailBlankingProperty
  },
});
```
