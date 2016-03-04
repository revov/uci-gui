import { Component, View } from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, CanActivate} from 'angular2/router';

import {ImportPgn} from '../buttons/importPgn.component';
import {LoggerService} from '../../services/logger.service';
import {NotificationService, NotificationLevel} from '../../services/notification.service';
import {ImportService} from '../../services/api/import.service';

@Component({
    providers: [ImportService]
})
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
export class GamesList {
    constructor (
        private _logger: LoggerService,
        private _importService: ImportService,
        private _notificationService: NotificationService
    ) {}

    onPgnImport(pgn : string) {
        this._logger.debug('Importing PGN:\n' + pgn);
        this._importService.uploadPgn(pgn)
            .subscribe(
                () => this._notificationService.notify(NotificationLevel.success, 'Successfully imported PGN.'),
                () => this._notificationService.notify(NotificationLevel.error, 'There was an error importing the PGN.')
            );
    }
}
