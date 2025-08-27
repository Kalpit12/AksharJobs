# 🎨 RocketJobs Enhanced Loading System

A comprehensive, modern loading animation system designed to provide smooth, clean, and professional loading states throughout the RocketJobs application.

## ✨ Features

- **Multiple Animation Types**: Spinner, Pulse, Dots, Rocket, Skeleton, Shimmer
- **Smooth Animations**: Uses cubic-bezier easing for natural movement
- **Responsive Design**: Automatically adapts to different screen sizes
- **Customizable**: Size, color, and text options
- **Performance Optimized**: CSS-based animations for smooth performance
- **Accessibility**: Proper ARIA labels and screen reader support

## 🚀 Quick Start

### 1. Basic Usage

```jsx
import LoadingSpinner from '../components/LoadingSpinner';

// Simple spinner
<LoadingSpinner />

// With custom text
<LoadingSpinner text="Loading your profile..." />

// Different types
<LoadingSpinner type="pulse" text="Processing..." />
<LoadingSpinner type="dots" text="Please wait..." />
<LoadingSpinner type="rocket" text="Launching..." />
```

### 2. Size Variations

```jsx
<LoadingSpinner size="small" />    // 24px x 24px
<LoadingSpinner size="medium" />   // 48px x 48px
<LoadingSpinner size="large" />    // 64px x 64px
<LoadingSpinner size="xl" />       // 80px x 80px
```

### 3. Color Themes

```jsx
<LoadingSpinner color="primary" />   // Blue (default)
<LoadingSpinner color="success" />   // Green
<LoadingSpinner color="warning" />   // Yellow
<LoadingSpinner color="danger" />    // Red
<LoadingSpinner color="white" />     // White
```

## 🎭 Animation Types

### 1. **Spinner** (Default)
Classic rotating circle with dual-ring effect
```jsx
<LoadingSpinner type="spinner" />
```

### 2. **Pulse**
Gentle scaling animation with gradient background
```jsx
<LoadingSpinner type="pulse" />
```

### 3. **Dots**
Three dots with staggered animation
```jsx
<LoadingSpinner type="dots" />
```

### 4. **Rocket**
Animated rocket icon with bouncing effect
```jsx
<LoadingSpinner type="rocket" />
```

### 5. **Skeleton**
Content placeholder with shimmer effect
```jsx
<SkeletonLoader type="text" lines={3} />
<SkeletonLoader type="card" height="120px" />
<SkeletonLoader type="avatar" height="64px" />
```

## 🔘 Button Loading States

The Button component now supports built-in loading states:

```jsx
import Button from '../components/Button';

const [isLoading, setIsLoading] = useState(false);

<Button 
  loading={isLoading}
  onClick={handleClick}
>
  {isLoading ? 'Saving...' : 'Save Changes'}
</Button>
```

## 🌐 Page Loading Overlay

For full-page loading states:

```jsx
import PageLoadingOverlay from '../components/PageLoadingOverlay';

const [showOverlay, setShowOverlay] = useState(false);

<PageLoadingOverlay 
  isVisible={showOverlay}
  text="Loading your dashboard..."
  type="rocket"
  size="large"
/>
```

## 📱 Responsive Design

All loading components automatically adapt to different screen sizes:

- **Desktop**: Full-size animations with detailed effects
- **Tablet**: Medium-size animations optimized for touch
- **Mobile**: Compact animations with reduced motion when needed

## 🎨 Customization

### CSS Variables

The loading system uses CSS custom properties for easy theming:

```css
:root {
  --loading-primary: #667eea;
  --loading-secondary: #764ba2;
  --loading-success: #10b981;
  --loading-warning: #f59e0b;
  --loading-danger: #ef4444;
}
```

### Custom Animations

You can create custom loading animations by extending the base classes:

```css
.custom-loading {
  /* Your custom styles */
  animation: customSpin 2s ease-in-out infinite;
}

@keyframes customSpin {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}
```

## 📋 Component API Reference

### LoadingSpinner

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | `'spinner'` | Animation type: 'spinner', 'pulse', 'dots', 'rocket' |
| `size` | string | `'medium'` | Size: 'small', 'medium', 'large', 'xl' |
| `text` | string | `'Loading...'` | Loading text to display |
| `showText` | boolean | `true` | Whether to show the loading text |
| `color` | string | `'primary'` | Color theme |
| `className` | string | `''` | Additional CSS classes |

