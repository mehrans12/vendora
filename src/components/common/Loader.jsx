import React from 'react';

export const Loader = ({ size = 40 }) => (
  <div style={{
    width: size, height: size,
    border: `3px solid #f0f0f0`,
    borderTopColor: '#E62E04',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  }} />
);

export const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
    <div style={{
      width: 48, height: 48,
      border: '4px solid #f0f0f0',
      borderTopColor: '#E62E04',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#888', fontSize: '13px', fontWeight: 500 }}>Loading...</p>
  </div>
);
