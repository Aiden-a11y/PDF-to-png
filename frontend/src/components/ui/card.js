// src/components/ui/card.js

import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`border p-4 rounded shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div>{children}</div>;
};
