import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms"; // Import FormsModule
import { ColorPickerModule } from "ngx-color-picker";
import { NgClass } from "@angular/common";
import { RGB, CMYK, XYZ, HLS } from "./models/schemes";
import {
  convertCMYKtoHLS,
  convertHLStoRGB,
  convertRGBtoHLS,
  convertRGBtoXYZ,
  convertXYZtoRGB,
  convertHLStoCMYK,
} from "./services/converters";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColorPickerModule, FormsModule, NgClass],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "color-converter";

  rgb: RGB = { r: null, g: null, b: null };

  cmyk: CMYK = { c: null, m: null, y: null, k: null };
  xyz: XYZ = { x: null, y: null, z: null };
  hls: HLS = { h: null, l: null, s: null };

  reset() {
    this.rgb = { r: null, g: null, b: null };
    this.cmyk = { c: null, m: null, y: null, k: null };
    this.xyz = { x: null, y: null, z: null };
    this.hls = { h: null, l: null, s: null };
  }
  onCMYKChange(event: any) {
    for (const key in this.cmyk) {
      const value = this.cmyk[key as keyof CMYK];
      if (value && (value > 100 || value < 0)) {
        this.cmyk[key as keyof CMYK] = null;
      }
    }
    if (this.cmyk.c && this.cmyk.m && this.cmyk.y && this.cmyk.k) {
      this.hls = convertCMYKtoHLS(this.cmyk);
      this.xyz = convertRGBtoXYZ(convertHLStoRGB(this.hls));
    }
  }

  onHLSChange(event: any) {
    // TODO: VALIDATION
    if (this.hls.h && this.hls.l && this.hls.s) {
      this.cmyk = convertHLStoCMYK(this.hls);
      this.xyz = convertRGBtoXYZ(convertHLStoRGB(this.hls));
    }
  }
  onXYZChange(event: any) {
    // TODO: VALIDATION
    if (this.xyz.x && this.xyz.y && this.xyz.z) {
      this.hls = convertRGBtoHLS(convertXYZtoRGB(this.xyz));
      this.cmyk = convertHLStoCMYK(this.hls);
    }
  }

  xyzzmin = 1;

  hoverCMYK = false;
  hoverHLS = false;
  hoverXYZ = false;
}
