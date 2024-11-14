import React from "react";
import Svg, { Rect } from "react-native-svg";

const RoundedSquareIcon = ({ width = 51, height = 51, color = "#85F193" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 51 51"
    style={{position:"absolute"}}
    fill="none"
  >
    <Rect
      x="0.5"
      y="0.5"
      width="50"
      height="50"
      rx="17.5"
      strokeWidth={2}
      stroke={color}
    />
  </Svg>
);

export default RoundedSquareIcon;
