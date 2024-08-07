import React from 'react';
import { useLocation } from 'react-router-dom';

const ReloadingRoute = ({ element }) => {
  const location = useLocation();
  const key = location.pathname;

  return React.cloneElement(element, { key });
};

export default ReloadingRoute;
