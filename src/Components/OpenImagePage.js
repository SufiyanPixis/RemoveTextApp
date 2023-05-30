// OpenImagePage.js
import React from 'react';
import OpenImage from './Openimage';
import { useParams,useLocation  } from 'react-router-dom';

// OpenImagePage.js

const OpenImagePage = () => { 
    const { imageUrl } = useParams();  //coming from url 
    const location = useLocation();
    const { file } = location.state || {};  
    
    return (
      <div>  
        <OpenImage imageUrl={imageUrl} fileName = {file} />       
      </div> 
    );
}; 
  
  export default OpenImagePage;
  
