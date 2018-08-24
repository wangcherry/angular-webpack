import { Component } from '@angular/core';
import { Ajax } from '@shark/shark-angularX'
@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(
        private ajax: Ajax
    ) {
        
    }
    ngOnInit() {
        this.getUser();
    }
    getUser() {
        this.ajax.get('/xhr/getUser.json',{i:1});
    }
}
