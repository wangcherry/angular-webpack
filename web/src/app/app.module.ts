import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
// import { Ajax, SharkModule } from '@shark/shark-angularX';

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
    }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes, {
            useHash: true,
            onSameUrlNavigation: 'reload'
        })
    ],
    declarations: [AppComponent, HomeComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        // private ajax: Ajax,
    ) {
        // this.ajax.setContextPath('');
        // this.ajax.setFilterCode((res, type) => {
        //     if (type === 'head') {
        //         return true;
        //     } else {
        //         return res.code === 200;
        //     }
        // });
        // this.ajax.setFilterData((res, type) => {
        //     return res;
        // });
    }
}
