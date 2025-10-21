# Dashboard Templates - AksharJobs

Complete, ready-to-use dashboard templates for creating new pages.

## 📁 Files Included

### 1. **Recruiter_Dashboard_Complete.html** (Orange Theme)
- Complete recruiter dashboard with all sections
- Features: Job postings, candidates, pipeline, analytics
- Orange gradient sidebar (#FF8A65 → #FF7043)
- Fully responsive with mobile support

### 2. **JobSeeker_Dashboard_Complete.html** (Blue Theme)
- Complete job seeker dashboard with all sections
- Features: Job search, applications, resume, profile
- Blue gradient sidebar (#1976d2 → #1565c0)
- Profile completion tracking

### 3. **Intern_Dashboard_Complete.html** (Green Theme)
- Complete intern dashboard with all sections
- Features: Internship search, applications, academic info, learning
- Green gradient sidebar (#22c55e → #16a34a)
- Academic progress tracking

## 🎨 Theme Colors

| Dashboard | Primary Color | Secondary Color | Gradient |
|-----------|--------------|-----------------|----------|
| **Recruiter** | Orange (#FF9800) | Deep Orange (#F57C00) | #FF8A65 → #FF7043 |
| **Job Seeker** | Blue (#1976D2) | Dark Blue (#1565C0) | #1976d2 → #1565c0 |
| **Intern** | Green (#22C55E) | Dark Green (#16A34A) | #22c55e → #16a34a |

## 🚀 How to Use

### Method 1: Direct Use
1. Open any HTML file in your browser
2. It works standalone with all styles included
3. Modify content as needed for your pages

### Method 2: Extract Components
1. Copy the CSS section (`<style>` tag) for styling
2. Copy the HTML structure for layout
3. Customize the content for your specific page

### Method 3: Template Base
1. Use as a starting point for new pages
2. Keep the sidebar and top bar
3. Replace the content area with your custom content

## 📋 Features Included

### All Dashboards Include:
- ✅ Fixed sidebar with navigation
- ✅ Search bar in top bar
- ✅ User profile section
- ✅ Notification icons
- ✅ Stats cards with icons
- ✅ Multiple page sections
- ✅ Interactive navigation
- ✅ Responsive design
- ✅ Hover effects and transitions
- ✅ Status badges
- ✅ Button styles (primary, secondary, small)
- ✅ Table layouts
- ✅ Card components
- ✅ Alert/notification boxes

## 🎯 Customization Guide

### Changing Colors
Find and replace these in the `<style>` section:
- **Recruiter Orange**: `#ff9800`, `#f57c00`, `#FF8A65`, `#FF7043`
- **Job Seeker Blue**: `#1976d2`, `#1565c0`, `#2196f3`
- **Intern Green**: `#22c55e`, `#16a34a`, `#15803d`

### Adding New Sections
1. Add navigation item in sidebar:
   ```html
   <div class="nav-item" data-section="newsection">
       <i class="fas fa-icon"></i>
       <span>New Section</span>
   </div>
   ```

2. Add content section:
   ```html
   <div class="page-section" id="newsection">
       <h1>New Section</h1>
       <div class="card">
           Your content here
       </div>
   </div>
   ```

### Modifying Stats
Change the numbers and labels in the stats-grid:
```html
<div class="stat-card">
    <div class="stat-header">
        <div>
            <div class="stat-number">YOUR_NUMBER</div>
            <div class="stat-label">YOUR_LABEL</div>
        </div>
        <div class="stat-icon ICON_COLOR">
            <i class="fas fa-YOUR_ICON"></i>
        </div>
    </div>
</div>
```

## 🔧 Technical Details

### Dependencies
- Font Awesome 6.4.0 (CDN) - for icons
- No other external dependencies needed

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### File Structure
- All CSS inline in `<style>` tag
- All JavaScript inline in `<script>` tag
- FontAwesome loaded from CDN
- Self-contained, no external files needed

## 💡 Tips

1. **Keep Consistency**: Use the same theme colors throughout your page
2. **Icons**: Browse Font Awesome for icons: https://fontawesome.com/icons
3. **Responsive**: Test on mobile devices, layouts adapt automatically
4. **Navigation**: JavaScript handles section switching automatically
5. **Customization**: Modify the content areas to match your needs

## 📞 Need Help?

These templates are exact replicas of the AksharJobs dashboards. All styling, layouts, and components are production-ready and tested.

Happy building! 🚀
