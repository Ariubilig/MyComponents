# SplitText Components

A collection of reusable React components that use GSAP's SplitText plugin to create smooth text animations. These components are designed to be highly customizable and can be used anywhere in your React application.

## Components

### 1. SplitTextUp
Animates text by splitting it into lines and animating each line from bottom to top.

### 2. SplitTextEach  
Animates text by splitting it into characters and animating each character from bottom to top.

## Installation

Make sure you have the required dependencies:

```bash
npm install gsap @gsap/react
```

## Usage

### Basic Usage

```jsx
import SplitTextUp from './SplitTextUp';
import SplitTextEach from './SplitTextEach';

function MyComponent() {
  return (
    <div>
      {/* Line-by-line animation */}
      <SplitTextUp delay={0.5}>
        <h1>This text animates line by line</h1>
      </SplitTextUp>

      {/* Character-by-character animation */}
      <SplitTextEach delay={0.5}>
        <h2>This text animates character by character</h2>
      </SplitTextEach>
    </div>
  );
}
```

### Advanced Usage

```jsx
import SplitTextUp from './SplitTextUp';
import SplitTextEach from './SplitTextEach';

function MyComponent() {
  return (
    <div>
      {/* Custom animation settings */}
      <SplitTextUp 
        delay={1}
        duration={1.5}
        stagger={0.15}
        ease="power4.out"
        animateOnScroll={true}
        scrollTriggerStart="top 80%"
        className="my-custom-class"
        style={{ marginTop: '2rem' }}
      >
        <h3>Custom animated text</h3>
      </SplitTextUp>

      {/* Multiple elements */}
      <SplitTextEach 
        delay={0.5}
        stagger={0.02}
        wrapperTag="section"
      >
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Third paragraph</p>
      </SplitTextEach>

      {/* Immediate animation (no scroll trigger) */}
      <SplitTextUp 
        animateOnScroll={false}
        delay={0}
      >
        <h4>Animates immediately</h4>
      </SplitTextUp>
    </div>
  );
}
```

## API Reference

### Common Props

Both components accept the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | React.ReactNode | - | Text content to animate |
| `animateOnScroll` | boolean | `true` | Whether to trigger animation on scroll |
| `delay` | number | `0` | Initial delay before animation starts (seconds) |
| `duration` | number | `1` | Animation duration in seconds |
| `stagger` | number | `0.1` (Up) / `0.03` (Each) | Delay between each element animation |
| `ease` | string | `"power4.out"` | GSAP easing function |
| `scrollTriggerStart` | string | `"top 75%"` | Scroll trigger start position |
| `className` | string | `""` | Additional CSS classes |
| `style` | Object | `{}` | Additional inline styles |
| `wrapperTag` | string | `"div"` | HTML tag for wrapper element |

### SplitTextUp Specific

- Splits text into **lines** using GSAP's `SplitText` with `type: "lines"`
- Default `stagger` is `0.1` (slower for line-by-line animation)
- Handles `text-indent` CSS property automatically

### SplitTextEach Specific

- Splits text into **characters** using GSAP's `SplitText` with `type: "chars"`
- Default `stagger` is `0.03` (faster for character-by-character animation)

## Features

### ✅ Reusable
- Can be used with any text element (h1, h2, p, span, etc.)
- Supports single elements or multiple children
- Flexible wrapper element selection

### ✅ Customizable
- Full control over animation timing and easing
- Custom styling support
- Configurable scroll trigger behavior

### ✅ Robust
- Error handling for split failures
- Automatic cleanup of GSAP instances
- Proper dependency management in useGSAP

### ✅ Performance Optimized
- Uses GSAP's `useGSAP` hook for optimal performance
- Automatic cleanup prevents memory leaks
- Efficient re-rendering with proper dependencies

## Examples

### Hero Section
```jsx
<SplitTextUp delay={0.5} duration={1.2}>
  <h1>Welcome to Our Website</h1>
</SplitTextUp>
<SplitTextEach delay={1.2} stagger={0.03}>
  <p>Discover amazing experiences</p>
</SplitTextEach>
```

### Product Description
```jsx
<SplitTextUp 
  delay={0.3} 
  stagger={0.1}
  className="product-description"
>
  <h2>Premium Quality</h2>
  <p>Handcrafted with care</p>
  <p>Built to last</p>
</SplitTextUp>
```

### Call-to-Action
```jsx
<SplitTextEach 
  animateOnScroll={false}
  delay={0}
  stagger={0.02}
  style={{ color: '#ff6b6b' }}
>
  <h3>Get Started Today</h3>
</SplitTextEach>
```

## Browser Support

- Modern browsers with ES6+ support
- Requires GSAP v3.12+ and @gsap/react
- ScrollTrigger plugin for scroll-based animations

## Notes

- Both components automatically register required GSAP plugins
- Text splitting works best with web-safe fonts
- For optimal performance, avoid animating very long text blocks
- ScrollTrigger animations only trigger once by default