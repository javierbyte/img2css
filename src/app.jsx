import React, { Fragment, useState } from "react";
import tinycolor from "tinycolor2";
import _ from "lodash";

import {
  JBX,
  HeaderH1,
  Text,
  Space,
  A,
  Container,
  Dropzone,
  Ul,
  Li,
  Tabs,
  Tab,
  Inline,
} from "jbx";

import Styled from "styled-components";

import { imageToRGBMatrix, imageToRawData } from "canvas-image-utils";

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
  const [outputType, outputTypeSet] = useState("SHADOW");
  const [originalSize, originalSizeSet] = useState(0);
  const [base64Data, base64DataSet] = useState("");
  const [rgbMatrix, rgbMatrixSet] = useState(null);
  const [loadingImage, loadingImageSet] = useState(false);

  function onFileSelected(event) {
    event.stopPropagation();
    event.preventDefault();

    const dt = event.dataTransfer;
    const files = dt ? dt.files : event.target.files;
    const file = files[0];

    originalSizeSet(file.size);

    const fr = new window.FileReader();

    loadingImageSet(true);

    fr.onload = async (data) => {
      const base64src = data.currentTarget.result;
      const dataMatrix = await imageToRGBMatrix(base64src, { size: 200 });
      const canvasRawData = await imageToRawData(base64src, {
        size: 1080,
        crop: false,
      });

      base64DataSet(canvasRawData.ctx.canvas.toDataURL("image/jpeg", 0.66));
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
      <JBX accent={"#f1c40f"} />
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
        <Fragment>
          <Space h={2} />
          <Tabs>
            <Inline>
              <Tab
                active={outputType === "SHADOW"}
                key={"SHADOW"}
                onClick={() => {
                  outputTypeSet("SHADOW");
                }}>
                <Text>{"Pure CSS"}</Text>
              </Tab>
              <Tab
                active={outputType === "BASE64"}
                key={"BASE64"}
                onClick={() => {
                  outputTypeSet("BASE64");
                }}>
                <Text>{"Base64"}</Text>
              </Tab>
            </Inline>
          </Tabs>
          <Space h={1} />

          {outputType === "BASE64" && (
            <Fragment>
              <Text>
                <strong>The result (base64).</strong>{" "}
                {
                  "This is your image tag a base64 output. The entire image file is embedded inside the `<img>` tag using base64, so no need external hosting is needed."
                }
              </Text>
              <Space h={1} />

              <img
                src={base64Data}
                style={{ maxWidth: "100%", height: "auto", display: "block" }}
              />

              <Space h={1} />

              <Textarea
                onFocus={handleFocus}
                onChange={() => {}}
                className="code"
                value={`<img src="${base64Data}" />`}
              />
              <Space h={1} />
              <Text>
                Output size (resized): {base64Data.length.toLocaleString()}b
              </Text>
              <Text>
                Original size: {Number(originalSize).toLocaleString()}b
              </Text>
            </Fragment>
          )}

          {outputType === "SHADOW" && (
            <Fragment>
              <Text>
                <strong>The result (pure CSS).</strong> This is your pure CSS
                (and single div) image, enjoy! This output was created by
                resizing and setting each pixel as a box-shadow of a single
                pixel div, so no `img` tag or `background-image` is needed. This
                can result in huge outputs, and the use of this output is not
                recommended for production unless there is no other option.
              </Text>
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
              <Text>
                Output size (resized): {masterShadow.length.toLocaleString()}b
              </Text>
              <Text>
                Original size: {Number(originalSize).toLocaleString()}b
              </Text>
            </Fragment>
          )}
        </Fragment>
      )}

      <Space h={2} />

      <Text>More unrelated experiments</Text>
      <Space h={0.5} />
      <Text>
        <Ul>
          <Li>
            <A href="https://javier.xyz/pintr/">PINTR</A>., create single line
            SVG illustrations from your pictures.
          </Li>
          <Li>
            <A href="https://sombras.app/">Sombras.app</A>, play with 3D and
            shadows.
          </Li>
          <Li>
            <A href="https://javier.xyz/visual-center/">Visual Center</A>, find the visual center in your images / logos.
          </Li>
          <Li>
            <A href="https://javier.xyz/cohesive-colors/">Cohesive Colors</A>, create more cohesive color palettes.
          </Li>
        </Ul>
      </Text>

      <Space h={2} />
      <Text>
        Made by <A href="https://twitter.com/javierbyte">javierbyte</A>.
      </Text>
      <Space h={3} />
    </Container>
  );
}

export default App;
