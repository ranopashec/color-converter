import { RGB, HLS, XYZ } from "../models/schemes";

export function testAllConverters(): void {
  testConvertHLStoXYZ();
  testConvertXYZtoHLS();
  testConvertRGBtoXYZ();
  testConvertXYZtoRGB();
}

export function convertRGBtoHEX(rgb: RGB): string {
  rgb.r = Math.round(rgb.r);
  rgb.g = Math.round(rgb.g);
  rgb.b = Math.round(rgb.b);

  return `#${[rgb.r, rgb.g, rgb.b]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`;
}
export function convertHEXtoRGB(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    r: parseInt(result!![1], 16),
    g: parseInt(result!![2], 16),
    b: parseInt(result!![3], 16),
  };
}

// RGB to XYZ
export function convertRGBtoXYZ(rgb: RGB): XYZ {
  // Convert RGB to linear RGB
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  if (r > 0.04045) {
    r = Math.pow((r + 0.055) / 1.055, 2.4);
  } else {
    r = r / 12.92;
  }

  if (g > 0.04045) {
    g = Math.pow((g + 0.055) / 1.055, 2.4);
  } else {
    g = g / 12.92;
  }

  if (b > 0.04045) {
    b = Math.pow((b + 0.055) / 1.055, 2.4);
  } else {
    b = b / 12.92;
  }

  // Convert linear RGB to XYZ
  let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  // Convert XYZ to 0-100 range
  x *= 100;
  y *= 100;
  z *= 100;

  return { x, y, z };
}

// XYZ to RGB
export function convertXYZtoRGB(xyz: XYZ): RGB {
  let x = xyz.x / 100;
  let y = xyz.y / 100;
  let z = xyz.z / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return {
    r: Math.max(0, Math.min(1, r)) * 255,
    g: Math.max(0, Math.min(1, g)) * 255,
    b: Math.max(0, Math.min(1, b)) * 255,
  };
}

// RGB to HLS
export function convertRGBtoHLS(rgb: RGB): HLS {
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

// HLS to RGB
export function convertHLStoRGB(hls: HLS): RGB {
  const h = hls.h / 360;
  const l = hls.l / 100;
  const s = hls.s / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: r * 255,
    g: g * 255,
    b: b * 255,
  };
}

// XYZ to HLS
export function convertXYZtoHLS(xyz: XYZ): HLS {
  const rgb = convertXYZtoRGB(xyz);
  return convertRGBtoHLS(rgb);
}
export function convertHLStoXYZ(hls: HLS): XYZ {
  const { h, l, s } = hls;
  const c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l / 100 - c / 2;
  let r, g, b;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  r = r + m;
  g = g + m;
  b = b + m;

  // Normalize RGB values to [0, 1]
  r = Math.min(Math.max(r, 0), 1);
  g = Math.min(Math.max(g, 0), 1);
  b = Math.min(Math.max(b, 0), 1);

  // Convert normalized RGB to XYZ
  const [xn, yn, zn] = [
    (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) * 100,
    (0.2126729 * r + 0.7151522 * g + 0.072175 * b) * 100,
    (0.0193339 * r + 0.119192 * g + 0.9503041 * b) * 100,
  ];
  return { x: xn, y: yn, z: zn };
}