### SkeletonLoader

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | `'card'` | Skeleton type: 'text', 'card', 'avatar', 'list', 'table' |
| `lines` | number | `3` | Number of text lines for text skeletons |
| `height` | string | `'auto'` | Height of the skeleton element |
| `width` | string | `'100%'` | Width of the skeleton element |
| `className` | string | `''` | Additional CSS classes |

### PageLoadingOverlay

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | boolean | `false` | Whether the overlay is visible |
| `text` | string | `'Loading...'` | Loading text |
| `type` | string | `'rocket'` | Loading animation type |
| `size` | string | `'large'` | Loading animation size |
| `backdrop` | boolean | `true` | Whether to show backdrop blur |

## 🔧 Implementation Examples

### 1. Dashboard Loading

```jsx
const [isLoading, setIsLoading] = useState(true);

if (isLoading) {
  return (
    <div className="dashboard-container">
      <LoadingSpinner 
        type="rocket" 
        size="large" 
        text="Loading your dashboard..." 
      />
    </div>
  );
}
```

### 2. Form Submission

```jsx
const [isSubmitting, setIsSubmitting] = useState(false);

<Button 
  loading={isSubmitting}
  disabled={isSubmitting}
  onClick={handleSubmit}
>
  {isSubmitting ? 'Submitting...' : 'Submit Form'}
</Button>
```

### 3. Content Skeleton

```jsx
const [isLoading, setIsLoading] = useState(true);

{isLoading ? (
  <SkeletonLoader type="list" lines={5} />
) : (
  <ActualContent />
)}
```

### 4. Page Transition

```jsx
const [isPageLoading, setIsPageLoading] = useState(false);

<PageLoadingOverlay 
  isVisible={isPageLoading}
  text="Preparing your workspace..."
  type="pulse"
  size="large"
/>
```

## 🎯 Best Practices

1. **Use Appropriate Types**: Choose loading types that match the context
   - `spinner`: General loading
   - `pulse`: Processing operations
   - `dots`: Short waits
   - `rocket`: App launches/transitions
   - `skeleton`: Content loading

2. **Consistent Sizing**: Use consistent sizes within the same context
   - `small`: Inline elements
   - `medium`: Content areas
   - `large`: Full sections
   - `xl`: Page-level loading

3. **Meaningful Text**: Provide clear, actionable loading messages
   - ❌ "Loading..."
   - ✅ "Loading your job recommendations..."
   - ✅ "Processing your application..."

4. **Performance**: Use loading states for operations that take >100ms

## 🚀 Demo Page

Visit `/loading-demo` to see all loading animations in action and test different configurations.

## 🔄 Migration Guide

### From Old Loading System

**Before:**
```jsx
<div className="loading-container">
  <div className="loading-spinner"></div>
  <p>Loading...</p>
</div>
```

**After:**
```jsx
<LoadingSpinner 
  type="spinner" 
  text="Loading..." 
  showText={true}
/>
```

### From Old Button Loading

**Before:**
```jsx
<button disabled={isLoading}>
  {isLoading ? (
    <>
      <div className="btn-spinner"></div>
      <span>Loading...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

**After:**
```jsx
<Button loading={isLoading}>
  Submit
</Button>
```

## 🐛 Troubleshooting

### Common Issues

1. **Animations not smooth**: Ensure CSS animations are enabled in browser
2. **Loading text not showing**: Check `showText` prop and CSS classes
3. **Size not applying**: Verify size prop values match expected options
4. **Colors not working**: Check if custom CSS variables are defined

### Browser Support

- **Modern Browsers**: Full support with smooth animations
- **Older Browsers**: Graceful fallback to basic spinner
- **Mobile**: Optimized for touch devices with reduced motion support

## 📚 Additional Resources

- [CSS Animation Best Practices](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Loading State Design Patterns](https://uxdesign.cc/loading-state-design-patterns-8c8c5c8c8c8c)
- [Performance Optimization](https://web.dev/optimize-webfonts/)

---

**Built with ❤️ for RocketJobs - Making job matching smooth and delightful!**
