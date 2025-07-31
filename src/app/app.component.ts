import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseComponent } from "./base/base.component";
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, BaseComponent, Toast],
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'library';
}
