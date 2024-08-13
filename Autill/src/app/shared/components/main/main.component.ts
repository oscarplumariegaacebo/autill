import { Component } from '@angular/core';
import { FooterComponent } from "../../../core/components/footer/footer.component";
import { HeaderComponent } from '../../../core/components/header/header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
