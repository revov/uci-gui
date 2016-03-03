import { Component, View } from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, CanActivate} from 'angular2/router';
import {ImportPgn} from './buttons/importPgn.component';
import {LoggerService} from '../services/logger.service';

@Component({})
@View({
    template: `
        <div>
            <import-pgn (onImport)="onPgnImport($event)"></import-pgn>
        </div>
    `,
    directives: [ImportPgn]
})
@CanActivate((next, prev) => {
    // TODO: Implement when we have DI here to get hold of our authenticationService
    // https://github.com/angular/angular/issues/4112
    // For now it is not much of a problem since we will be hiding the link to this component
    // and the back end won't serve any content anyway
    return true;
})
export class Games {
    constructor ( private _logger: LoggerService ) {}
    
    onPgnImport(pgn : String) {
        this._logger.debug('Importing PGN:\n' + pgn);
        // TODO: create a service and import the pgn calling the backend API
    }
}
