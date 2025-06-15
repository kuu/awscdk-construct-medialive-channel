import { CfnChannel } from 'aws-cdk-lib/aws-medialive';

export interface EncoderMidSettings {
  readonly outputGroupSettingsList: CfnChannel.OutputGroupSettingsProperty[]; // The settings for the output groups.
  readonly outputSettingsList: CfnChannel.OutputSettingsProperty[]; // The settings for the outputs.
  readonly gopLengthInSeconds: number; // The length of the GOP in seconds.
  readonly timecodeBurninPrefix?: string; // The prefix for the timecode burn-in.
}

export function getEncodingSettings(
  outputGroupSettingsList: CfnChannel.OutputGroupSettingsProperty[],
  outputSettingsList: CfnChannel.OutputSettingsProperty[],
  gopLengthInSeconds: number,
  isAbr: boolean,
  timecodeInSource: boolean,
  timecodeBurninPrefix?: string,

): CfnChannel.EncoderSettingsProperty {
  // Create output groups
  const outputGroups = [];
  for (const [i, outputGroupSettings] of outputGroupSettingsList.entries()) {
    outputGroups.push(getOutputGroup(`outputGroup_${i}`, outputGroupSettings, outputSettingsList[i], isAbr));
  }
  return {
    outputGroups,
    videoDescriptions: isAbr ? [
      getVideoDescription(640, 360, 1000000, gopLengthInSeconds, timecodeBurninPrefix),
      getVideoDescription(960, 540, 2000000, gopLengthInSeconds, timecodeBurninPrefix),
      getVideoDescription(1280, 720, 3000000, gopLengthInSeconds, timecodeBurninPrefix),
    ] : [
      getVideoDescription(1280, 720, 3000000, gopLengthInSeconds, timecodeBurninPrefix),
    ],
    audioDescriptions: [
      getAudioDescription(96000, 48000),
    ],
    timecodeConfig: {
      source: timecodeInSource ? 'EMBEDDED' : 'SYSTEMCLOCK',
    },
    availBlanking: {
      state: 'ENABLED',
    },
  };
}

function getOutputGroup (
  name: string,
  outputGroupSettings: CfnChannel.OutputGroupSettingsProperty,
  outputSettings: CfnChannel.OutputSettingsProperty,
  isAbr: boolean,
): CfnChannel.OutputGroupProperty {
  return {
    name,
    outputGroupSettings,
    outputs: isAbr ? [
      {
        outputName: `${name}_640x360`,
        outputSettings,
        videoDescriptionName: '_640x360',
      },
      {
        outputName: `${name}_960x540`,
        outputSettings,
        videoDescriptionName: '_960x540',
      },
      {
        outputName: `${name}_1280x720`,
        outputSettings,
        videoDescriptionName: '_1280x720',
      },
      {
        outputName: `${name}_96Kbps_AAC`,
        outputSettings,
        audioDescriptionNames: [
          '_96Kbps_AAC',
        ],
      },
    ] : [
      {
        outputName: `${name}_1280x720_96Kbps_AAC`,
        outputSettings,
        videoDescriptionName: '_1280x720',
        audioDescriptionNames: [
          '_96Kbps_AAC',
        ],
      },
    ],
  };
}

function getVideoDescription(
  width: number,
  height: number,
  maxBitrate: number,
  gopLengthInSeconds: number,
  timecodeBurninPrefix?: string,
): CfnChannel.VideoDescriptionProperty {
  return {
    name: `_${width}x${height}`,
    width,
    height,
    codecSettings: {
      h264Settings: {
        framerateControl: 'SPECIFIED',
        framerateNumerator: 30000,
        framerateDenominator: 1001,
        parControl: 'SPECIFIED',
        parNumerator: 1,
        parDenominator: 1,
        rateControlMode: 'QVBR',
        maxBitrate: maxBitrate,
        gopSize: gopLengthInSeconds,
        gopSizeUnits: 'SECONDS',
        scanType: 'PROGRESSIVE',
        timecodeBurninSettings: timecodeBurninPrefix ? {
          position: 'TOP_CENTER',
          prefix: `${timecodeBurninPrefix}_${width}x${height}`,
          fontSize: 'SMALL_16',
        } : undefined,
        timecodeInsertion: 'PIC_TIMING_SEI',
      },
    },
  };
}

function getAudioDescription(bitrate: number, sampleRate: number): CfnChannel.AudioDescriptionProperty {
  return {
    name: '_96Kbps_AAC',
    audioTypeControl: 'FOLLOW_INPUT',
    codecSettings: {
      aacSettings: {
        bitrate,
        codingMode: 'CODING_MODE_2_0',
        sampleRate,
      },
    },
    languageCodeControl: 'FOLLOW_INPUT',
    audioSelectorName: 'default',
  };
}

export function getEncoderMidSettings(type: string, id: number): EncoderMidSettings {
  return {
    outputGroupSettingsList: [
      type === 'RTP_PUSH' ? {
        udpGroupSettings: {
          inputLossAction: 'DROP_TS',
        },
      } : {
        rtmpGroupSettings: {
          authenticationScheme: 'COMMON',
          cacheFullBehavior: 'DISCONNECT_IMMEDIATELY',
          cacheLength: 30,
          captionData: 'ALL',
          restartDelay: 15,
        },
      },
    ],
    outputSettingsList: [
      type === 'RTP_PUSH' ? {
        udpOutputSettings: {
          bufferMsec: 1000,
          containerSettings: {
            m2TsSettings: {
              absentInputAudioBehavior: 'ENCODE_SILENCE',
              arib: 'DISABLED',
              aribCaptionsPid: '507',
              aribCaptionsPidControl: 'AUTO',
              audioBufferModel: 'ATSC',
              audioFramesPerPes: 2,
              audioPids: '482-498',
              audioStreamType: 'DVB',
              bufferModel: 'MULTIPLEX',
              ccDescriptor: 'DISABLED',
              dvbSubPids: '460-479',
              dvbTeletextPid: '499',
              ebif: 'NONE',
              ebpAudioInterval: 'VIDEO_INTERVAL',
              ebpPlacement: 'VIDEO_AND_AUDIO_PIDS',
              esRateInPes: 'EXCLUDE',
              etvPlatformPid: '504',
              etvSignalPid: '505',
              klv: 'NONE',
              klvDataPids: '501',
              nielsenId3Behavior: 'NO_PASSTHROUGH',
              patInterval: 100,
              pcrControl: 'PCR_EVERY_PES_PACKET',
              pcrPeriod: 40,
              pmtInterval: 100,
              pmtPid: '480',
              programNum: 1,
              rateMode: 'CBR',
              scte27Pids: '450-459',
              scte35Control: 'NONE',
              scte35Pid: '500',
              segmentationMarkers: 'NONE',
              segmentationStyle: 'MAINTAIN_CADENCE',
              timedMetadataBehavior: 'NO_PASSTHROUGH',
              timedMetadataPid: '502',
              videoPid: '481',
            },
          },
          destination: {
            destinationRefId: `push-output-destination-${id}`,
          },
          fecOutputSettings: {
            rowLength: 20,
            columnDepth: 5,
            includeFec: 'COLUMN_AND_ROW',
          },
        },
      } : {
        rtmpOutputSettings: {
          destination: {
            destinationRefId: `push-output-destination-${id}`,
          },
        },
      },
    ],
    gopLengthInSeconds: 1,
  };
}