import React from "react";
import Svg, { Rect, Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
}

const CustomIcon: React.FC<IconProps> = ({ width = 51, height = 51 }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 51 51"
    fill="none"
  >
    <Rect
      x="5.66667"
      y="5.66675"
      width="39.6667"
      height="39.6667"
      rx="13"
      fill="#2E2E2E"
    />
    <Rect
      x="0.5"
      y="0.5"
      width="50"
      height="50"
      rx="17.5"
      strokeWidth={2}
      stroke="#85F193"
    />
    <Path
      d="M19.2667 22.4051V20.3128C19.2667 20.0353 19.3769 19.7692 19.5731 19.573C19.7693 19.3768 20.0354 19.2666 20.3128 19.2666H22.4051M19.2667 29.7281V31.8204C19.2667 32.0979 19.3769 32.364 19.5731 32.5602C19.7693 32.7564 20.0354 32.8666 20.3128 32.8666H22.4051M32.8667 22.4051V20.3128C32.8667 20.0353 32.7564 19.7692 32.5603 19.573C32.3641 19.3768 32.098 19.2666 31.8205 19.2666H29.7282M32.8667 29.7281V31.8204C32.8667 32.0979 32.7564 32.364 32.5603 32.5602C32.3641 32.7564 32.098 32.8666 31.8205 32.8666H29.7282"
      stroke="#85F193"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CustomIcon;
