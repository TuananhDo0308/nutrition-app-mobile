import React from "react";
import Svg, { Path } from "react-native-svg";

const CameraIcon = ({ width = 16, height = 16, color = "#85F193" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
  >
    <Path
      d="M1.26666 4.40506V2.31276C1.26666 2.0353 1.37688 1.7692 1.57307 1.57301C1.76927 1.37682 2.03536 1.2666 2.31282 1.2666H4.40512M1.26666 11.7281V13.8204C1.26666 14.0979 1.37688 14.364 1.57307 14.5602C1.76927 14.7564 2.03536 14.8666 2.31282 14.8666H4.40512M14.8667 4.40506V2.31276C14.8667 2.0353 14.7564 1.7692 14.5603 1.57301C14.3641 1.37682 14.098 1.2666 13.8205 1.2666H11.7282M14.8667 11.7281V13.8204C14.8667 14.0979 14.7564 14.364 14.5603 14.5602C14.3641 14.7564 14.098 14.8666 13.8205 14.8666H11.7282"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CameraIcon;
