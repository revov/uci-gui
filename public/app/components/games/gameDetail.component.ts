import { Component, View } from 'angular2/core';
import {CanActivate, RouteParams} from 'angular2/router';
import {LoggerService} from '../../services/logger.service';
import {Chessboard} from '../../integration/chessboardjs/chessboard.component';
import {GamesService} from '../../services/api/games.service';
import {Game} from '../../models/game';
import {MovesBrowser} from './movesBrowser.component';
import {Chess} from 'chess.js/chess';

@Component({})
@View({
    template: `
        <div>
            <chessboard [fen]="_currentPositionIndex < 0 ? 'start' : _fenCache[_currentPositionIndex]"></chessboard>
            <moves-browser [halfMoves]="_shortHistoryCache" (moveSelected)="_currentPositionIndex = $event"></moves-browser>
        </div>
    `,
    directives: [Chessboard, MovesBrowser]
})
@CanActivate((next, prev) => {
    // TODO: Implement when we have DI here to get hold of our authenticationService
    // https://github.com/angular/angular/issues/4112
    // For now it is not much of a problem since we will be hiding the link to this component
    // and the back end won't serve any content anyway
    return true;
})
export class GameDetail {
    private _game: Game;
    private _chessJsInstance: Chess = new Chess();
    private _shortHistoryCache: any[] = [];
    private _fenCache: string[] = [];
    private _currentPositionIndex: number = -1;

    constructor (
        private _logger: LoggerService,
        private _routeParams: RouteParams,
        private _gamesService: GamesService
    ) {
        let gameId = this._routeParams.get('id');

        this._gamesService.get(gameId)
            .subscribe(
                (game) => this.onGameChanged(game)
            );
    }

    /**
     * All actions inside this function are slow.
     * That's why we make sure to bulk them together and run them only once at the start
     * 
     * TODO: Improve performance twice by storing the history() in the database so that
     * we dont have to call load_pgn just to get the history and replay it once again.
     */
    private onGameChanged(game: Game): void {
        if(!game) {
            return;
        }

        this._logger.debug(game);

        this._fenCache = [];
        this._currentPositionIndex = -1;
        this._game = game;

        this._chessJsInstance.load_pgn(game.pgn);
        this._shortHistoryCache = this._chessJsInstance.history();

        let gameReplay = new Chess();
        for(let i=0; i < this._shortHistoryCache.length; i++) {
            gameReplay.move(this._shortHistoryCache[i]);
            this._fenCache.push(gameReplay.fen());
        }
    }
    
    private getFenForCurrentPosition(): string {
        if(this._currentPositionIndex < 0) {
            return 'start';
        }

        return this._fenCache[this._currentPositionIndex];
    }
}
