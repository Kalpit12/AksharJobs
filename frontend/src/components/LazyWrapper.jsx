import React, { Suspense, lazy } from 'react';
import ModernLoadingSpinner from './ModernLoadingSpinner';

// Higher-order component for lazy loading
const withLazyLoading = (Component, fallback = <ModernLoadingSpinner />) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Lazy load heavy components
export const LazyJobSeekerDashboard = withLazyLoading(
  React.lazy(() => import('../pages/JobSeekerDashboard'))
);

export const LazyRecruiterDashboard = withLazyLoading(
  React.lazy(() => import('../pages/RecruiterDashboard'))
);

export const LazyAnalyticsDashboard = withLazyLoading(
  React.lazy(() => import('../pages/AnalyticsDashboard'))
);

export const LazyJobListing = withLazyLoading(
  React.lazy(() => import('../pages/JobListing'))
);

export const LazyAllJobs = withLazyLoading(
  React.lazy(() => import('../pages/AllJobs'))
);

// Image lazy loading component
export const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
      {!isLoaded && isInView && (
        <div style={{
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}>
          <ModernLoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default withLazyLoading;
