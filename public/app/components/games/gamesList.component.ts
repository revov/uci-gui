import { Component, View } from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, CanActivate} from 'angular2/router';

import {ImportPgn} from '../buttons/importPgn.component';
import {LoggerService} from '../../services/logger.service';
import {NotificationService, NotificationLevel} from '../../services/notification.service';
import {ImportService} from '../../services/api/import.service';
import {GamesService} from '../../services/api/games.service';
import {Game} from '../../models/game';

@Component({
    providers: [ImportService]
})
@View({
    template: `
        <div>
            <div class="ui icon buttons">
                <import-pgn (onImport)="onPgnImport($event)"></import-pgn>

                <button class="ui button" (click)="loadGames()">
                    <i class="refresh icon"></i>
                </button>
            </div>

            <div class="ui inverted dimmer" [class.active]="_isLoading">
                <div class="ui loader"></div>
            </div>

            <table class="ui selectable celled table">
                <thead>
                    <tr>
                        <th>White</th>
                        <th>Black</th>
                        <th>Result</th>
                        <th>Progress</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="#game of _games; #i = index">
                        <td [routerLink]="['/Games', 'GameDetail', {id: game._id}]">{{game.white}}</td>
                        <td [routerLink]="['/Games', 'GameDetail', {id: game._id}]">{{game.black}}</td>
                        <td [routerLink]="['/Games', 'GameDetail', {id: game._id}]">{{game.result}}</td>
                        <td [routerLink]="['/Games', 'GameDetail', {id: game._id}]">{{game.analysis.progress}}%</td>
                        <td [routerLink]="['/Games', 'GameDetail', {id: game._id}]">{{game.analysis.status}}</td>
                        <td>
                            <button class="ui icon button" (click)="onDelete(game._id, i)">
                                <i class="red outline trash icon"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    `,
    styles: [`
        tbody td[href] {
            cursor: pointer; cursor: hand;
        }
    `],
    directives: [ImportPgn, ROUTER_DIRECTIVES]
})
@CanActivate((next, prev) => {
    // TODO: Implement when we have DI here to get hold of our authenticationService
    // https://github.com/angular/angular/issues/4112
    // For now it is not much of a problem since we will be hiding the link to this component
    // and the back end won't serve any content anyway
    return true;
})
export class GamesList {
    private _games: Game[] = [];
    private _isLoading : boolean = true;

    constructor (
        private _logger: LoggerService,
        private _importService: ImportService,
        private _notificationService: NotificationService,
        private _gamesService: GamesService
    ) {
        this.loadGames();
    }

    onPgnImport(pgn : string) {
        this._logger.debug('Importing PGN:\n' + pgn);
        this._importService.uploadPgn(pgn)
            .subscribe(
                () => this._notificationService.notify(NotificationLevel.success, 'Successfully imported PGN.'),
                () => this._notificationService.notify(NotificationLevel.error, 'There was an error importing the PGN.'),
                () => this.loadGames()
            );
    }

    loadGames() {
        this._isLoading = true;
        this._gamesService.getAll()
            .subscribe(
                games => this._games = games,
                () => this._isLoading = false,
                () => this._isLoading = false
            );
    }

    onDelete(id: string, index: number) {
        this._isLoading = true;
        this._gamesService.delete(id)
            .subscribe(
                () => {
                    this._games.splice(index, 1);
                    this._notificationService.notify(NotificationLevel.success, 'Successfully deleted game.');
                },
                () => {
                    this._notificationService.notify(NotificationLevel.error, 'There was an error deleting the game.');
                    this._isLoading = false;
                },
                () => {
                    this._isLoading = false;
                }
            );
    }
}
