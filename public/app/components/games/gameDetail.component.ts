import { Component } from '@angular/core';
import {CanActivate, RouteParams} from '@angular/router-deprecated';
import {Chess} from 'chess.js/chess';

import {LoggerService} from '../../services/logger.service';
import {Chessboard} from '../../integration/chessboardjs/chessboard.component';
import {GamesService} from '../../services/api/games.service';
import {Game} from '../../models/game';
import {MovesBrowser} from './movesBrowser.component';
import {BarChartAnalysis} from '../../integration/plotly/barChartAnalysis.component';

@Component({
    template: `
        <div>
            <div class="ui two column grid">
                <chessboard [fen]="_currentPositionIndex < 0 ? 'start' : _fenCache[_currentPositionIndex]" class="column"></chessboard>
                <moves-browser [halfMoves]="_shortHistoryCache" (moveSelected)="_currentPositionIndex = $event" class="column" style="height=500px"></moves-browser>
            </div>
            <barchartAnalysis [moves]="_game?.analysis?.moves" [white]="_game?.white" [black]="_game?.black" [result]="_game?.result"></barchartAnalysis>
        </div>
    `,
    directives: [Chessboard, MovesBrowser, BarChartAnalysis]
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
}
