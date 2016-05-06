import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChange, NgZone } from '@angular/core';
import {LoggerService} from '../../services/logger.service';
import Plotly from 'plotly/plotly.js/dist/plotly';

@Component({
    selector: 'barchartAnalysis',
    template: `
        <div id="{{_unique_id}}" class="item"></div>
    `
})
export class BarChartAnalysis implements AfterViewInit, OnDestroy {
    @Input() moves: any[];
    @Input() white: string;
    @Input() black: string;
    @Input() result: string;

    private _unique_id : string = 'plotly' + (new Date()).getTime();
    private _plotlyChartPromise: any;
    private _whiteMovesTrace: any = {
        x: [],
        y: [],
        type: 'bar',
        name: 'White',
        marker: {
            color: '#f0d9b5',
            opacity: 0.7,
        }
    };
    private _blackMovesTrace: any = {
        x: [],
        y: [],
        type: 'bar',
        name: 'Black',
        marker: {
            color: '#b58863',
            opacity: 0.5
        }
    };
    private _layout: any = {
        title: '',
        xaxis: {
            title: 'Move number'
        },
        yaxis: {
            title: 'Pawn advantage'
        },
        autosize: false,
        width: 1000,
        height: 450,
        bargap: 0.15,
        bargroupgap: 0.1
    };
    private _configuration: any = {
        displaylogo: false,
        displayModeBar: false,
        scrollZoom: true
    };

    constructor (private _logger: LoggerService, private _zone : NgZone) {}

    ngAfterViewInit () {
        this._zone.runOutsideAngular(() => {
            
        });
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if(changes['white']) {
            this._whiteMovesTrace.name = changes['white'].currentValue;
        }
        
        if(changes['black']) {
            this._blackMovesTrace.name = changes['black'].currentValue;
        }

        if(changes['result']) {
            this._layout.title = changes['result'].currentValue;
        }

        // Todo this will not trigger if moves is not immutable (Angular 2 checks by reference)
        if (changes['moves'] && changes['moves'].currentValue) {
            this.rebuildChart();
        }
    }

    rebuildChart() {
        this._whiteMovesTrace.x = [];
        this._whiteMovesTrace.y = [];
        this._blackMovesTrace.x = [];
        this._blackMovesTrace.y = [];

        for (let i = 0; i < this.moves.length; i++) {
            let fullMoveNumber = Math.floor((i+1)/2);
            let isWhiteMove: boolean = (i%2 == 0);
            if(isWhiteMove) {
                this._whiteMovesTrace.x.push(fullMoveNumber);
                this._whiteMovesTrace.y.push(this.moves[i].score.cp / 100);
            } else {
                this._blackMovesTrace.x.push(fullMoveNumber);
                this._blackMovesTrace.y.push(this.moves[i].score.cp / 100);
            }
        }

        this._zone.runOutsideAngular(() => {
            
        });
    }
    
    ngOnDestroy() {
        this._zone.runOutsideAngular(() => {
            this._logger.debug('Destroying plotly chart #' + this._unique_id);
            
            this._plotlyChartPromise = null;
        });
    }
}
