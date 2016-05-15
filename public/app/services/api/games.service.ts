import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {LoggerService} from '../logger.service';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/takeWhile';
import {Game} from '../../models/game';
import {SocketApiService} from '../socketApi.service';

interface IGameProgressNotification {
    status: string,
    progress: number
}

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
                        .map(res => <Game>res.json());
    }

    /**
     * Gets all the games as Observables, because each game will report its analysis progres through websockets
     */
    getAll() : Observable<Observable<Game>[]> {
        return this._http.get(this._gamesUrl, this._requestOptions)
                        .map(res => {
                            let games = <Game[]>res.json();
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
        return this._socketApiService.subscribe<IGameProgressNotification>('/game', game._id)
            .takeWhile(gameProgressNotification => gameProgressNotification.status !== 'Complete')
            .map(gameProgressNotification => {
                // FIXME: should clone this instead of mutating it:
                game.analysis.status = gameProgressNotification.status;
                game.analysis.progress = gameProgressNotification.progress;

                return game;
            });
    }
}
