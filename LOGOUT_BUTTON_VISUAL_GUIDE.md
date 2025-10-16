# Logout Button - Visual Guide

## Location

The logout button is positioned in the **top-right corner** of the dashboard, in the top bar next to the user profile section.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Search Bar...                    [🔔] [?] [User Profile] [Logout]  │
└─────────────────────────────────────────────────────────────────────┘
```

## Visual Appearance

### Normal State
```
┌──────────────────┐
│  🚪  Logout      │  ← Red gradient background (#ff4757 → #e84118)
└──────────────────┘    White text
                        Rounded corners
```

### Hover State
```
┌──────────────────┐
│  🚪  Logout      │  ← Lighter red gradient
└──────────────────┘    Slightly elevated (translateY(-2px))
     ╲   ╱            Enhanced shadow
      ╲ ╱
       ▼
```

### Active/Clicked State
```
┌──────────────────┐
│  🚪  Logout      │  ← Returns to normal position
└──────────────────┘    Reduced shadow
```

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Clicks Logout                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        "Are you sure you want to logout?" [Yes] [No]        │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼ Yes                 ▼ No
┌─────────────────┐    ┌────────────────┐
│  Clear Storage  │    │ Stay Logged In │
│  - localStorage │    │  (No changes)  │
│  - sessionStorage│   └────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reset State    │
│  - user = null  │
│  - isAuth = false│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  "You have been successfully    │
│   logged out!" [OK]             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│ Redirect to     │
│ Login Page      │
└─────────────────┘
```

## Top Bar Layout (Desktop)

```
╔═══════════════════════════════════════════════════════════════════════╗
║  Dashboard Header                                                     ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  ┌────────────────────────────────┐                                  ║
║  │  🔍  Search jobs, companies... │   [🔔]  [❓]  [👤 John]  [🚪 Logout] ║
║  └────────────────────────────────┘                                  ║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## Top Bar Layout (Mobile)

```
╔══════════════════════════════════╗
║  Dashboard Header                ║
╠══════════════════════════════════╣
║                                  ║
║  ┌──────────────────────────┐   ║
║  │  🔍  Search...           │   ║
║  └──────────────────────────┘   ║
║                                  ║
║  [🔔] [❓] [👤] [🚪 Logout]      ║
║                                  ║
╚══════════════════════════════════╝
```

## Color Scheme

### Primary Button (Blue - for actions)
- Background: `linear-gradient(135deg, #1976d2 0%, #1565c0 100%)`
- Color: White
- Use: Primary actions like "Apply", "Save", "Edit"

### Logout Button (Red - for caution)
- Background: `linear-gradient(135deg, #ff4757 0%, #e84118 100%)`
- Color: White
- Use: Logout action (destructive action)

### Hover Effect
- Background: Lighter shade
- Transform: `translateY(-2px)` (elevates button)
- Shadow: Increased shadow for depth

## Icon Details

**Icon:** FontAwesome `fa-sign-out-alt` (🚪)
- Size: 14px
- Color: White
- Position: Left of text
- Gap: 8px between icon and text

## Responsive Behavior

### Desktop (> 768px)
- Full button with icon and text
- Padding: 10px 20px
- Font size: 14px

### Tablet (768px - 480px)
- Full button with icon and text
- Slightly smaller padding
- Font size: 13px

### Mobile (< 480px)
- Icon only version (optional)
- Text hidden on very small screens
- Padding: 10px
- Tooltip shows "Logout" on hover

## Accessibility

### Keyboard Navigation
- ✅ Tab-accessible
- ✅ Enter/Space to activate
- ✅ Escape to cancel confirmation

### Screen Readers
- ✅ ARIA label: "Logout"
- ✅ Role: "button"
- ✅ Focus indicators visible

### Color Contrast
- ✅ WCAG AA compliant
- ✅ Text contrast ratio: 4.5:1 minimum
- ✅ Focus outline visible

## Testing Screenshot Locations

To verify the logout button is working:

1. **HTML Dashboard:**
   - File: `c:\Users\kalpi\Desktop\Job_Seeker_Dashboard_Enhanced.html`
   - Open in browser
   - Look for red "Logout" button in top-right

2. **React Dashboard:**
   - Navigate to: `http://localhost:3000/jobseeker-dashboard`
   - Look for red "Logout" button in top-right

## Expected Behavior After Logout

1. **Browser redirects to:**
   - HTML: `/login.html`
   - React: `/login`

2. **Storage cleared:**
   ```
   localStorage.length === 0  // All items removed
   sessionStorage.length === 0  // All items removed
   ```

3. **Cannot access protected routes:**
   - Attempting to access `/jobseeker-dashboard` redirects to login
   - Attempting to access `/recruiter-dashboard` redirects to login

4. **Login works after logout:**
   - User can login again with same credentials
   - No stale data persists

