import React from 'react';

function Logo(props) {
  return (
    <img
      alt="Logo"
      src="/static/logo.jpg"
      width="60px"
      height="60px"
      {...props}
      display="none"
      style={{ width: '60px' }}
    />
  );
}

export default Logo;
