import "zone.js";
//import 'reflect-metadata';

import {ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';

import { bootstrap } from '@angular/platform-browser-dynamic';
import { App } from './components/app.component';

import { enableProdMode } from '@angular/core';

if( (<any>window).isProductionEnvironment ) {
    enableProdMode();
}

//start our app
bootstrap(App, [ROUTER_PROVIDERS, HTTP_PROVIDERS]);
