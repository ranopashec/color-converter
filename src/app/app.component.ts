import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ColorPickerModule } from "ngx-color-picker";
import { NgClass } from "@angular/common";
import { RGB, XYZ, HLS } from "./models/schemes";
import {
  convertHLStoXYZ,
  convertXYZtoHLS,
  convertRGBtoXYZ,
  convertXYZtoRGB,
  convertHEXtoRGB,
  convertRGBtoHEX,
} from "./utils/converters";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColorPickerModule, NgClass, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "ColorConverter";
  rgb: RGB = { r: 100, g: 2, b: 5 };
  xyz: XYZ = convertRGBtoXYZ(this.rgb);
  hls: HLS = convertXYZtoHLS(this.xyz);

  color = convertRGBtoHEX(this.rgb);

  reset() {
    this.color = "#000000";
    this.rgb = convertHEXtoRGB(this.color);
    this.xyz = convertRGBtoXYZ(this.rgb);
    this.hls = convertXYZtoHLS(this.xyz);
  }
  onColorChange(event: any) {
    this.rgb = convertHEXtoRGB(this.color);
    this.xyz = convertRGBtoXYZ(this.rgb);
    this.hls = convertXYZtoHLS(this.xyz);
  }
  onRGBChange(event: any) {
    for (const key in this.rgb) {
      const value = this.rgb[key as keyof RGB];
      if (value < 0 || value > 255) {
        this.rgb[key as keyof RGB] = 0;
      }
    }
    this.xyz = convertRGBtoXYZ(this.rgb);
    this.hls = convertXYZtoHLS(this.xyz);
    this.color = convertRGBtoHEX(this.rgb);
  }

  onXYZChange(event: any) {
    if (this.xyz.x > 95.05 || this.xyz.x < 0) {
      this.xyz.x = 0;
    }
    if (this.xyz.y > 100 || this.xyz.y < 0) {
      this.xyz.y = 0;
    }
    if (this.xyz.z > 108.883 || this.xyz.z < 0) {
      this.xyz.z = 0;
    }
    this.rgb = convertXYZtoRGB(this.xyz);
    this.hls = convertXYZtoHLS(this.xyz);
    this.color = convertRGBtoHEX(this.rgb);
  }
  onHLSChange(event: any) {
    if (this.hls.h < 0 || this.hls.h > 360) {
      this.hls.h = 0;
    }
    if (this.hls.s < 0 || this.hls.s > 100) {
      this.hls.s = 0;
    }
    if (this.hls.l < 0 || this.hls.l > 100) {
      this.hls.l = 0;
    }
    this.xyz = convertHLStoXYZ(this.hls);
    this.rgb = convertXYZtoRGB(this.xyz);
    this.color = convertRGBtoHEX(this.rgb);
  }

  xyzzmin = 1;

  hoverCMYK = false;
  hoverHLS = false;
  hoverXYZ = false;
}
