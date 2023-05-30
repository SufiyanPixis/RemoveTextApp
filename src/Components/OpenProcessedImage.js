import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import FormData from "form-data";
import logo from "../logo.svg";

const OpenProcessedImage = ({ imageUrl, fileName }) => {
  const canvasRef = useRef(null);
  const [maskfile, setMaskfile] = useState(null);
  const contextRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [brushSize, setBrushSize] = useState(20);
  const [helper, sethelper] = useState(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [log, setlog] = useState(null);
  const [cleaned, setCleaned] = useState(false); // New state variable for cleaned
  const [apiResponse, setApiResponse] = useState({
    fonts: [],
    font_sizes: [],
    texts: [],
    bboxes: [[]],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.src = log || imageUrl;

    image.onload = () => {  
      const canvasAspectRatio = image.width / image.height ; 
      const canvasHeightLimit = 400;
      const canvasWidthLimit = canvasHeightLimit * canvasAspectRatio;
      canvas.width = canvasWidthLimit;
      canvas.height = canvasHeightLimit;
      canvas.style.width = `${canvasWidthLimit}px`;
      canvas.style.height = `${canvasHeightLimit}px`;
      context.lineCap = "round";
      context.strokeStyle = "rgba(255, 255, 0, 0.1)";
      context.lineWidth = brushSize;
      contextRef.current = context;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    context.lineCap = "round";
    context.strokeStyle = "rgba(255, 255, 255, 0.1)";
    context.lineWidth = brushSize;
    contextRef.current = context;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }, [imageUrl, newImage, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    context.lineWidth = brushSize;
    context.strokeStyle = '#ff0000';
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    const context = contextRef.current;
    context.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const handleClean = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === 255 && data[i + 1] === 0 && data[i + 2] === 0) {
        data[i] = data[i + 1] = data[i + 2] = 255;
      } else {
        data[i] = data[i + 1] = data[i + 2] = 0;
      }
    }
    context.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      let file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
      setMaskfile(file);
      const dataUrl = URL.createObjectURL(file);
      // const link = document.createElement('a');
      // link.href = dataUrl; 
      // link.download = 'mask.png';
      // link.click(); 

      let final_data = new FormData();
      final_data.append("input_image", fileName);
      final_data.append("mask", file);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://43.205.56.135:8004/fix-images",
        data: final_data,
      };
      setLoading(true);

      axios
        .request(config)
        .then((response) => {
          const newImageData = `data:image/jpeg;base64,${response.data.image}`;
          setlog(newImageData);
          setTimeout(() => {
            setNewImage(newImageData);
            setLoading(false);
          }, 0);
          setCleaned(true); // Set cleaned to true after successful request
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }, "image/png");
  };

  // const handleNext = () => {
  //   navigate(`/final-processed-image/${encodeURIComponent(log == null ? imageUrl : log)}`);
  // };
  const handleNext = () => { 
    setLoading(true); 
    axios 
      .get("http://43.205.56.135:8004/on_next")   
      .then((response) => { 
        console.log("This is my new api", response.data);
        setTimeout(() => { 
          setApiResponse(response.data);
          setLoading(false);
          navigate("/final-page", {
            state: {
              textBoxData: response.data,
              imageUrl: log||imageUrl,
              
            },
          });
        }, 10000);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };


  const handleBrushSizeChange = (event) => {
    const size = Number(event.target.value);
    setBrushSize(size);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = size;
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(80vh - 60px)",
          }}
        >
          <Oval color="#ffffff" height={50} width={50} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(80vh - 120px)", // Adjusted the height
            marginTop: "60px", // Added marginTop
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            style={{ border: '1px solid #000' }}
          />
          <div
            style={{
             
              background: "rgba(255, 255, 255, 0.3)",
              padding: "13px",
              display: "flex",
              justifyContent: "space-evenly",
              marginTop: "40px",
            }}
          >
            <label htmlFor="brushSize" style={{ color: "#000" }}>Brush <br></br>Size:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={handleBrushSizeChange}
              style={{ width: "200px", background: "#3B81F7" }}
            />

            <div style={{ width: 100 }}></div>
            {!cleaned && ( 
              <button className="btn btn-success btn-clean" onClick={handleClean}>
                Clean 
              </button> 

            )}
            <div style={{ width: 70 }}></div>
            <button className="btn btn-success btn-next" onClick={handleNext}>Add Text</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenProcessedImage;

