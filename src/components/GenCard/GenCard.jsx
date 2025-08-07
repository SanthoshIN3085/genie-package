import React from 'react';

const GenCard = ({ children, className = '' }) => {
    return <div className={`gen-card-box ${className}`}>{children}</div>;
};
export default GenCard;
