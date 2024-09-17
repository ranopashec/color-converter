import { RGB, HLS, XYZ } from "../models/schemes";
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

export function convertRGBtoXYZ(rgb: RGB): XYZ {
  let { r, g, b } = rgb;

  // Convert RGB to a range of 0-1
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using the D65 illuminant
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100;
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) * 100;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) * 100;

  return { x, y, z };
}

export function convertXYZtoRGB(xyz: XYZ): RGB {
  let { x, y, z } = xyz;

  // Convert XYZ to a range of 0-1
  x = x / 100;
  y = y / 100;
  z = z / 100;

  // Convert XYZ to RGB
  let r = x * 3.2404542 - y * 1.5371385 - z * 0.4985314;
  let g = -x * 0.969266 + y * 1.8760108 + z * 0.041556;
  let b = x * 0.0556434 - y * 0.2040259 + z * 1.0572252;

  // Apply gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  // Convert to a range of 0-255
  r = Math.min(Math.max(0, r * 255), 255);
  g = Math.min(Math.max(0, g * 255), 255);
  b = Math.min(Math.max(0, b * 255), 255);

  return { r, g, b };
}

export function convertXYZtoHLS(xyz: XYZ): HLS {
  const rgb = convertXYZtoRGB(xyz);
  return convertRGBtoHLS(rgb);
}

export function convertHLStoXYZ(hls: HLS): XYZ {
  const rgb = convertHLStoRGB(hls);
  return convertRGBtoXYZ(rgb);
}

function convertRGBtoHLS(rgb: RGB): HLS {
  let { r, g, b } = rgb;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h: number, l: number, s: number;
  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
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
      default:
        h = 0;
    }
    h /= 6;
  }

  return { h: h * 360, l: l * 100, s: s * 100 };
}

function convertHLStoRGB(hls: HLS): RGB {
  let { h, l, s } = hls;
  h /= 360;
  l /= 100;
  s /= 100;

  let r: number, g: number, b: number;

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

  return { r: r * 255, g: g * 255, b: b * 255 };
}
