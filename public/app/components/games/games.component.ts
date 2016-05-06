import { Component } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteConfig, CanActivate} from '@angular/router-deprecated';

import {GamesService} from '../../services/api/games.service';
import {GamesList} from './gamesList.component';
import {GameDetail} from './gameDetail.component';

@Component({
    providers: [GamesService],
    template: `
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
@CanActivate((next, prev) => {
    // TODO: Implement when we have DI here to get hold of our authenticationService
    // https://github.com/angular/angular/issues/4112
    // For now it is not much of a problem since we will be hiding the link to this component
    // and the back end won't serve any content anyway
    return true;
})
@RouteConfig([
    { path: '/', name: 'GamesList', component: GamesList, useAsDefault: true },
    { path: '/:id', name: 'GameDetail', component: GameDetail }
])
export class Games {}
