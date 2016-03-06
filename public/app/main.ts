import 'zone.js/dist/zone.min.js';
import 'reflect-metadata';
//import 'es6-shim'; // For IE compatibility

import {ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import { bootstrap } from 'angular2/platform/browser';
import { App } from './components/app.component';

import { enableProdMode } from 'angular2/core';

if( (<any>window).isProductionEnvironment ) {
    enableProdMode();
}

//start our app
bootstrap(App, [ROUTER_PROVIDERS, HTTP_PROVIDERS]);
