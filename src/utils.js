import AutoFixNormalIcon from "@mui/icons-material/AutoFixNormal";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import html2canvas from "html2canvas";
import React from 'react';


export const EDITOR_TYPES = {
  ERASE: "ERASE",
  UPLOAD_AGAIN: "UPLOAD_AGAIN",
  REMOVE: "REMOVE",
  DOWNLOAD: "DOWNLOAD",
  UNDO: "UNDO",
  REDO: "REDO",
};

export const LIST_OF_ITEMS_BEFORE_EDITOR = {
  [EDITOR_TYPES.ERASE]: {
    type: EDITOR_TYPES.ERASE,
    logo: (
      <AutoFixNormalIcon
        style={{ color: "white", fontSize: "50px", cursor: "pointer" }}
      />
    ),
    text: "Erase",
  },
  
  [EDITOR_TYPES.REMOVE]: {
    type: EDITOR_TYPES.REMOVE,
    logo: (
      <DeleteIcon
        style={{ color: "white", fontSize: "50px", cursor: "pointer" }}
      />
    ),
    text: "Remove",
  },
};

export const LIST_OF_ITEMS_AFTER_EDITOR = {
  [EDITOR_TYPES.ERASE]: {
    type: EDITOR_TYPES.ERASE,
    logo: (
      <AutoFixNormalIcon
        style={{ color: "white", fontSize: "50px", cursor: "pointer" }}
      />
    ),
    text: "Erase",
  },
  
};

export function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  window.clearDynamicLink(link);
}

export const create = async (afterRef) => {
  const img=document.createElement("img");
  const div=document.querySelector("#abcde");
  const src=await afterRef.current.exportImage();
  img.src=src;
  img.style.width="600px";
  img.style.height="400px";
  img.style.display="inline-block";
  img.style.position="absolute";
  img.style.top="0px";
  img.style.backgroundColor="black";
  img.style.zIndex=-10000;
  div.appendChild(img);
  const canvas=await html2canvas(img);
  // downloadURI(canvas.toDataURL(), 'canvas.png');
  return canvas;
};

export const FONTS=[
  {label:"arial",value:"arial"},
  {label:"Avenir",value:"Avenir"},
  {label:"BodoniModa",value:"BodoniModa-VariableFont_opsz"},,
  {label:"futur",value:"futur"},
  {label:"Helvetica",value:"Helvetica"},,
  {label:"Minion",value:"Minion"},
  {label:"times new roman",value:"times-new-roman"},
  {label:"Trajan Pro",value:"Trajan-Pro.ttf"},
  {label:"Univers-light-normal",value:"Univers-light-normal"},
  {label:"VAG Rounded Regular",value:"vag-rounded"},
];
export const mappedFont = {
  "arial":"arial.ttf",
  "Avenir":"Avenir.ttf",
  "BodoniModa-VariableFont_opsz":"BodoniModa-VariableFont_opsz,wght.ttf",
  "futur":"futur.ttf",
  "Helvetica":"Helvetica.ttf",
  "Minion":"Minion.ttf",
  "times-new-roman":"times new roman.ttf",
  "Trajan-Pro.ttf":"Trajan Pro.ttf",
  "Univers-light-normal":"Univers-light-normal.ttf",
  "vag-rounded":"VAG Rounded Regular.ttf"
}