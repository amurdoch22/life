import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

enableProdMode();

const disableErr = false;
const disableLog = true;
const disableTime = true;

if (window && disableLog) {
  window.console.log = () => {
  };

  window.console.info = () => {
  };
}

if (window) {
  if (disableErr) {
    window.console.error = () => {
    };
  }

  if (disableTime) {
    window.console.time = () => {
    };

    window.console.timeLog = () => {
    };

    window.console.timeEnd = () => {
    };
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
