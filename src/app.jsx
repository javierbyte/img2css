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

function App() {
  const [rgbMatrix, rgbMatrixSet] = useState(null);
  const [loadingImage, loadingImageSet] = useState(false);

  function onDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    console.log(event);

    let dt = event.dataTransfer;
    let files = dt.files;

    console.log(files);

    var file = files[0];
    var fr = new window.FileReader();

    loadingImageSet(true);

    fr.onload = (data) => {
      const base64 = data.currentTarget.result;

      if (base64.length > 100000) {
        let confirmation = window.confirm("Your image is really big, do you really want to try to convert it?");

        if (!confirmation) {
          loadingImageSet(false);
          return;
        }
      }

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
      <div className="dropzone" onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragOver}>
        <span>{loadingImage ? "Processing..." : "Drop an image here, or click to upload."}</span>
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
              }}
            />
          </div>
          <textarea
            onFocus={handleFocus}
            onChange={(e) => {}}
            className="code"
            value={`<div style="height: 1px; width: 1px; box-shadow: ${masterShadow}"></div>`}
          />
          Size: {masterShadow.length.toLocaleString()}b
        </div>
      )}
    </div>
  );
}

export default App;
