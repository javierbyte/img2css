import React, { useState, useCallback } from "react";
import tinycolor from "tinycolor2";
import _ from "lodash";

import ImageUtils from "base64-image-utils";
const base64ImageToRGBMatrix = ImageUtils.base64ImageToRGBMatrix;

// import { base64ImageToRGBMatrix } from "base64-image-utils";

function compressColor(rgb) {
  const hex = tinycolor(rgb).toHexString();

  switch (
    hex // based on CSS3 supported color names http://www.w3.org/TR/css3-color/
  ) {
    case "#c0c0c0":
      return "silver";
    case "#808080":
      return "gray";
    case "#800000":
      return "maroon";
    case "#ff0000":
      return "red";
    case "#800080":
      return "purple";
    case "#008000":
      return "green";
    case "#808000":
      return "olive";
    case "#000080":
      return "navy";
    case "#008080":
      return "teal";
  }
  return hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6] ? "#" + hex[1] + hex[3] + hex[5] : hex;
}

function resizeImage(base64Str, maxWidth = 400, maxHeight = 350) {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      const MAX_WIDTH = maxWidth;
      const MAX_HEIGHT = maxHeight;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
  });
}

function App() {
  const [rgbMatrix, rgbMatrixSet] = useState(null);
  const [loadingImage, loadingImageSet] = useState(false);

  function onFileSelected(event) {
    event.stopPropagation();
    event.preventDefault();

    console.log(event);

    const dt = event.dataTransfer;
    const files = dt ? dt.files : event.target.files;
    const file = files[0];

    // const file = dt.file;

    const fr = new window.FileReader();

    loadingImageSet(true);

    fr.onload = async (data) => {
      const base64src = data.currentTarget.result;

      const base64 = await resizeImage(base64src, 128, 128);

      base64ImageToRGBMatrix(base64, (err, data) => {
        if (err) return console.error(err);

        rgbMatrixSet(data);
        loadingImageSet(false);
      });
    };
    fr.readAsDataURL(file);
  }

  function onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const masterShadow = _.map(rgbMatrix, (row, rowIndex) => {
    return _.map(row, (col, colIndex) => {
      const color = compressColor(`rgb(${col.r},${col.g},${col.b})`);

      return `${color} ${colIndex ? colIndex + "px" : 0} ${rowIndex ? rowIndex + "px" : 0}`;
    }).join(",");
  }).join(",");

  const handleFocus = (event) => {
    console.log("on click");
    event.stopPropagation();
    event.target.select();
  };

  return (
    <div className="padding-horizontal-2x">
      <div className="dropzone" onDrop={onFileSelected} onDragOver={onDragOver} onDragEnter={onDragOver}>
        <span>{loadingImage ? "Processing..." : "Drop an image here, or click to upload."}</span>
        <input type="file" onChange={onFileSelected} multiple accept="image/*" />
      </div>

      {rgbMatrix && (
        <div>
          <div className="tutorial">
            <h3>The result</h3>
            This is your pure css (and single div) image! Enjoy!
            <div
              className="pixel"
              style={{
                height: 1,
                width: 1,
                boxShadow: masterShadow,
                marginBottom: rgbMatrix.length,
                marginRight: rgbMatrix[0].length,
              }}
            />
          </div>
          <textarea
            onFocus={handleFocus}
            onChange={(e) => {}}
            className="code"
            value={`<div style="margin-right: ${rgbMatrix[0].length}px; margin-bottom: ${rgbMatrix.length}px; height: 1px; width: 1px; box-shadow: ${masterShadow}"></div>`}
          />
          Size: {masterShadow.length.toLocaleString()}b
        </div>
      )}
    </div>
  );
}

export default App;
