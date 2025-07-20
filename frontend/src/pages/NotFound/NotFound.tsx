import React from 'react';
import './NotFound.css'
interface NotFoundPageProps {}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
  return (
    <div className="not-found-container">
        <div className='image-container'></div>
        <div className='error-content'>
            <div className="error-code">404 <span className='square-dot'></span></div>
            <h1 className="error-title">Oooooooops!</h1>
            <button className='button-group' onClick={() => window.history.back()}> Go Back </button>
        </div>
    </div>
  );
};

export default NotFoundPage;