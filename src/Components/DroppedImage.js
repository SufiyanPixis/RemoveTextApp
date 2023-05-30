import React, { useState, useRef, useEffect } from "react";
import "./DroppedImage.css";
function DroppedImage({ imageUrl }) {
  const [isDragging, setIsDragging] = useState(false);
  const [highlightedArea, setHighlightedArea] = useState(null);
  const [drawMode, setDrawMode] = useState(false);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const startPointRef = useRef({ x: 0, y: 0 });
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (highlightedArea) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(255, 0, 0, 0.3)";
      context.beginPath();
      context.moveTo(highlightedArea[0].x, highlightedArea[0].y);
      for (let i = 1; i < highlightedArea.length; i++) {
        context.lineTo(highlightedArea[i].x, highlightedArea[i].y);
      }
      context.closePath();
      context.fill();
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [highlightedArea]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startPointRef.current = { x: e.clientX, y: e.clientY };

    if (drawMode) {
      drawingRef.current = true;
      const { left, top } = imageRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setHighlightedArea([{ x, y }]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !drawingRef.current) return;

    const { left, top } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setHighlightedArea((prevArea) => [...prevArea, { x, y }]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    drawingRef.current = false;
  };

  const handleRemoveHighlight = async () => {
    if (highlightedArea) {
      // Send highlighted area data to API for removal
      try {
        const response = await fetch("YOUR_API_ENDPOINT", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(highlightedArea),
        });
        // Process the API response as needed
        console.log("API response:", response);
      } catch (error) {
        console.error("API request failed:", error);
      }
    }
  };

  return (
    <div className="dropped-image-container">
      <div className="image-wrapper">
        <img
          src={imageUrl}
          alt="Dropped Image"
          className="original-image"
          ref={imageRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          width={300}
        />
      </div>
        <canvas
          className={`highlight-overlay ${drawMode ? "draw-mode" : ""}`}
          ref={canvasRef}
          width={imageRef.current ? imageRef.current.width : 0}
          height={imageRef.current ? imageRef.current.height : 0}
        />
      <button
        className="btn btn-success"
        onClick={handleRemoveHighlight}
        disabled={!highlightedArea}
      >
        Process
      </button>
      <button
        className={`btn btn-warning draw-button ${drawMode ? "active" : ""}`}
        onClick={() => setDrawMode(!drawMode)}
      >
        {drawMode ? "Disable Erase" : "Enable Erase"}
      </button>
      <p>Click and drag to highlight an area.</p>
      <p>Click "Process" to send it to the API for removal.</p>
      
    </div>
  );
}

export default DroppedImage;
