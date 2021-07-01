import React, { useState } from "react";
import tinycolor from "tinycolor2";
import _ from "lodash";

import {
  HeaderH1,
  HeaderH2,
  Text,
  Space,
  Box,
  A,
  Container,
  Dropzone,
  Ul,
  Li,
} from "./jbx.jsx";

import Styled from "styled-components";

import { imageToRGBMatrix } from "canvas-image-utils";

const Textarea = Styled.textarea({
  fontFamily: "monaco, monospace",
  border: "none",
  width: "100%",
  height: 256,
  fontSize: 13,
  lineHeight: 1.309,
  padding: "16px 18px",
  background: "#ecf0f1",
  color: "#34495e",
  ":focus": {
    outline: "none",
  },
});

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
  return hex[1] === hex[2] && hex[3] === hex[4] && hex[5] === hex[6]
    ? "#" + hex[1] + hex[3] + hex[5]
    : hex;
}

function App() {
  const [rgbMatrix, rgbMatrixSet] = useState(null);
  const [loadingImage, loadingImageSet] = useState(false);

  function onFileSelected(event) {
    event.stopPropagation();
    event.preventDefault();

    const dt = event.dataTransfer;
    const files = dt ? dt.files : event.target.files;
    const file = files[0];

    const fr = new window.FileReader();

    loadingImageSet(true);

    fr.onload = async (data) => {
      const base64src = data.currentTarget.result;
      const dataMatrix = await imageToRGBMatrix(base64src, { size: 150 });

      rgbMatrixSet(dataMatrix);
      loadingImageSet(false);
    };
    fr.readAsDataURL(file);
  }

  function onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  let scale = 1;

  const masterShadow = _.map(rgbMatrix, (row, rowIndexSrc) => {
    return _.map(row, (col, colIndexSrc) => {
      const i = colIndexSrc * scale;
      const j = rowIndexSrc * scale;

      const color = compressColor(`rgb(${col.r},${col.g},${col.b})`);

      const scaleCompensation = scale !== 1 ? ` 0 ${scale / 2}px` : ``;

      return `${color} ${j ? j + "px" : 0} ${
        i ? i + "px" : 0
      }${scaleCompensation}`;
    }).join(",");
  }).join(",");

  const handleFocus = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.select();
  };

  return (
    <Container>
      <Box padding={2}>
        <Space h={1} />

        <HeaderH1
          style={{
            fontWeight: 900,
            display: "inline-block",
            width: "auto",
            padding: "6px",
            backgroundColor: "var(--accent-color)",
          }}>
          img2css
        </HeaderH1>

        <Space h={1} />
        <Text>
          This is a tool that can convert any image into a pure css image.
        </Text>
        <Space h={2} />

        <Dropzone
          onDrop={onFileSelected}
          onDragOver={onDragOver}
          onDragEnter={onDragOver}>
          {loadingImage ? (
            <Text>Processing...</Text>
          ) : (
            <div>
              <Text>Drop an image here</Text>
              <Text>or click to select</Text>
            </div>
          )}
          <input
            type="file"
            onChange={onFileSelected}
            multiple
            accept="image/*"
            aria-label="Drop an image here, or click to select"
          />
        </Dropzone>

        <Space h={2} />
        <Text>
          I also made a per-pixel animation experiment, see{" "}
          <A href="https://javier.xyz/morphin/">morphin</A>.
        </Text>

        {rgbMatrix && (
          <div>
            <Space h={2} />
            <HeaderH2>The result</HeaderH2>
            <Space h={1} />
            <Text>This is your pure css (and single div) image! Enjoy!</Text>
            <Space h={1} />
            <div
              style={{
                height: 1,
                width: 1,
                boxShadow: masterShadow,
                marginBottom: rgbMatrix[0].length * scale,
                marginRight: rgbMatrix.length * scale,
              }}
            />
            <Space h={1} />
            <Textarea
              onFocus={handleFocus}
              onChange={() => {}}
              className="code"
              value={`<div style="margin-right: ${
                rgbMatrix[0].length * scale
              }px; margin-bottom: ${
                rgbMatrix.length * scale
              }px; height: 1px; width: 1px; box-shadow: ${masterShadow}"></div>`}
            />
            <Space h={1} />
            <Text>Size: {masterShadow.length.toLocaleString()}b</Text>
          </div>
        )}

        <Space h={2} />

        <Text>More unrelated experiments</Text>
        <Space h={0.5} />
        <Ul>
          <Li>
            <Text>
              Create single line SVG illustrations from your pictures,{" "}
              <A href="https://javier.xyz/pintr/">PINTR</A>.
            </Text>
          </Li>
          <Li>
            <Text>
              Play with 3D and shadows,{" "}
              <A href="https://sombras.app/">sombras.app</A>.
            </Text>
          </Li>
          <Li>
            <Text>
              Find the visual center in your images / logos,{" "}
              <A href="https://javier.xyz/visual-center/">visual-center</A>.
            </Text>
          </Li>
        </Ul>

        <Space h={2} />
        <Text>
          Made by <A href="https://twitter.com/javierbyte">javierbyte</A>.
        </Text>
        <Space h={3} />
      </Box>
    </Container>
  );
}

export default App;
