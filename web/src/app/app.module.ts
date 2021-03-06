import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { Ajax, SharkModule } from '@shark/shark-angularX';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LodashComponent } from './lodash/lodash.component';

// 定义常量 路由
const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'lodash',
        component: LodashComponent
    }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        SharkModule,
        RouterModule.forRoot(appRoutes, {
            useHash: true,
            onSameUrlNavigation: 'reload'
        })
    ],
    declarations: [AppComponent, HomeComponent, LodashComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        private ajax: Ajax
    ) {
        this.ajax.setContextPath('/angular-webpack');
        this.ajax.setFilterCode((res, type) => {
            if (type === 'head') {
                return true;
            } else {
                return res.code === 200;
            }
        });
        this.ajax.setFilterData((res, type) => {
            return res;
        });
    }
}
