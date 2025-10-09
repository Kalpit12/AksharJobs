import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

const AppHelmetProvider = ({ children }) => {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
};

export default AppHelmetProvider;
