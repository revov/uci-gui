import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

@Injectable()
export class SocketApiService {
    protected _sockets: {} = {};
    
    constructor(protected _logger: LoggerService) {}
    
    /**
     * Subscribes to the 'progress' event of a specific namespace/room
     * 
     * Returned subscription is hot and should be unsubscribed from manually (it never completes)
     */
    public subscribe<T>(namespace: string, room: string): Observable<T> {
        if(!this._sockets.hasOwnProperty(namespace)) {
            this._sockets[namespace] = io(window.location.origin + namespace);
        }

        let socket = this._sockets[namespace];

        return new Observable<T>((streamObserver: Observer<T>) => {
            socket.emit('subscribe', room);

            let onProgressHandler = (payload: T) => {
                streamObserver.next(payload);
            };
            
            let cleanupHandler = () => {
                socket.emit('unsubscribe', room);
                socket.off('progress', onProgressHandler);
            };

            socket.on('progress', onProgressHandler);
            
            // Return unsubscribe function
            return () => {
                this._logger.debug(`unsubscribing from ${namespace}/${room}`);

                socket.emit('unsubscribe', room);
                socket.off('progress', onProgressHandler);
            };
        });
    }
}