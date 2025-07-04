# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### MediaLive <a name="MediaLive" id="awscdk-construct-medialive-channel.MediaLive"></a>

#### Initializers <a name="Initializers" id="awscdk-construct-medialive-channel.MediaLive.Initializer"></a>

```typescript
import { MediaLive } from 'awscdk-construct-medialive-channel'

new MediaLive(scope: Construct, id: string, props: MediaLiveProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.Initializer.parameter.props">props</a></code> | <code><a href="#awscdk-construct-medialive-channel.MediaLiveProps">MediaLiveProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="awscdk-construct-medialive-channel.MediaLive.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="awscdk-construct-medialive-channel.MediaLive.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="awscdk-construct-medialive-channel.MediaLive.Initializer.parameter.props"></a>

- *Type:* <a href="#awscdk-construct-medialive-channel.MediaLiveProps">MediaLiveProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="awscdk-construct-medialive-channel.MediaLive.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="awscdk-construct-medialive-channel.MediaLive.isConstruct"></a>

```typescript
import { MediaLive } from 'awscdk-construct-medialive-channel'

MediaLive.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="awscdk-construct-medialive-channel.MediaLive.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.property.channel">channel</a></code> | <code>aws-cdk-lib.aws_medialive.CfnChannel</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLive.property.inputs">inputs</a></code> | <code>aws-cdk-lib.aws_medialive.CfnInput[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="awscdk-construct-medialive-channel.MediaLive.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `channel`<sup>Required</sup> <a name="channel" id="awscdk-construct-medialive-channel.MediaLive.property.channel"></a>

```typescript
public readonly channel: CfnChannel;
```

- *Type:* aws-cdk-lib.aws_medialive.CfnChannel

---

##### `inputs`<sup>Required</sup> <a name="inputs" id="awscdk-construct-medialive-channel.MediaLive.property.inputs"></a>

```typescript
public readonly inputs: CfnInput[];
```

- *Type:* aws-cdk-lib.aws_medialive.CfnInput[]

---


## Structs <a name="Structs" id="Structs"></a>

### EncoderMidSettings <a name="EncoderMidSettings" id="awscdk-construct-medialive-channel.EncoderMidSettings"></a>

#### Initializer <a name="Initializer" id="awscdk-construct-medialive-channel.EncoderMidSettings.Initializer"></a>

```typescript
import { EncoderMidSettings } from 'awscdk-construct-medialive-channel'

const encoderMidSettings: EncoderMidSettings = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.gopLengthInSeconds">gopLengthInSeconds</a></code> | <code>number</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.outputGroupSettingsList">outputGroupSettingsList</a></code> | <code>aws-cdk-lib.aws_medialive.CfnChannel.OutputGroupSettingsProperty[]</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.outputSettingsList">outputSettingsList</a></code> | <code>aws-cdk-lib.aws_medialive.CfnChannel.OutputSettingsProperty[]</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.framerateDenominator">framerateDenominator</a></code> | <code>number</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.framerateNumerator">framerateNumerator</a></code> | <code>number</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.height">height</a></code> | <code>number</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.scanType">scanType</a></code> | <code>string</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.timecodeBurninPrefix">timecodeBurninPrefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings.property.width">width</a></code> | <code>number</code> | *No description.* |

---

##### `gopLengthInSeconds`<sup>Required</sup> <a name="gopLengthInSeconds" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.gopLengthInSeconds"></a>

```typescript
public readonly gopLengthInSeconds: number;
```

- *Type:* number

---

##### `outputGroupSettingsList`<sup>Required</sup> <a name="outputGroupSettingsList" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.outputGroupSettingsList"></a>

```typescript
public readonly outputGroupSettingsList: OutputGroupSettingsProperty[];
```

- *Type:* aws-cdk-lib.aws_medialive.CfnChannel.OutputGroupSettingsProperty[]

---

##### `outputSettingsList`<sup>Required</sup> <a name="outputSettingsList" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.outputSettingsList"></a>

```typescript
public readonly outputSettingsList: OutputSettingsProperty[];
```

- *Type:* aws-cdk-lib.aws_medialive.CfnChannel.OutputSettingsProperty[]

---

##### `framerateDenominator`<sup>Optional</sup> <a name="framerateDenominator" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.framerateDenominator"></a>

```typescript
public readonly framerateDenominator: number;
```

- *Type:* number

---

##### `framerateNumerator`<sup>Optional</sup> <a name="framerateNumerator" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.framerateNumerator"></a>

```typescript
public readonly framerateNumerator: number;
```

- *Type:* number

---

##### `height`<sup>Optional</sup> <a name="height" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.height"></a>

```typescript
public readonly height: number;
```

- *Type:* number

---

##### `scanType`<sup>Optional</sup> <a name="scanType" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.scanType"></a>

```typescript
public readonly scanType: string;
```

- *Type:* string

---

##### `timecodeBurninPrefix`<sup>Optional</sup> <a name="timecodeBurninPrefix" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.timecodeBurninPrefix"></a>

```typescript
public readonly timecodeBurninPrefix: string;
```

- *Type:* string

---

##### `width`<sup>Optional</sup> <a name="width" id="awscdk-construct-medialive-channel.EncoderMidSettings.property.width"></a>

```typescript
public readonly width: number;
```

- *Type:* number

---

### MediaLiveProps <a name="MediaLiveProps" id="awscdk-construct-medialive-channel.MediaLiveProps"></a>

#### Initializer <a name="Initializer" id="awscdk-construct-medialive-channel.MediaLiveProps.Initializer"></a>

```typescript
import { MediaLiveProps } from 'awscdk-construct-medialive-channel'

