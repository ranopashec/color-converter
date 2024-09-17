import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ColorPickerModule } from "ngx-color-picker";
import { NgClass, NgIf } from "@angular/common";
import { RGB, XYZ, HLS } from "./models/schemes";
import {
  convertHLStoXYZ,
  convertXYZtoHLS,
  convertRGBtoXYZ,
  convertXYZtoRGB,
  convertHEXtoRGB,
  convertRGBtoHEX,
} from "./utils/converters";
import { testAllConverters } from "./utils/tests";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColorPickerModule, NgClass, FormsModule, NgIf],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "ColorConverter";
  rgb: RGB = { r: 100, g: 2, b: 5 };
  xyz: XYZ = convertRGBtoXYZ(this.rgb);
  hls: HLS = convertXYZtoHLS(this.xyz);

  color = convertRGBtoHEX(this.rgb);
  ngOnInit(): void {
    this.normalize();
    testAllConverters();
  }

  normalize() {
    this.rgb.r = parseFloat(this.rgb.r.toFixed(2));
    this.rgb.g = parseFloat(this.rgb.g.toFixed(2));
    this.rgb.b = parseFloat(this.rgb.b.toFixed(2));

    this.xyz.x = parseFloat(this.xyz.x.toFixed(2));
    this.xyz.y = parseFloat(this.xyz.y.toFixed(2));
    this.xyz.z = parseFloat(this.xyz.z.toFixed(2));

    this.hls.h = parseFloat(this.hls.h.toFixed(2));
    this.hls.l = parseFloat(this.hls.l.toFixed(2));
    this.hls.s = parseFloat(this.hls.s.toFixed(2));
  }

  reset() {
    this.color = "#000000";
    this.rgb = convertHEXtoRGB(this.color);
    this.xyz = convertRGBtoXYZ(this.rgb);
    this.hls = convertXYZtoHLS(this.xyz);
    this.normalize();
  }
  onColorChange(event: any) {
    this.rgb = convertHEXtoRGB(this.color);
    this.xyz = convertRGBtoXYZ(this.rgb);
    this.hls = convertXYZtoHLS(this.xyz);
    this.normalize();
  }

  onRGBChange(event: any) {
    if (event != null) {
      for (const key in this.rgb) {
        const value = this.rgb[key as keyof RGB];
        if (value < 0 || value > 255) {
          this.rgb[key as keyof RGB] = 0;
        }
      }
      this.xyz = convertRGBtoXYZ(this.rgb);
      this.hls = convertXYZtoHLS(this.xyz);
      this.color = convertRGBtoHEX(this.rgb);
      this.normalize();
    }
  }

  onXYZChange(event: any) {
    if (event != null) {
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
      this.normalize();
    }
  }
  onHLSChange(event: any) {
    if (event != null) {
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
      this.normalize();
    }
  }

  xyzzmin = 1;

  hoverRGB = false;
  hoverXYZ = false;
  hoverHLS = false;
}
