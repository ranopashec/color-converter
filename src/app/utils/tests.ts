import { RGB, HLS, XYZ } from "../models/schemes";
import {
  convertHLStoXYZ,
  convertXYZtoHLS,
  convertRGBtoXYZ,
  convertXYZtoRGB,
} from "./converters";
export function testAllConverters(): void {
  testConvertHLStoXYZ();
  testConvertXYZtoHLS();
  // testConvertRGBtoXYZ();
  testConvertXYZtoRGB();
}

function testConvertHLStoXYZ(): void {
  const testCases: Array<{
    input: { h: number; l: number; s: number };
    expected: { x: number; y: number; z: number };
  }> = [
    {
      input: { h: 0, l: 50, s: 100 }, // Red color in HLS
      expected: { x: 41.25, y: 21.27, z: 1.93 }, // Red color in XYZ
    },
    {
      input: { h: 120, l: 50, s: 100 }, // Green color in HLS
      expected: { x: 35.76, y: 71.52, z: 11.92 }, // Green color in XYZ
    },
    {
      input: { h: 240, l: 50, s: 100 }, // Blue color in HLS
      expected: { x: 18.04, y: 7.22, z: 95.03 }, // Blue color in XYZ
    },
    {
      input: { h: 0, l: 100, s: 0 }, // White color in HLS
      expected: { x: 95.05, y: 100, z: 108.88 }, // White color in XYZ
    },
    {
      input: { h: 0, l: 0, s: 0 }, // Black color in HLS
      expected: { x: 0, y: 0, z: 0 }, // Black color in XYZ
    },
  ];

  let allPassed = true;

  for (const { input, expected } of testCases) {
    const result = normalizeXYZ(convertHLStoXYZ(input));
    const passed = JSON.stringify(result) === JSON.stringify(expected);
    console.log(`Input: ${JSON.stringify(input)}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual: ${JSON.stringify(result)}`);
    console.log(`Passed: ${passed ? "yes" : "no"}`);
    console.log("");
    allPassed = allPassed && passed;
  }

  console.log(`All tests passed: ${allPassed ? "yes" : "no"}`);
}

function testConvertXYZtoHLS(): void {
  const testCases: Array<{
    input: XYZ;
    expected: HLS;
  }> = [
    {
      input: { x: 41.24, y: 21.26, z: 1.93 }, // Red color in XYZ, scaled by 100
      expected: { h: 0, l: 50, s: 100 }, // Red color in HSL
    },
    {
      input: { x: 35.76, y: 71.52, z: 11.92 }, // Green color in XYZ, scaled by 100
      expected: { h: 120, l: 50, s: 100 }, // Green color in HSL
    },
    {
      input: { x: 18.05, y: 7.22, z: 95.05 }, // Blue color in XYZ, scaled by 100
      expected: { h: 240.05, l: 50, s: 100 }, // Blue color in HSL
    },
    {
      input: { x: 95.05, y: 100, z: 108.9 }, // White color in XYZ, scaled by 100
      expected: { h: 0, l: 100, s: 0 }, // White color in HSL
    },
    {
      input: { x: 0, y: 0, z: 0 }, // Black color in XYZ, scaled by 100
      expected: { h: 0, l: 0, s: 0 }, // Black color in HSL
    },
  ];

  let allPassed = true;

  for (const { input, expected } of testCases) {
    const result = normalizeHLS(convertXYZtoHLS(input));
    const passed = JSON.stringify(result) === JSON.stringify(expected);
    console.log(`Input: ${JSON.stringify(input)}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual: ${JSON.stringify(result)}`);
    console.log(`Passed: ${passed ? "yes" : "no"}`);
    console.log("");
    allPassed = allPassed && passed;
  }

  console.log(`All tests passed: ${allPassed ? "yes" : "no"}`);
}

function testConvertXYZtoRGB(): void {
  const testCases: Array<{
    input: { x: number; y: number; z: number };
    expected: { r: number; g: number; b: number };
  }> = [
    {
      input: { x: 41.24, y: 21.26, z: 1.93 }, // Red color in XYZ
      expected: { r: 254.99, g: 0, b: 0 }, // Red color in RGB
    },
    {
      input: { x: 35.76, y: 71.52, z: 11.92 }, // Green color in XYZ
      expected: { r: 0, g: 255, b: 0 }, // Green color in RGB
    },
    {
      input: { x: 18.05, y: 7.22, z: 95.05 }, // Blue color in XYZ
      expected: { r: 0.22, g: 0, b: 255 }, // Blue color in RGB
    },
    {
      input: { x: 95.05, y: 100, z: 108.9 }, // White color in XYZ
      expected: { r: 255, g: 255, b: 255 }, // White color in RGB
    },
    {
      input: { x: 0, y: 0, z: 0 }, // Black color in XYZ
      expected: { r: 0, g: 0, b: 0 }, // Black color in RGB
    },
  ];
  let allPassed = true;

  for (const { input, expected } of testCases) {
    const result = normalizeRGB(convertXYZtoRGB(input));
    const passed = JSON.stringify(result) === JSON.stringify(expected);
    console.log(`Input: ${JSON.stringify(input)}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    console.log(`Actual: ${JSON.stringify(result)}`);
    console.log(`Passed: ${passed ? "yes" : "no"}`);
    console.log("");
    allPassed = allPassed && passed;
  }

  console.log(`All tests passed: ${allPassed ? "yes" : "no"}`);
}
function normalizeXYZ(xyz: XYZ): XYZ {
  xyz.x = parseFloat(xyz.x.toFixed(2));
  xyz.y = parseFloat(xyz.y.toFixed(2));
  xyz.z = parseFloat(xyz.z.toFixed(2));
  return xyz;
}
function normalizeRGB(rgb: RGB): RGB {
  rgb.r = parseFloat(rgb.r.toFixed(2));
  rgb.g = parseFloat(rgb.g.toFixed(2));
  rgb.b = parseFloat(rgb.b.toFixed(2));
  return rgb;
}
function normalizeHLS(hls: HLS): HLS {
  hls.h = parseFloat(hls.h.toFixed(2));
  hls.l = parseFloat(hls.l.toFixed(2));
  hls.s = parseFloat(hls.s.toFixed(2));
  return hls;
}
