import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styles: [`
        .layout {
            heigth: 100px;
            background: #f4f4f4;
        }
    `]
})
export class AppComponent {
    constructor() {
        console.log('app1');
    }
}
