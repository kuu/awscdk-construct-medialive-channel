import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Kuu Miyazaki',
  authorAddress: 'miyazaqui@gmail.com',
  cdkVersion: '2.200.1',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.8.9',
  name: 'awscdk-construct-medialive-channel',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/miyazaqui/awscdk-construct-medialive-channel.git',
  keywords: [
    'cdk',
    'cdk-construct',
    'MediaLive',
  ],
  license: 'MIT',
  licensed: true,
  deps: ['aws-cdk-lib', 'constructs'],
  description: 'AWS CDK Construct for deploying MediaLive channel',
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();