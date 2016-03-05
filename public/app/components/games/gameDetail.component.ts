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
            <chessboard [fen]="_currentPositionFen"></chessboard>
            <moves-browser [halfMoves]="_shortHistoryCache" (moveSelected)="onMoveSelected($event)"></moves-browser>
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
    private __game: Game;
    set _game(game: Game) {
        this.__game = game;
        this._chessJsInstance.load_pgn(game.pgn);
        this._shortHistoryCache = this._chessJsInstance.history();
    }
    get _game() {
        return this.__game;
    }

    private _chessJsInstance: Chess = new Chess();
    private _shortHistoryCache: any[] = [];
    private _currentPositionFen: string = "start";

    constructor (
        private _logger: LoggerService,
        private _routeParams: RouteParams,
        private _gamesService: GamesService
    ) {
        let gameId = this._routeParams.get('id');

        this._gamesService.get(gameId)
            .subscribe(
                (game) => {
                    this._game = game;
                    this._logger.debug(game);
                }
            );
    }
    
    onMoveSelected(index: number) {
        this._currentPositionFen = this.getFenForPositionAtMove(index);
    }
    
    /**
     * Deal with the fact that Chess JS cannot give us the FEN string of a previous position
     */
    getFenForPositionAtMove(index: number) {
        let gameReplay = new Chess();

        for(let i =0; i <= index; i++) {
            gameReplay.move(this._shortHistoryCache[i]);
        }

        return gameReplay.fen();
    }
}
