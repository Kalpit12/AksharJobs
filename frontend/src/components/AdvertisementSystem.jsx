import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AdvertisementSystem.css';
import { 
  faPlane, 
  faHome, 
  faMountain, 
  faCar, 
  faUtensils, 
  faShoppingBag,
  faTimes,
  faChevronRight,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import './AdvertisementSystem.css';

const AdvertisementSystem = ({ placement = 'sidebar' }) => {
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);


  // Advertisement data for different business verticals with real images and videos
  const advertisements = [
    {
      id: 1,
      type: 'flight',
      title: 'Kenya Airways',
      subtitle: 'Fly to 50+ Destinations',
      description: 'Book your next business trip with Kenya Airways. Special corporate rates available.',
      cta: 'Book Now',
      icon: faPlane,
      color: '#1E40AF',
      bgColor: '#EFF6FF',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      video: null,
      discount: '15% OFF',
      validUntil: 'Dec 31, 2024'
    },
    {
      id: 2,
      type: 'property',
      title: 'Prime Properties',
      subtitle: 'Luxury Real Estate',
      description: 'Find your dream office space or investment property in Nairobi.',
      cta: 'View Properties',
      icon: faHome,
      color: '#059669',
      bgColor: '#ECFDF5',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      video: null,
      discount: 'Free Consultation',
      validUntil: 'Ongoing'
    },
    {
      id: 3,
      type: 'tourism',
      title: 'Maasai Mara Tours',
      subtitle: 'Safari Adventures',
      description: 'Experience the wild beauty of Kenya with our premium safari packages.',
      cta: 'Explore Tours',
      icon: faMountain,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      video: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35580b8e128&profile_id=165&oauth2_token_id=57447761',
      discount: '20% OFF',
      validUntil: 'Mar 31, 2025'
    },
    {
      id: 4,
      type: 'transport',
      title: 'City Cabs',
      subtitle: 'Reliable Transport',
      description: 'Professional chauffeur services for your business meetings.',
      cta: 'Book Ride',
      icon: faCar,
      color: '#7C3AED',
      bgColor: '#F3E8FF',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      video: null,
      discount: 'First Ride Free',
      validUntil: 'Jan 31, 2025'
    },
    {
      id: 5,
      type: 'dining',
      title: 'Culinary Delights',
      subtitle: 'Fine Dining',
      description: 'Host your business dinners at Nairobi\'s finest restaurants.',
      cta: 'Reserve Table',
      icon: faUtensils,
      color: '#EA580C',
      bgColor: '#FFF7ED',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      video: null,
      discount: '10% OFF',
      validUntil: 'Feb 28, 2025'
    },
    {
      id: 6,
      type: 'shopping',
      title: 'Business Essentials',
      subtitle: 'Office Supplies',
      description: 'Everything you need for your office, delivered same day.',
      cta: 'Shop Now',
      icon: faShoppingBag,
      color: '#0891B2',
      bgColor: '#F0F9FF',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      video: null,
      discount: 'Free Delivery',
      validUntil: 'Ongoing'
    }
  ];

  // Rotate advertisements every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % advertisements.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [advertisements.length]);

  // Reset image loading state when ad changes
  useEffect(() => {
    setImageLoading(true);
    setImageError(false);
    setVideoPlaying(false);
  }, [currentAd]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setVideoPlaying(false);
  };

  const handleAdClick = (ad) => {
    // Track ad clicks for analytics
    console.log(`Ad clicked: ${ad.title}`);
    // In a real implementation, you would track this with analytics
    // For now, we'll just show an alert
    alert(`Redirecting to ${ad.title} - ${ad.cta}`);
  };

  const handleCloseAd = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    console.log('Advertisement not visible, returning null');
    return null;
  }

  // Ensure we have advertisements data
  if (!advertisements || advertisements.length === 0) {
    console.error('No advertisements data available');
    return <div>No advertisements available</div>;
  }

  const ad = advertisements[currentAd];

  return (
    <div className={`advertisement-container ${placement}`}>
      <div className="ad-header">
        <span className="ad-label">Sponsored</span>
        <button className="close-ad-btn" onClick={handleCloseAd}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      <div 
        className="ad-card"
        style={{ 
          '--ad-color': ad.color,
          '--ad-bg-color': ad.bgColor 
        }}
        onClick={() => handleAdClick(ad)}
      >
        <div className="ad-image-container">
          {ad.video ? (
            <div className="ad-video-container">
              <video
                className="ad-video"
                poster={ad.image}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                muted
                loop
                playsInline
              >
                <source src={ad.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="ad-video-overlay">
                <FontAwesomeIcon icon={ad.icon} className="ad-icon" />
              </div>
            </div>
          ) : (
            <div className="ad-image-wrapper">
              {imageLoading && (
                <div className="ad-image-placeholder">
                  <FontAwesomeIcon icon={ad.icon} className="ad-icon" />
                </div>
              )}
              {imageError ? (
                <div className="ad-image-placeholder">
                  <FontAwesomeIcon icon={ad.icon} className="ad-icon" />
                </div>
              ) : (
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="ad-image"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              )}
            </div>
          )}
          {ad.discount && (
            <div className="ad-discount-badge">
              {ad.discount}
            </div>
          )}
        </div>
        
        <div className="ad-content">
          <div className="ad-title-section">
            <h3 className="ad-title">{ad.title}</h3>
            <p className="ad-subtitle">{ad.subtitle}</p>
          </div>
          
          <p className="ad-description">{ad.description}</p>
          
          <div className="ad-footer">
            <button className="ad-cta-btn">
              {ad.cta}
              <FontAwesomeIcon icon={faChevronRight} className="cta-icon" />
            </button>
            <div className="ad-validity">
              Valid until: {ad.validUntil}
            </div>
          </div>
        </div>
      </div>
      
      <div className="ad-indicators">
        {advertisements.map((_, index) => (
          <div 
            key={index}
            className={`ad-dot ${index === currentAd ? 'active' : ''}`}
            onClick={() => setCurrentAd(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdvertisementSystem;
