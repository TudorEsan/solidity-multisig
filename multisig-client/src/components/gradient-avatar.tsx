"use client";

import React from "react";

import stringHash from "string-hash";
import hslTriad from "hsl-triad";
import hslRgb from "hsl-rgb";

/**
 * Generates two colors based on a given string.
 * @param s - The input string.
 * @returns An array containing two colors in RGB format.
 */
export const generateColours = (s: string): [string, string] => {
  const hash = stringHash(s);
  const colors = hslTriad(hash % 360, 1, 0.5);
  const color1 = hslRgb(colors[0][0], colors[0][1], colors[0][2]);
  const color2 = hslRgb(colors[1][0], colors[1][1], colors[1][2]);
  const color1str = `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`;
  const color2str = `rgb(${color2[0]}, ${color2[1]}, ${color2[2]})`;
  return [color1str, color2str];
};

interface Props {
  size?: number;
  text: string;
}

export const GradientAvatar = ({ size = 24, text }: Props) => {
  const [gradient, setGradient] = React.useState(generateColours(text));
  React.useEffect(() => {
    setGradient(generateColours(text));
  }, [text]);

  const gradientId = React.useMemo(
    () => `gradient-${stringHash(text)}`,
    [text]
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2}
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2={size}
          y2={size}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={gradient[0]} />
          <stop offset="1" stopColor={gradient[1]} />
        </linearGradient>
      </defs>
    </svg>
  );
};
