# 3d-shape-particle-text

A high-performance React component for rendering interactive 3D particle systems that morph between a brain-like structure and custom text. Built with React and Three.js.

## Features

- **Particle Morphing**: Smooth transitions between 3D shapes and text.
- **Interactive**: Responds to mouse hover and rotation.
- **Customizable**: Configurable colors, particle counts, lightning effects, and more.
- **Responsive**: Automatically adjusts to container size.

## Installation

```bash
npm install 3d-shape-particle-text three
# or
yarn add 3d-shape-particle-text three
```

> **Note**: This package requires `react`, `react-dom`, and `three` as peer dependencies.

## Usage

Here is a standard configuration matching the default theme:

```jsx
import { ShapeParticleText } from '3d-shape-particle-text';

function App() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ShapeParticleText
        text="AI"
        particleCount={26000}
        particleSize={0.01}
        primaryColor={{ r: 0.396, g: 0.239, b: 0.820 }} // #653DD1
        secondaryColor={{ r: 0.537, g: 0.239, b: 0.820 }} // #893DD1
        backgroundColor="#000000"
        lightningColor="#ffffff"
        globeColor="#653DD1"
        morphDuration={2.5}
        rotationSpeed={0.1}
        hoverIntensity={0.05}
        lightningIntensity={1.7}
        zapSpread={0.7}
        zapWidth={0.003}
        globeOpacity={0.15}
        showGlobe={true}
        glowEffect={true}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text` | `string` | `'AI'` | The text to morph into. |
| `particleCount` | `number` | `24000` | Total number of particles. |
| `particleSize` | `number` | `0.01` | Size of individual particles. |
| `primaryColor` | `object` \| `string` | `{r: 0.396, g: 0.239, b: 0.820}` | Primary color of the brain structure. |
| `secondaryColor` | `object` \| `string` | `{r: 0.537, g: 0.239, b: 0.820}` | Secondary color for gradients and connections. |
| `backgroundColor` | `string` | `'#000000'` | Background color of the canvas. |
| `transparent` | `boolean` | `false` | Whether the canvas background is transparent. |
| `morphDuration` | `number` | `2.5` | Duration of the morph animation in seconds. |
| `rotationSpeed` | `number` | `0.4` | Speed of the idle rotation. |
| `hoverIntensity` | `number` | `0.05` | Intensity of the mouse hover tilt effect. |
| `lightningIntensity` | `number` | `1.0` | Frequency of lightning effects (0 to disable). |
| `lightningColor` | `object` \| `string` | `null` | Color of lightning bolts. If null, uses random colors. |
| `zapSpread` | `number` | `0.7` | Spread amplitude of lightning bolts. |
| `zapWidth` | `number` | `0.02` | Thickness of lightning bolts. |
| `cameraDistance` | `number` | `5.5` | Distance of the camera from the center. |
| `globeOpacity` | `number` | `0.08` | Opacity of the surrounding wireframe globe. |
| `globeColor` | `object` \| `string` | `null` | Color of the wireframe globe. If null, uses `primaryColor`. |
| `showGlobe` | `boolean` | `true` | Whether to render the wireframe globe. |
| `glowEffect` | `boolean` | `true` | Enables additive blending for a glow effect. |
| `className` | `string` | `''` | Custom CSS class for the container. |
| `style` | `object` | `{}` | Custom inline styles for the container. |

## License

MIT
