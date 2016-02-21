import 'zone.js/dist/zone.min.js';
import 'reflect-metadata';
import 'es6-shim';
//import 'semantic-ui';

import {ROUTER_PROVIDERS} from 'angular2/router';

import { bootstrap } from 'angular2/platform/browser';
import { App } from './components/app.component';

//start our app
bootstrap(App, [ROUTER_PROVIDERS]);
