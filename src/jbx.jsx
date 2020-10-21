import React from "react";
import Styled from "styled-components";
import capsize from "capsize";

const SIZE = window.innerHeight > 640 ? 16 : 14;

const SPACE = SIZE;
const BASE_FONT_SIZE = SIZE;

// const TEXT_MAIN_COLOR = "#aaabac";
// const TEXT_HEADER_COLOR = "#fff";

const TEXT_MAIN_COLOR = "#000";

const fontMetrics = {
  capHeight: 1364,
  ascent: 1950,
  descent: -494,
  unitsPerEm: 2048,
};

const BaseText = Styled.div({
  // color: TEXT_MAIN_COLOR,
});

function textProps(capsizeConfig) {
  const capsizeComputed = {
    fontMetrics,
    lineGap: (BASE_FONT_SIZE * 2) / 3,
    ...capsizeConfig,
  };

  const capsizeResult = capsize(capsizeComputed);

  return capsizeResult;

  // console.log(capsizeComputed, capsizeResult);
}

export const Container = Styled.div({
  maxWidth: "1080px",
  margin: "0 auto",
});

export const Text = Styled(BaseText)({
  margin: "0",
  ...textProps({
    capHeight: (BASE_FONT_SIZE * 3) / 3,
  }),
});

// export const Button = function (props) {
//   const { children, style, ...other } = props;

//   return (
//     <Box
//       padding={0.5}
//       style={{
//         marginTop: "-8px",
//         marginTop: "-8px",
//         userSelect: "none",
//         cursor: "pointer",
//         display: "inline-block",
//         backgroundColor: "#eee",
//         boxShadow: "4px 4px 0 #ccc",
//         textAlign: "center",
//         ...style,
//       }}
//       {...other}>
//       <Text>{children}</Text>
//     </Box>
//   );
// };

export const ButtonContainer = Styled.button({
  appearance: "none",
  userSelect: "none",
  cursor: "pointer",
  display: "inline-block",
  backgroundColor: "#eee",
  boxShadow: "4px 4px 0 #ccc",
  padding: `0 ${SPACE / 2}px`,
  border: "none",
  height: SPACE * 2.5,
});

export const Button = function (props) {
  const { children, ...other } = props;

  return (
    <ButtonContainer {...other}>
      <Text>{children}</Text>
    </ButtonContainer>
  );
};

export const Input = Styled.input({
  "-webkit-text-fill-color": "#777",
  opacity: 1,
  flex: 1,
  display: "block",
  appearance: "none",
  border: "none",
  borderRadius: 0,
  height: SPACE * 2.5,
  backgroundColor: "#eee",
  ...textProps({
    capHeight: (BASE_FONT_SIZE * 3) / 3,
  }),
  padding: `0 ${SPACE / 2}px`,
  boxShadow: `inset rgba(0, 0, 0, 0.04) 3px 3px 0, inset rgba(0, 0, 0, 0.03) 0.5px 0.5px 0`,
  color: "#777",
});

export const Range = Styled.input({
  flex: 1,
  width: "100%",
  appearance: "none",
  backgroundColor: "var(--accent-color)",
  height: SPACE,
  borderRadius: 0,
  "&::-webkit-slider-thumb": {
    appearance: "none",
    boxShadow: "none",
    borderRadius: 0,
    height: SPACE * 2,
    width: SPACE,
    backgroundColor: "#000",
    border: "none",
  },
  "&::-moz-range-thumb": {
    appearance: "none",
    boxShadow: "none",
    borderRadius: 0,
    height: SPACE * 2,
    width: SPACE,
    backgroundColor: "#000",
    border: "none",
  },
  "&::-webkit-slider-runnable-track": {
    appearance: "none",
  },
  ":focus": {
    outline: "none",
  },
});

