import { Component } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ColorPickerModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  title = 'color-converter';
  color = "red"
}
