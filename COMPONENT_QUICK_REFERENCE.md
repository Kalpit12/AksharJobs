# 🎨 Component Quick Reference Card

## 🚀 New Components Overview

| Component | Purpose | Key Feature | Location |
|-----------|---------|-------------|----------|
| **QuickActionsWidget** | Fast access to common actions | 6 action buttons with glow effects | `components/QuickActionsWidget.jsx` |
| **HiringFunnelVisualization** | Track hiring pipeline | Animated funnel with insights | `components/HiringFunnelVisualization.jsx` |
| **NotificationCenter** | Real-time notifications | Dropdown with badge counter | `components/NotificationCenter.jsx` |
| **DarkModeToggle** | Theme switcher | Animated sun/moon toggle | `components/DarkModeToggle.jsx` |
| **ActivityFeed** | Live activity updates | Real-time feed with filters | `components/ActivityFeed.jsx` |
| **ConfettiAnimation** | Success celebrations | Particle confetti effect | `components/ConfettiAnimation.jsx` |
| **FloatingActionMenu** | Floating FAB menu | Expandable action buttons | `components/FloatingActionMenu.jsx` |
| **EnhancedSkeletonLoader** | Loading states | Shimmer skeleton screens | `components/EnhancedSkeletonLoader.jsx` |
| **ParticleEffects** | Background animation | Interactive particle network | `components/ParticleEffects.jsx` |
| **Card3D** | 3D card wrapper | Parallax tilt effect | `components/Card3D.jsx` |

---

## 📋 Usage Examples

### Quick Actions Widget
```jsx
<QuickActionsWidget
  onPostJob={() => setShowPostJobModal(true)}
  onViewCandidates={() => navigate('/candidates')}
  onScheduleInterview={() => navigate('/schedule')}
  onViewAnalytics={() => navigate('/analytics')}
/>
```

### Hiring Funnel
```jsx
<HiringFunnelVisualization 
  applications={applicationsArray}
/>
```

### Notification Center
```jsx
<NotificationCenter />
// No props needed - handles state internally
```

### Dark Mode Toggle
```jsx
<DarkModeToggle />
// Auto-persists to localStorage
```

### Activity Feed
```jsx
<ActivityFeed />
// Auto-refreshes every 30 seconds
```

### Confetti Animation
```jsx
const [trigger, setTrigger] = useState(0);

<ConfettiAnimation 
  trigger={trigger} 
  duration={3000} 
  particleCount={100} 
/>

// Trigger it:
setTrigger(prev => prev + 1);
```

### Floating Action Menu
```jsx
<FloatingActionMenu
  onPostJob={handlePostJob}
  onAIAssist={handleAIAssist}
  onBulkAction={handleBulkAction}
  onExport={handleExport}
/>
```

### Skeleton Loader
```jsx
// While loading
{loading && <EnhancedSkeletonLoader type="dashboard" />}

// Card skeleton
<EnhancedSkeletonLoader type="card" />

// Table skeleton
<EnhancedSkeletonLoader type="table" rows={10} />
```

### Particle Effects
```jsx
<ParticleEffects 
  density={30}           // Number of particles
  color="#667eea"        // Particle color
  maxSpeed={0.3}         // Animation speed
  interactive={true}     // Mouse interaction
/>
```

### 3D Card Wrapper
```jsx
<Card3D intensity={15}>
  <YourCardContent />
</Card3D>
```

---

## 🎨 CSS Classes Reference

### Glassmorphism
```css
.glass-card              /* Main glass effect */
.glass-card::before      /* Gradient overlay */
```

### 3D Effects
```css
.card-3d                 /* 3D card container */
.card-3d-glare           /* Holographic glare */
.card-3d-holographic     /* Holographic variant */
.card-3d-float           /* Floating animation */
```

### Skeleton Loaders
```css
.shimmer                 /* Shimmer animation */
.skeleton-pulse          /* Pulse animation */
.skeleton-wave           /* Wave animation */
```

### Animations
```css
@keyframes slideInUp     /* Slide up entrance */
@keyframes fadeIn        /* Fade in */
@keyframes pulse         /* Pulse effect */
@keyframes float         /* Floating motion */
@keyframes shimmer       /* Loading shimmer */
@keyframes confetti-fall /* Confetti particles */
```

---

## 🌈 Color Reference

### Primary Gradients
```css
/* Purple Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Pink Gradient */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Cyan Gradient */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Green Gradient */
background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
```

### Status Colors
```css
--success: #10b981;      /* Green */
--warning: #f59e0b;      /* Amber */
--error: #ef4444;        /* Red */
--info: #3b82f6;         /* Blue */
```

---

## ⚡ Quick Tips

### Performance
- Use `will-change` for animated properties
- Limit particle count on mobile (< 30)
- Lazy load heavy components
- Use skeleton loaders for perceived performance

### Accessibility
- All interactive elements have `aria-label`
- Keyboard navigation works everywhere
- Color contrast meets WCAG AA
- Focus indicators are visible

### Mobile
- 3D effects auto-disable on mobile
- Touch-optimized button sizes (min 44px)
- Simplified animations for better performance
- Responsive breakpoints: 768px, 1024px, 1280px

---

## 🔧 Customization Guide

### Change Primary Color
```css
/* In DarkModeToggle.css or your main styles */
--primary-color: #667eea;  /* Change this */
```

### Adjust Animation Speed
```css
/* In component CSS files */
transition: all 0.3s ease;  /* Change 0.3s */
```

### Modify Particle Density
```jsx
<ParticleEffects density={50} />  /* Increase/decrease */
```

### Change Confetti Colors
```jsx
// In ConfettiAnimation.jsx
const colors = [
  '#667eea',  // Add or modify colors
  '#764ba2',
  // ...more colors
];
```

---

## 🐛 Common Issues & Fixes

### Issue: Glassmorphism not working
```css
/* Ensure these are present */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
```

### Issue: 3D effect not smooth
```javascript
// Add to Card3D component
will-change: transform;
```

### Issue: Particles causing lag
```javascript
// Reduce density
<ParticleEffects density={20} />  // Lower value
```

### Issue: Dark mode not switching
```javascript
// Clear localStorage and retry
localStorage.removeItem('darkMode');
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

---

## 🎯 Testing Checklist

- [ ] All animations smooth (60fps)
- [ ] No layout shift on load
- [ ] Dark mode works properly
- [ ] Responsive on mobile
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] Performance optimized
- [ ] No console errors

---

## 📞 Support

For issues or questions:
1. Check `DASHBOARD_ENHANCEMENTS_GUIDE.md` for detailed docs
2. Review component source code
3. Check browser console for errors
4. Test in different browsers

---

**Quick Start:** Import → Use → Customize → Enjoy! 🎉

