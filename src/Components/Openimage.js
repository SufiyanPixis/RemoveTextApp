
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FormData from "form-data";
import { useNavigate } from "react-router-dom";
import * as markerjs2 from "markerjs2";
import { Oval } from "react-loader-spinner";
import { Container } from "reactstrap";
import "./Openimage.css";

const OpenImage = ({ imageUrl, fileName }) => {
  console.log("Im in openImage");
  console.log("imageUrl",imageUrl);
  console.log("Filename",fileName);
  const [originalDimensions, setOriginalDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [uniformWidth,setuniformWidth] = useState(
    {
      uniwidth:0,
      uniheight:0,
    }
  );
  const [originalImage, setOriginalImage] = useState(imageUrl);
  const [markedArea, setMarkedArea] = useState(null);
  const [selections, setSelections] = useState([]);
  const [maState, setmaState] = useState([]);
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [folderName, setFolderName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [switchPosition, setSwitchPosition] = useState("left"); // Added switchPosition state
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const beforeRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setOriginalDimensions({
        width: img.width,
        height: img.height,
      });
    };
  }, [imageUrl]);

  const aspectRatio = originalDimensions.width / originalDimensions.height;
  const adjustedHeight = 400;
  const adjustedWidth = adjustedHeight * aspectRatio;

  const showMarkerAreaBefore = () => {
    if (imageRef.current !== null) {
      const markerArea = new markerjs2.MarkerArea(imageRef.current);
      const tooltipContainer = document.querySelector(
        ".markerjs-tooltip-container"
      );

      if (tooltipContainer) {
        tooltipContainer.style.position = "absolute";
        tooltipContainer.style.transform = "translate(-50%, -50%)";
        tooltipContainer.style.top = "50%";
        tooltipContainer.style.left = "50%";
        tooltipContainer.style.zIndex = "5";
      }
      markerArea.addEventListener("render", (event) => {
        if (imageRef.current) {
          imageRef.current.src = event.dataUrl;
          imageRef.current.datas = event;
          imageRef.current.maState = event.state;
        }
        if (imageRef.current.maState) {
          setmaState(imageRef.current.maState);
        }
      });
      markerArea.show();
      // console.log("eventevent", imageRef, imageRef.current.maState);

      if (imageRef.current.maState) {
        markerArea.restoreState(imageRef.current.maState);
      }
    }
  };

  function base64toFile(base64Image) {
    // Split the base64 image string into metadata and data parts
    const parts = base64Image.split(";base64,");
    const mimeType = parts[0].split(":")[1];
    const imageData = parts[1];

    // Convert the Base64 image data to a typed array
    const byteCharacters = atob(imageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create the file Blob from the typed array
    const file = new Blob([byteArray], { type: mimeType });

    return file;
  }

  const handleProcess = () => {
    const formData = new FormData();
    formData.append("input_image", fileName);
    formData.append(
      "dimension",
      JSON.stringify([adjustedWidth, adjustedHeight])
    );

    const arr =
      maState &&
      maState.markers &&
      maState.markers.map((marker) => {
        return [
          Math.round(marker.left),
          Math.round(marker.top),
          Math.round(marker.left + marker.width),
          Math.round(marker.top + marker.height),
        ];
      });
    // console.log("im boundingbox", arr);
    formData.append("bboxes", JSON.stringify(arr));
    setFolderName("loading");
    setLoading(true);
    axios 
      .post("http://43.205.56.135:8004/process-image", formData)
      .then((response) => {
        setLoading(false);
        setFolderName(response.data.folder_name);
        const ProcessedimageURL = `data:image/jpeg;base64,${response.data.image}`;
        const base64Image = ProcessedimageURL;
        const final_file = base64toFile(base64Image);
        navigate(`/processed-image/${encodeURIComponent(ProcessedimageURL)}`, {
          state: { fileName: final_file },
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        setFolderName("error");
      });
  };

  const handleSwitch = () => {
    setSwitchPosition((prevState) => (prevState === "left" ? "right" : "left"));
  };

  return (
    <div className="open-image-container">
      {/* <div className="switch-container" onClick={handleSwitch}>
        <div className="original-text" style={{ left: "5px" }}>
          <text >Original</text>
        </div>
        <div
          className="switch-ball"
          style={{
            transform: switchPosition === "left" ? "translateX(0)" : "translateX(20px)",
          }}
        />
      </div> */}
      <div
        style={{
          borderRadius: "1px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          {hovered && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              Double click to edit
            </div>
          )}
          <div className="myclass">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Open Image"
              style={{
                border:"1px solid black",
                maxWidth: adjustedWidth, 
                maxHeight: adjustedHeight,
                animation: loading ? "blink-animation 1s infinite" : "none",
              }}
              onDoubleClick={showMarkerAreaBefore}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            /> 
            <button
              className="btn btn-success mt-5"
              style={{
                background: "#3D74F8",
                transition: "background-color 0.3s",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
              }}
              onClick={handleProcess}
              disabled={loading}
            >
              {loading ? (
                <Oval color="#ffffff" height={15} width={40} />
              ) : folderName === "loading" ? (
                "Wait, your image is under process..."
              ) : (
                "Process"
              )}
            </button>
          </div>
          {selections.map(
            (selection, index) =>
              selection && (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    border: "2px solid red",
                    left: `${selection.x}px`,
                    top: `${selection.y}px`,
                    width: `${selection.width}px`,
                    height: `${selection.height}px`,
                    pointerEvents: "none",
                  }}
                />
              )
          )}
          {startPosition && endPosition && (
            <div
              style={{
                position: "absolute",
                border: "2px dashed red",
                left: `${Math.min(startPosition.x, endPosition.x)}px`,
                top: `${Math.min(startPosition.y, endPosition.y)}px`,
                width: `${Math.abs(endPosition.x - startPosition.x)}px`,
                height: `${Math.abs(endPosition.y - startPosition.y)}px`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenImage;

