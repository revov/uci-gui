import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Game} from '../../models/game';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'gamesCardItem',
    template: `
        <div class="content">
            <div class="header">
                {{_gameResolved?.result}}
            </div>
            <div class="meta" *ngIf="_gameResolved?.analysis?.status!=='Complete'">
                {{_gameResolved?.analysis?.progress}}% {{_gameResolved?.analysis?.status}}
            </div>
            <div class="description">
                <h4>{{_gameResolved?.white}} - {{_gameResolved?.black}}</h4>
                Date: {{_gameResolved?.datePlayed}}<br/>
                Event: {{_gameResolved?.event}}<br/>
                Site: {{_gameResolved?.site}}<br/>
                Round: {{_gameResolved?.round}}
            </div>
        </div>
        <div class="extra content">
            <button (click)="delete.emit(_gameResolved?._id)" class="ui right floated basic icon button">
                <i class="red trash icon"></i>
            </button>
            <button [routerLink]="['/Games', 'GameDetail', {id: _gameResolved?._id}]" class="ui labeled brown icon button">
                <i class="bar chart icon"></i>
                View
            </button>
        </div>
        
    `,
    directives: [ROUTER_DIRECTIVES]
})
export class GamesCardItem implements OnDestroy {
    @Input() game: Observable<Game>;
    @Output() delete: EventEmitter<string> = new EventEmitter<string>();
    
    private _gameSubscription: Subscription;
    private _gameResolved : Game;

    constructor(private _changeDetectorRef: ChangeDetectorRef) {}
    
    ngOnChanges() {
        if(this._gameSubscription) {
            this._gameSubscription.unsubscribe();
        }
        
        this._gameSubscription = this.game.subscribe(game => {
            this._gameResolved = game;
            this._changeDetectorRef.markForCheck();
        });
    }
    
    ngOnDestroy() {
        this._gameSubscription.unsubscribe();
    }
}
