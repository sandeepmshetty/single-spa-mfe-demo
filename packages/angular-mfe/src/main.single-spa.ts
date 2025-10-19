import { NgZone } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    
    // Merge single-spa providers with app config
    const mergedConfig = {
      ...appConfig,
      providers: [
        ...(appConfig.providers || []),
        ...getSingleSpaExtraProviders()
      ]
    };
    
    return bootstrapApplication(AppComponent, mergedConfig);
  },
  template: '<app-root />',
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