const mediaLiveProps: MediaLiveProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#awscdk-construct-medialive-channel.MediaLiveProps.property.destinations">destinations</a></code> | <code>aws-cdk-lib.aws_medialive.CfnChannel.OutputDestinationProperty[]</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLiveProps.property.encoderSpec">encoderSpec</a></code> | <code><a href="#awscdk-construct-medialive-channel.EncoderMidSettings">EncoderMidSettings</a> \| aws-cdk-lib.aws_medialive.CfnChannel.EncoderSettingsProperty</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLiveProps.property.sources">sources</a></code> | <code><a href="#awscdk-construct-medialive-channel.SourceSpec">SourceSpec</a>[]</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLiveProps.property.channelClass">channelClass</a></code> | <code>string</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLiveProps.property.secret">secret</a></code> | <code>aws-cdk-lib.aws_secretsmanager.ISecret</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.MediaLiveProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_medialive.CfnChannel.VpcOutputSettingsProperty</code> | *No description.* |

---

##### `destinations`<sup>Required</sup> <a name="destinations" id="awscdk-construct-medialive-channel.MediaLiveProps.property.destinations"></a>

```typescript
public readonly destinations: OutputDestinationProperty[];
```

- *Type:* aws-cdk-lib.aws_medialive.CfnChannel.OutputDestinationProperty[]

---

##### `encoderSpec`<sup>Required</sup> <a name="encoderSpec" id="awscdk-construct-medialive-channel.MediaLiveProps.property.encoderSpec"></a>

```typescript
public readonly encoderSpec: EncoderMidSettings | EncoderSettingsProperty;
```

- *Type:* <a href="#awscdk-construct-medialive-channel.EncoderMidSettings">EncoderMidSettings</a> | aws-cdk-lib.aws_medialive.CfnChannel.EncoderSettingsProperty

---

##### `sources`<sup>Required</sup> <a name="sources" id="awscdk-construct-medialive-channel.MediaLiveProps.property.sources"></a>

```typescript
public readonly sources: SourceSpec[];
```

- *Type:* <a href="#awscdk-construct-medialive-channel.SourceSpec">SourceSpec</a>[]

---

##### `channelClass`<sup>Optional</sup> <a name="channelClass" id="awscdk-construct-medialive-channel.MediaLiveProps.property.channelClass"></a>

```typescript
public readonly channelClass: string;
```

- *Type:* string

---

##### `secret`<sup>Optional</sup> <a name="secret" id="awscdk-construct-medialive-channel.MediaLiveProps.property.secret"></a>

```typescript
public readonly secret: ISecret;
```

- *Type:* aws-cdk-lib.aws_secretsmanager.ISecret

---

##### `vpc`<sup>Optional</sup> <a name="vpc" id="awscdk-construct-medialive-channel.MediaLiveProps.property.vpc"></a>

```typescript
public readonly vpc: VpcOutputSettingsProperty;
```

- *Type:* aws-cdk-lib.aws_medialive.CfnChannel.VpcOutputSettingsProperty

---

### SourceSpec <a name="SourceSpec" id="awscdk-construct-medialive-channel.SourceSpec"></a>

#### Initializer <a name="Initializer" id="awscdk-construct-medialive-channel.SourceSpec.Initializer"></a>

```typescript
import { SourceSpec } from 'awscdk-construct-medialive-channel'

const sourceSpec: SourceSpec = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#awscdk-construct-medialive-channel.SourceSpec.property.url">url</a></code> | <code>string</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.SourceSpec.property.conversionSpec">conversionSpec</a></code> | <code>aws-cdk-lib.aws_medialive.CfnChannel.EncoderSettingsProperty</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.SourceSpec.property.conversionType">conversionType</a></code> | <code>string</code> | *No description.* |
| <code><a href="#awscdk-construct-medialive-channel.SourceSpec.property.type">type</a></code> | <code>string</code> | *No description.* |

---

##### `url`<sup>Required</sup> <a name="url" id="awscdk-construct-medialive-channel.SourceSpec.property.url"></a>

```typescript
public readonly url: string;
```

- *Type:* string

---

##### `conversionSpec`<sup>Optional</sup> <a name="conversionSpec" id="awscdk-construct-medialive-channel.SourceSpec.property.conversionSpec"></a>

```typescript
public readonly conversionSpec: EncoderSettingsProperty;
```

- *Type:* aws-cdk-lib.aws_medialive.CfnChannel.EncoderSettingsProperty

---

##### `conversionType`<sup>Optional</sup> <a name="conversionType" id="awscdk-construct-medialive-channel.SourceSpec.property.conversionType"></a>

```typescript
public readonly conversionType: string;
```

- *Type:* string

---

##### `type`<sup>Optional</sup> <a name="type" id="awscdk-construct-medialive-channel.SourceSpec.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

---



