
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useLocation } from "react-router-dom";
import { Modal, TextField, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import "./fonts.css";


const TextBox = ({ bbox, text, font, fontSize ,colors}) => {
  console.log("FONTSIZE:",fontSize);
  const style = {
    position: 'absolute',
    top: `${bbox[1]}px`,
    left: `${bbox[0]}px`,
    width: `${bbox[2] - bbox[0]}px`,
    height: `${bbox[3] - bbox[1]}px`,
    fontSize: `${fontSize}px`,
    fontFamily: font,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: colors,
    backgroundColor: 'transparent',
  };

  return (
    <div style={style}>
      {text}
    </div>
  );
};

const EditTextModal = ({ text, onClose, onSave }) => {
  const [updatedText, setUpdatedText] = useState(text);

  const handleSave = () => {
    onSave(updatedText);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div style={{ padding: '1em', marginTop: '7em' }}>
        <TextField style={{ border: '2px solid black' }} value={updatedText} onChange={e => setUpdatedText(e.target.value)} />
        <Button className='btn mt-2 btn-outline-primary' onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  );
};

const ImageEditor = ({ image, textBoxData }) => {
  const imgRef = useRef();
  const [updatedTexts, setUpdatedTexts] = useState(textBoxData.texts);

  const handleTextChange = (index, newText) => {
    const newUpdatedTexts = [...updatedTexts];
    newUpdatedTexts[index] = newText;
    setUpdatedTexts(newUpdatedTexts);
  };

  const handleDownload = async () => {
    const canvas = await html2canvas(imgRef.current);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'image.png';
    link.click();
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: '20px' }}>
        {textBoxData.texts.map((text, index) => (
          <TextField
            key={index}
            label={`Text box ${index + 1}`}
            defaultValue={text}
            onBlur={(e) => handleTextChange(index, e.target.value)}
            style={{ display: 'block', marginBottom: '10px' }}
          />
        ))}
        <div>
        <Button variant="contained" color="primary" onClick={handleDownload}> Download</Button>
        </div>
      </div>
      <div style={{ position: 'relative' }} ref={imgRef}>
        <img src={image} alt="Uploaded" style={{ height: '400px', objectFit: 'contain' }} />
        {textBoxData.bboxes.map((bbox, index) => (
          <TextBox
            key={index}
            bbox={bbox}
            text={updatedTexts[index]}
            font={textBoxData.fonts[index]}
            fontSize={textBoxData.font_sizes[index]}
            colors={textBoxData.colors[index]}
          />
        ))}
      </div>
    </div>
  );
};


const ResultData = () => {
  const location = useLocation();
  const { textBoxData, imageUrl } = location.state;
  console.log(location.state)
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column',
      marginTop: '-95px'  //can move image at top
    }}>
      <ImageEditor image={imageUrl} textBoxData={textBoxData} />
    </div>
  )
}
export default ResultData

