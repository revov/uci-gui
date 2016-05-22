import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {LoggerService} from '../logger.service';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/takeWhile';
import {Game} from '../../models/game';
import {SocketApiService} from '../socketApi.service';

@Injectable()
export class GamesService {
    private _gamesUrl = 'api/games';

    private _requestOptions: RequestOptions;

    constructor (
        private _http: Http,
        private _logger: LoggerService,
        private _socketApiService: SocketApiService
    ) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this._requestOptions = new RequestOptions({ headers: headers });
    }

    get(gameId: string): Observable<Game> {
        return this._http.get(this._gamesUrl + '/' + gameId, this._requestOptions)
                        .map(res => <Game>res.json().data);
    }

    /**
     * Gets all the games as Observables, because each game will report its analysis progress through websockets
     */
    getAll() : Observable<Observable<Game>[]> {
        return this._http.get(this._gamesUrl, this._requestOptions)
                        .map(res => {
                            let games = <Game[]>res.json().data;
                            let gamesObservables: Observable<Game>[] = [];

                            for(let i = 0; i<games.length; i++) {
                                if(games[i].analysis.status === 'Complete') {
                                    gamesObservables.push(Observable.from([games[i]]));
                                } else {
                                    gamesObservables.push(this.gameProgress(games[i]));
                                }
                            }

                            return gamesObservables;
                        });
    }

    delete(gameId: string) : Observable<boolean> {
        return this._http.delete(this._gamesUrl + '/' + gameId, this._requestOptions)
                        .map(res => true);
    }

    gameProgress(game: Game): Observable<Game> {
        return this._socketApiService.subscribe<Game>('/game', game._id)
            .takeWhile(currentGame => currentGame.analysis.status !== 'Complete');
    }
}
