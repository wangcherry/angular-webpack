import { Component } from '@angular/core';
import _ from 'lodash';
@Component({
    selector: 'lodash',
    templateUrl: './lodash.component.html'
})
export class LodashComponent {
    constructor( ) {
        const result = _.chunk(['a', 'b', 'c', 'd'], 2);

        console.log(result);
    }
}
