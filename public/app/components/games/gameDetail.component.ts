import { Component, View, OnInit } from 'angular2/core';
import {CanActivate, RouteParams} from 'angular2/router';
import {LoggerService} from '../../services/logger.service';

@Component({})
@View({
    template: `
        <div>
            Game {{_gameId}} detail
        </div>
    `
})
@CanActivate((next, prev) => {
    // TODO: Implement when we have DI here to get hold of our authenticationService
    // https://github.com/angular/angular/issues/4112
    // For now it is not much of a problem since we will be hiding the link to this component
    // and the back end won't serve any content anyway
    return true;
})
export class GameDetail implements OnInit {
    private _gameId : String;
    
    constructor (
        private _logger: LoggerService,
        private _routeParams: RouteParams
    ) {}

    ngOnInit() {
        this._gameId = this._routeParams.get('id');
    }
}
