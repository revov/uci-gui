import {Injectable} from 'angular2/core';
import {Http, Headers, RequestOptions} from 'angular2/http';
import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    private _loginUrl = 'api/login';
    private _logoutUrl = 'api/logout';
    private _registerUrl = 'api/register';
    private _userUrl = 'api/user';
    
    private _requestOptions: RequestOptions;
    
    public currentUser: Subject<User> = new Subject<User>();

    constructor (private http: Http) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        this._requestOptions = new RequestOptions({ headers: headers });

        this.http.get(this._userUrl, this._requestOptions)
                        .map(res => <User> res.json())
                        .subscribe(
                            user => this.currentUser.next(user),
                            err => console.log('No user logged in.')
                        );

        this.currentUser.subscribe(user => {
            if(user) {
                console.log('User logged in:');
                console.log(user);
            } else {
                console.log('User logged out.');
            }
        });
    }

    login ( loginData : {} ) : Observable<User> {
        let body = JSON.stringify(loginData);

        return this.http.post(this._loginUrl, body, this._requestOptions)
                        .map(res => {
                            let user : User = res.json();
                            this.currentUser.next(user);

                            return user;
                        });
    }

    logout () : Observable<boolean> {
        return this.http.post(this._logoutUrl, '', this._requestOptions)
                        .map(res => {
                            this.currentUser.next(null);

                            return true;
                        });
    }

    register ( registrationData : {} ) : Observable<User> {
        let body = JSON.stringify(registrationData);
        
        return this.http.post(this._registerUrl, body, this._requestOptions)
                        .map(res => {
                            let user : User = res.json();
                            this.currentUser.next(user);

                            return user;
                        });
    }
}