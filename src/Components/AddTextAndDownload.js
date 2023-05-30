
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const AddTextAndDownload = ({ imageUrl }) => {
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [annotatedImageUrl, setAnnotatedImageUrl] = useState(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 10, y: 140 });
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    fonts: [],
    font_sizes: [],
    texts: [],
    bboxes: [[]],
  });
  const [responseImageUrl, setResponseImageUrl] = useState(null);
  const [image, setImage] = useState(null);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = responseImageUrl || imageUrl;
    link.download = "image.jpg";
    link.click();
  };

  const handleAddText = () => { 
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
              imageUrl: imageUrl,
              
            },
          });
        }, 10000);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    setIsAddingText(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      context.font = "100px Times New Roman";
      context.fillStyle = "#000000";
      context.fillText(textInput, textPosition.x, textPosition.y);
      setResponseImageUrl(canvas.toDataURL());
    };
  };

  useEffect(() => {
    if (apiResponse.fonts.length > 0) {
      if (imageRef.current && canvasRef.current && apiResponse) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
          setOriginalDimensions({
            width: img.width,
            height: img.height,
          });
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          apiResponse.bboxes.forEach((bbox, index) => {
            const scaledBbox = bbox.map((value, i) => {
              if (i % 2 === 0) {
                // Scale x-coordinate
                return (value * canvas.width) / img.width;
              } else {
                // Scale y-coordinate
                return (value * canvas.height) / img.height;
              }
            });

            const textStyle = {
              position: "absolute",
              left: scaledBbox[0],
              top: scaledBbox[1],
              width: scaledBbox[2] - scaledBbox[0],
              height: scaledBbox[3] - scaledBbox[1],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily:
                apiResponse.fonts[index % apiResponse.fonts.length],
              fontSize:
                apiResponse.font_sizes[index % apiResponse.font_sizes.length],
              color: "#000000",
              pointerEvents: "none",
            };

            const boxStyle = {
              position: "absolute",
              left: scaledBbox[0],
              top: scaledBbox[1],
              width: scaledBbox[2] - scaledBbox[0],
              height: scaledBbox[3] - scaledBbox[1],
              border: "2px solid red",
            };

            const textBox = document.createElement("div");
            Object.assign(textBox.style, textStyle);
            const boxElement = document.createElement("div");
            Object.assign(boxElement.style, boxStyle);
            canvas.parentNode.appendChild(boxElement);
            canvas.parentNode.appendChild(textBox);
            textBox.innerText = apiResponse.texts[index];
          });
          setResponseImageUrl(canvas.toDataURL());
        };
      }
    }
  }, [apiResponse, imageUrl]);
  const aspectRatio = originalDimensions.width / originalDimensions.height;
  const adjustedHeight = 400;
  const adjustedWidth = adjustedHeight * aspectRatio;
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setTextPosition({ x: offsetX, y: offsetY });
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "40px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleAddText}
          style={{
            marginLeft: "10px",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "10px",
            cursor: "pointer",
            marginRight: "5px"
          }}
        >
          Add Text
        </button>
        <button
          onClick={handleDownload}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#4CAF50",
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            color: "#fff",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#388E3C")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          <FontAwesomeIcon icon={faDownload} />
          Download
        </button>

      </div>

      {loading ? (
        <img
          className="image"
          src={image || imageUrl}
          width={adjustedWidth}
          height={adjustedHeight}
          alt="Image"
          ref={imageRef}
          onClick={handleImageClick}
          border="1px solid black"
          style={{
            animation: "blink 1s linear infinite",

          }}
        />
      ) : (
        <img
          className="image"
          src={image || imageUrl}
          width={adjustedWidth}
          height={adjustedHeight}
          alt="Image"
          ref={imageRef}
          onClick={handleImageClick}
          border="1px solid black"

        />
      )}

      {isAddingText && (
        <form
          onSubmit={handleTextSubmit}
          style={{
            position: "absolute",
            top: textPosition.y + "px",
            left: textPosition.x + "px",
          }}
        >
          <input
            type="text"
            placeholder="Enter text"
            value={textInput}
            onChange={handleTextChange}
            style={{
              position: "relative",
              zIndex: "1",
              resize: "none",
              border: "none",
            }}
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {loading && <div>Loading...</div>}
      {responseImageUrl && (
        <img
          src={responseImageUrl}
          width={400}
          height={400}
          alt="Annotated Image"
        />
      )}

      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default AddTextAndDownload;




