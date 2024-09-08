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
} from "./utils/converters";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [ColorPickerModule, NgClass, FormsModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  rgb: RGB = { r: 1, g: 2, b: 5 };
  xyz: XYZ = convertRGBtoXYZ(this.rgb);
  hls: HLS = convertXYZtoHLS(this.xyz);

  reset() {
    this.rgb = { r: 0, g: 0, b: 0 };
    this.xyz = { x: 0, y: 0, z: 0 };
    this.hls = { h: 0, l: 0, s: 0 };
  }
  onRGBChange(event: any) {
    this.xyz = convertRGBtoXYZ(this.rgb);
    this.hls = convertXYZtoHLS(this.xyz);
  }

  onXYZChange(event: any) {
    this.rgb = convertXYZtoRGB(this.xyz);
    this.hls = convertXYZtoHLS(this.xyz);
  }
  onHLSChange(event: any) {
    this.xyz = convertHLStoXYZ(this.hls);
    this.rgb = convertXYZtoRGB(this.xyz);
  }

  xyzzmin = 1;

  hoverCMYK = false;
  hoverHLS = false;
  hoverXYZ = false;
}
