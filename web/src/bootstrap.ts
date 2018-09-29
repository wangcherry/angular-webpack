declare const ENV: string;
declare const HOT: boolean;

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

if (ENV === 'development' && HOT) {
    if ((module as any).hot) {
        (module as any).hot.accept();
    }
}
if (ENV === 'production') {
    enableProdMode(); // 禁用Angular的开发模式，该模式关闭框架内的断言和其他检查。
}
platformBrowserDynamic().bootstrapModule(AppModule);
