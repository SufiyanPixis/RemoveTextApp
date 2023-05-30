

import React, { useState, useRef, useEffect } from "react";
import "./DropZone.css";
import { FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Image1 from "../Image1.jpg";
import Image2 from "../Image2.jpg";
import Image3 from "../Image3.jpg";
import Image4 from "../Image4.jpg";
import Image5 from "../Image5.jpg";
import Image6 from "../Image6.jpg";
import Image7 from "../Image7.jpg";
import Image8 from "../Image8.jpg";

import Frontimage from "../frontImage.jpeg";
import Frontimage2 from "../frontimage2.jpeg";

const DropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFile(file);
      console.log("Input Image:", imageUrl);
      console.log("file of input-image", file);
      navigate(`/open-image/${encodeURIComponent(imageUrl)}`, {
        state: { file: file },
      });
    }
  };

  const handleBrowseFiles = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFile(file);
      console.log("Im in browsedata");
      // console.log("sampleimage:", Frontimage2);
      console.log("imageurl:", imageUrl);
      console.log("Image-file:", file);
      navigate(`/open-image/${encodeURIComponent(imageUrl)}`, {
        state: { file: file },
      });
    }
  };

  const handleImageClick = async (imageSrc, imageName) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], imageName, { type: "image/jpeg" });
      const imageUrl = URL.createObjectURL(file);

      console.log("I'm in example!!!");
      console.log("imageUrl:", imageUrl);
      console.log("imageFile:", file);

      navigate(`/open-image/${encodeURIComponent(imageUrl)}`, {
        state: { file: file },
      });
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };


  useEffect(() => {
    const handleDocumentDragEnter = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDocumentDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDocumentDragOver = (e) => {
      e.preventDefault();
    };

    const handleDocumentDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    document.addEventListener("dragenter", handleDocumentDragEnter);
    document.addEventListener("dragleave", handleDocumentDragLeave);
    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("drop", handleDocumentDrop);

    return () => {
      document.removeEventListener("dragenter", handleDocumentDragEnter);
      document.removeEventListener("dragleave", handleDocumentDragLeave);
      document.removeEventListener("dragover", handleDocumentDragOver);
      document.removeEventListener("drop", handleDocumentDrop);
    };
  }, []);


  return (
    <>
      <div className="row container mt-5 p-5">
        <div className="col-md-6">
          <div className="my-image1">
            <img src={Frontimage2} alt="Front" style={{ height: '400px' }} />
          </div>
        </div>
        <div className="col-md-6 mt-3">
          <div className="my-image">
            <img src={Frontimage} alt="Front" />
          </div>
        </div>
      </div>

      <div className="col-md-6" style={{ marginLeft: "380px", marginTop: "100px" }}>
  <h1 className="front-text text-center pt-4">
    <span style={{ textDecoration: "underline" }}>Effortlessly Remove Unwanted</span>
    <span className="span"> Elements</span>,
    <span className="span"> Text</span>
    <span style={{ textDecoration: "underline" }}> Perfect Your Image,</span>
  </h1>
  <h2 className="front-text text-center pt-4 small-text" style={{ marginTop: "-30px", fontSize: "20px" }}>
    <span className="span">
      in seconds
    </span>
  </h2>
</div>






      <div className="drop-zone-container" style={{ marginBottom: "-300px" }}>
        <div className={`drop-zone ${isDragging ? "dragging" : ""}`}>
          <div className="drop-zone-content"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <>
              <div>
                <br />
                <br />
                <label htmlFor="file-input" style={{ outline: "none" }}>
                  <FaImage className="ImageIcon" id="Imageicon" />
                </label>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleBrowseFiles}
                />
              </div>
              <p className="Text_DragandDrop">Drag and drop files here</p>
            </>
          </div>
        </div>
      </div>
      <p className="front-text text-center pt-4">TRY with an Example !!!</p>
      <div className="image-container shadow-rounded">
        <div className="row" style={{ display: "flex", justifyContent: "center" }}>
          <img src={Image1} alt="Image 1" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image1, "Image1.jpg")} />
          <img src={Image2} alt="Image 2" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image2, "Image2.jpg")} />
          <img src={Image3} alt="Image 3" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image3, "Image3.jpg")} />
          <img src={Image7} alt="Image 7" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image7, "Image7.jpg")} />
        </div>
        <br></br>
        <div className="row" style={{ display: "flex", justifyContent: "center" }}>
          <img src={Image4} alt="Image 4" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image4, "Image4.jpg")} />
          <img src={Image5} alt="Image 5" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image5, "Image5.jpg")} />
          <img src={Image6} alt="Image 6" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image6, "Image6.jpg")} />
          <img src={Image8} alt="Image 8" className="example-image" style={{ width: "200px", height: "200px" }} onClick={() => handleImageClick(Image8, "Image8.jpg")} />

        </div>
      </div>
    </>
  );


};

export default DropZone;

