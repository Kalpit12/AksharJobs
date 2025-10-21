// Dashboard Theme Configuration
export const dashboardThemes = {
  jobSeeker: {
    name: 'JOBSEEKERHUB',
    tagline: 'Your Career Journey',
    primaryColor: '#1976d2',
    secondaryColor: '#1565c0',
    accentColor: '#2196f3',
    backgroundColor: '#e3f2fd',
    sidebarGradient: 'linear-gradient(180deg, #1976d2 0%, #1565c0 100%)',
    cardBackground: '#ffffff',
    textColor: '#212121',
    successColor: '#1976d2',
    warningColor: '#ff9800',
    errorColor: '#f44336',
    icon: 'faBriefcase'
  },
  recruiter: {
    name: 'RECRUITERHUB',
    tagline: 'Find the Best Talent',
    primaryColor: '#ff6b35',
    secondaryColor: '#e55a2b',
    accentColor: '#ff8a65',
    backgroundColor: '#fff3e0',
    sidebarGradient: 'linear-gradient(180deg, #ff6b35 0%, #e55a2b 100%)',
    cardBackground: '#ffffff',
    textColor: '#212121',
    successColor: '#ff6b35',
    warningColor: '#ff9800',
    errorColor: '#f44336',
    icon: 'faUsers'
  },
  admin: {
    name: 'ADMINHUB',
    tagline: 'System Management',
    primaryColor: '#9c27b0',
    secondaryColor: '#7b1fa2',
    accentColor: '#ba68c8',
    backgroundColor: '#f3e5f5',
    sidebarGradient: 'linear-gradient(180deg, #9c27b0 0%, #7b1fa2 100%)',
    cardBackground: '#ffffff',
    textColor: '#212121',
    successColor: '#9c27b0',
    warningColor: '#ff9800',
    errorColor: '#f44336',
    icon: 'faCog'
  }
};

export const getTheme = (dashboardType) => {
  return dashboardThemes[dashboardType] || dashboardThemes.jobSeeker;
};
