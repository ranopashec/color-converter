import { AppComponent } from "./../app.component";
import { RGB, CMYK, HLS, XYZ } from "../models/schemes";
export function convertCMYKtoHLS(cmyk: CMYK): HLS {
  let c = cmyk.c!! / 100;
  let m = cmyk.m!! / 100;
  let y = cmyk.y!! / 100;
  let k = cmyk.k!! / 100;
  // Calculate intermediate values
  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);

  // Convert to HLS
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }

    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return { h: h, s: s, l: l };
}

export function convertHLStoRGB(hls: HLS): RGB {
  let h = hls.h!!;
  let s = hls.s!!;
  let l = hls.l!!;

  const sDecimal = s / 100;
  const lDecimal = l / 100;
  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lDecimal - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  let rgb: RGB = { r: r, g: g, b: b };
  return rgb;
}
export function convertRGBtoXYZ(rgb: RGB): XYZ {
  // Normalize the RGB values to the range 0-1
  let r = rgb.r!! / 255;
  let g = rgb.g!! / 255;
  let b = rgb.b!! / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using the transformation matrix
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  return {
    x: Math.round(x * 100),
    y: Math.round(y * 100),
    z: Math.round(z * 100),
  };
}
export function convertXYZtoRGB(xyz: XYZ): RGB {
  let x = xyz.x!!;
  let y = xyz.y!!;
  let z = xyz.z!!;

  // Normalize the XYZ values
  const X = x / 100;
  const Y = y / 100;
  const Z = z / 100;

  // Convert XYZ to RGB
  let r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
  let g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
  let b = X * 0.0557 + Y * -0.204 + Z * 1.057;

  r = Math.min(Math.max(0, r * 255), 255);
  g = Math.min(Math.max(0, g * 255), 255);
  b = Math.min(Math.max(0, b * 255), 255);
  console.log(r, g, b);
  return { r, g, b };
}
export function convertRGBtoHLS(rgb: RGB): HLS {
  let r = rgb.r!!;
  let g = rgb.g!!;
  let b = rgb.b!!;
  let a = 1;
  r /= 255;
  g /= 255;
  b /= 255;
  a = Math.min(a, 1);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (d !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
    if (h < 0) {
      h += 360;
    }
    s = d / (1 - Math.abs(2 * l - 1));
  }
  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function convertHLStoCMYK(hls: HLS): CMYK {
  return convertRGBtoCMYK(convertHLStoRGB(hls));
}

export const convertRGBtoCMYK = (rgb: RGB): CMYK => {
  let r = rgb.r!! / 255;
  let g = rgb.g!! / 255;
  let b = rgb.b!! / 255;
  const k = 1 - Math.max(r, g, b);
  const k1 = 1 - k;
  const c = k1 && (k1 - r) / k1;
  const m = k1 && (k1 - g) / k1;
  const y = k1 && (k1 - b) / k1;
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
};