export const HeaderH4 = Styled.h4({
  margin: 0,
  color: TEXT_MAIN_COLOR,

  letterSpacing: -0.11,
  fontWeight: 700,
  ...textProps({
    capHeight: BASE_FONT_SIZE,
    lineGap: BASE_FONT_SIZE,
  }),
});
export const HeaderH3 = Styled.h3({
  margin: 0,
  color: TEXT_MAIN_COLOR,

  letterSpacing: -0.22,
  fontWeight: 500,
  ...textProps({
    capHeight: BASE_FONT_SIZE * 1 * 1.25,
    lineGap: BASE_FONT_SIZE,
  }),
});
export const HeaderH2 = Styled.h2({
  margin: 0,
  color: TEXT_MAIN_COLOR,

  letterSpacing: -0.33,
  fontWeight: 500,
  ...textProps({
    capHeight: BASE_FONT_SIZE * 1.5,
    lineGap: 12,
  }),
});
export const HeaderH1 = Styled.h1({
  color: TEXT_MAIN_COLOR,
  letterSpacing: -1,
  margin: "2px 0",
  fontWeight: 700,
  ...textProps({
    capHeight: BASE_FONT_SIZE * 3 - 4,
    lineGap: BASE_FONT_SIZE,
  }),
});

export const A = Styled.a({
  // color: "#2980b9",
  color: "#000",
  // backgroundColor: "rgba(32,32,32,0.1)",
  boxShadow: "var(--accent-color) 0 2px 0, inset var(--accent-color) 0 -2px 0",
  fontWeight: 700,
  textDecoration: "none",
  "&:hover": {
    color: "#34495e",
  },
});

export function Space(props) {
  return (
    <div
      style={{
        display: props.inline ? "inline-block" : "block",
        height: `${SPACE * props.h}px`,
        width: `${SPACE * props.w}px`,
      }}
    />
  );
}

export const Box = Styled.div({
  flex: (props) => props.flex,
  minWidth: (props) => props.minWidth,
  padding: ({ padding }) => {
    if (!padding) return `0`;

    const paddingArr = [padding].flat();

    return paddingArr.map((paddingValue) => `${paddingValue * SPACE}px`).join(` `);
  },

  "@media (max-width: 768px)": {
    display: ({ hideOnSmall }) => (hideOnSmall ? "none" : undefined),
  },

  "@media (max-width: 1080px)": {
    display: ({ hideOnMedium }) => (hideOnMedium ? "none" : undefined),
  },
});

export const Inline = Styled.div({
  display: "flex",
  flexWrap: "wrap",
  marginLeft: ({ h }) => `${h * SPACE}px`,
  marginRight: ({ h }) => `${h * SPACE}px`,
  marginTop: ({ v }) => `${v * SPACE}px`,
  marginBottom: ({ v }) => `${v * SPACE}px`,
});

export const LinkButton = Styled.a({
  capHeight: BASE_FONT_SIZE,
  color: "#3498db",
  cursor: "pointer",
  borderRadius: 5,
  borderTop: "1px solid #3498db10",
  borderBottom: "1px solid #0000",
  backgroundColor: "#3498db20",
  height: BASE_FONT_SIZE * 2,
  display: "flex",
  alignItems: "center",
  alignContent: "center",
  justifyContent: "center",
  padding: 0,
  "&:hover": {
    boxShadow: `rgba(0, 0, 0, 0.1) 0 1px 1px, rgba(0, 0, 0, 0.1) 0 3px 12px`,
  },
});

export const Dropzone = Styled.div({
  height: "120px",
  // width: ({ width = "300px" }) => width,
  // width: "100%",
  flex: 1,
  "max-width": "320px",
  display: "flex",
  "text-align": "center",
  "align-items": "center",
  "align-content": "center",
  "justify-content": "center",
  "flex-direction": "column",
  border: "2px dashed #000",
  color: "#000",
  padding: "0",
  cursor: "pointer",
  "& span": {
    width: "100%",
    cursor: "pointer",
  },
  "&:hover": {
    "border-color": "#999",
  },
  "& input": {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    opacity: "0",
    cursor: "pointer",
  },
});

export const Ul = Styled.ul`
margin: 0;
padding: 0;`;

export const Li = Styled.li`
margin: 0 0 0 16px;
padding: 4px 0;
`;