function testConvertHLStoXYZ(): void {
  const testCases: Array<{ input: HLS; expected: XYZ }> = [
    {
      input: { h: 0, l: 50, s: 50 },
      expected: { x: 44.38, y: 35.63, z: 28.19 }, // Updated expected values
    },
    {
      input: { h: 120, l: 75, s: 50 },
      expected: { x: 68.34, y: 80.38, z: 71.03 }, // Updated expected values
    },
    {
      input: { h: 240, l: 25, s: 75 },
      expected: { x: 12.71, y: 8.96, z: 42.44 }, // Updated expected values
    },
    {
      input: { h: 300, l: 50, s: 100 },
      expected: { x: 59.29, y: 28.48, z: 96.96 }, // Updated expected values
    },
    {
      input: { h: 60, l: 0, s: 100 },
      expected: { x: 0, y: 0, z: 0 }, // This one seems correct
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
  const testCases: Array<{ input: XYZ; expected: HLS }> = [
    {
      input: { x: 95.05, y: 100, z: 108.88 },
      expected: { h: 60, s: 100, l: 100 },
    },
    {
      input: { x: 19.01, y: 20, z: 21.78 },
      expected: { h: 121.46, s: 0, l: 48.45 },
    },
    {
      input: { x: 32.3, y: 34, z: 35.76 },
      expected: { h: 41.08, s: 2.06, l: 61.48 },
    },
    {
      input: { x: 53.81, y: 58, z: 60.32 },
      expected: { h: 116.82, s: 5.87, l: 77.98 },
    },
    {
      input: { x: 77, y: 82, z: 88 },
      expected: { h: 138.13, s: 9.25, l: 91.24 },
    },
    {
      input: { x: 41.24, y: 21.26, z: 1.93 },
      expected: { h: 0.02, s: 100, l: 50 },
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

function testConvertRGBtoXYZ(): void {
  const testCases: Array<{ input: RGB; expected: XYZ }> = [
    {
      input: { r: 255, g: 0, b: 0 },
      expected: { x: 41.24, y: 21.26, z: 1.93 },
    },
    {
      input: { r: 0, g: 255, b: 0 },
      expected: { x: 35.76, y: 71.52, z: 11.92 },
    },
    {
      input: { r: 0, g: 0, b: 255 },
      expected: { x: 18.05, y: 7.22, z: 95.05 },
    },
    {
      input: { r: 255, g: 255, b: 0 },
      expected: { x: 77, y: 92.78, z: 13.85 },
    },
    {
      input: { r: 0, g: 255, b: 255 },
      expected: { x: 53.81, y: 78.74, z: 106.97 },
    },
    {
      input: { r: 255, g: 0, b: 255 },
      expected: { x: 59.29, y: 28.48, z: 96.98 },
    },
    {
      input: { r: 128, g: 128, b: 128 },
      expected: { x: 20.52, y: 21.59, z: 23.51 },
    },
    { input: { r: 128, g: 0, b: 0 }, expected: { x: 8.9, y: 4.59, z: 0.42 } },
    {
      input: { r: 0, g: 128, b: 128 },
      expected: { x: 16.62, y: 20.03, z: 2.99 },
    },
  ];

  let allPassed = true;

  for (const { input, expected } of testCases) {
    const result = normalizeXYZ(convertRGBtoXYZ(input));
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
  const testCases: Array<{ input: XYZ; expected: RGB }> = [
    {
      input: { x: 41.24, y: 21.26, z: 1.93 },
      expected: { r: 255, g: 0.07, b: 0 },
    },
    {
      input: { x: 35.76, y: 71.52, z: 11.92 },
      expected: { r: 0, g: 255, b: 0.04 },
    },
    {
      input: { x: 18.05, y: 7.22, z: 95.05 },
      expected: { r: 0.08, g: 0, b: 255 },
    },
    {
      input: { x: 77, y: 92.78, z: 13.85 },
      expected: { r: 255, g: 255, b: 0.04 },
    },
    {
      input: { x: 53.81, y: 78.74, z: 106.97 },
      expected: { r: 0.08, g: 255, b: 255 },
    },
    {
      input: { x: 59.29, y: 28.48, z: 96.98 },
      expected: { r: 255, g: 0.05, b: 255 },
    },
    {
      input: { x: 76.03, y: 80, z: 87.12 },
      expected: { r: 231.07, g: 231.13, b: 231.12 },
    },
    {
      input: { x: 20.52, y: 21.59, z: 23.51 },
      expected: { r: 128, g: 128.02, b: 128.01 },
    },
    {
      input: { x: 12.7, y: 6.32, z: 0.57 },
      expected: { r: 151.46, g: 0, b: 0.68 },
    },
    {
      input: { x: 22.7, y: 28.48, z: 4.57 },
      expected: { r: 143.09, g: 152.48, b: 9.39 },
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
