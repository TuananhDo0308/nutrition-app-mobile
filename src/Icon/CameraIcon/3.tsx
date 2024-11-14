import React from "react";
import Svg, { Rect } from "react-native-svg";

const SolidRoundedSquareIcon = ({ width = 41, height = 41, fill = "#2E2E2E" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 41 41"
    fill="none"
    style={{position:"absolute"}}
  >
    <Rect
      x="0.666672"
      y="0.666748"
      width="39.6667"
      height="39.6667"
      rx="13"
      fill={fill}
    />
  </Svg>
);

export default SolidRoundedSquareIcon;
