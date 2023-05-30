// OpenImagePage.js
import React from 'react';
import { useParams,useLocation } from 'react-router-dom';
import OpenProcessedImage from './OpenProcessedImage';

// OpenImagePage.js 

const ProcessedImagePage = () => {  
    const {ProcessedimageURL } = useParams();  //coming from url 
    const location = useLocation();
    const { fileName } = location.state || {};  
    return (
      <div> 
        <OpenProcessedImage imageUrl = {ProcessedimageURL} fileName = {fileName} />       
      </div> 
    );
}; 
  
  export default ProcessedImagePage; 
  
