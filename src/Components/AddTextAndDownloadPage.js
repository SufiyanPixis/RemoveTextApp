import React from 'react';
import { useParams } from 'react-router-dom';
import AddTextAndDownload from './AddTextAndDownload';

const AddTextAndDownloadPage = () => {   
    const { newImage } = useParams();  //coming from url   
    console.log('Im inside AddTextAndDownloadPage');
    return ( 
      <div>  
        <AddTextAndDownload imageUrl = {newImage}/>       
      </div> 
    );
}; 
  
  export default AddTextAndDownloadPage; 