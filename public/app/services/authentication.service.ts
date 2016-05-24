import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {User, IPreferences} from '../models/user';
import {LoggerService} from './logger.service';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    private _loginUrl = 'api/login';
    private _logoutUrl = 'api/logout';
    private _registerUrl = 'api/register';
    private _preferencesUrl = 'api/preferences';
    private _userUrl = 'api/user';

    private _requestOptions: RequestOptions;
    
    public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    constructor (
        private _http: Http,
        private _logger: LoggerService
    ) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this._requestOptions = new RequestOptions({ headers: headers });

        this._http.get(this._userUrl, this._requestOptions)
                        .map(res => <User> res.json().data)
                        .subscribe(
            user => this.currentUser.next(user),
            err => _logger.info('No user logged in.')
        );

        this.currentUser.subscribe(user => {
            if(user) {
                _logger.info('Current user:');
                _logger.debug(user);
            } else {
                _logger.info('User logged out.');
            }
        });
    }

    login ( loginData : {} ) : Observable<User> {
        let body = JSON.stringify(loginData);

        return this._http.post(this._loginUrl, body, this._requestOptions)
                        .map(res => {
                            let user : User = res.json().data;
                            this.currentUser.next(user);

                            return user;
                        });
    }

    logout () : Observable<boolean> {
        return this._http.post(this._logoutUrl, '', this._requestOptions)
                        .map(res => {
                            this.currentUser.next(null);

                            return true;
                        });
    }

    register ( registrationData : {} ) : Observable<User> {
        let body = JSON.stringify(registrationData);

        return this._http.post(this._registerUrl, body, this._requestOptions)
                        .map(res => {
                            let user : User = res.json().data;
                            this.currentUser.next(user);

                            return user;
                        });
    }
    
    savePreferences ( preferences: IPreferences ) {
        let body = JSON.stringify(preferences);
        
         return this._http.post(this._preferencesUrl, body, this._requestOptions)
                        .map(res => {
                            let user : User = res.json().data;
                            this.currentUser.next(user);

                            return user;
                        });
    }
}