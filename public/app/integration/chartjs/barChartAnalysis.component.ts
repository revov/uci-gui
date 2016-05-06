import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChange, NgZone } from '@angular/core';
import {LoggerService} from '../../services/logger.service';
import Chart from 'chart.js';

@Component({
    selector: 'barchartAnalysis',
    template: `
        <div class="item">
            <h3>{{result}}</h3>
            <canvas id="{{_unique_id}}" width="10" height="5"></canvas>
        </div>
    `,
    styles: [`
        h3 {
            text-align: center;
        }
    `]
})
export class BarChartAnalysis implements AfterViewInit, OnDestroy {
    @Input() moves: any[];
    @Input() white: string;
    @Input() black: string;
    @Input() result: string;

    private _unique_id : string = 'chartjs' + (new Date()).getTime();
    private _chartInstance: Chart;

    constructor (private _logger: LoggerService, private _zone : NgZone) {}

    ngAfterViewInit () {
        this._zone.runOutsideAngular(() => {
            this._chartInstance = new Chart(
                document.getElementById(this._unique_id),
                {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                label: 'white',
                                backgroundColor: "#f0d9b5",
                                data: []
                            },
                            {
                                label: this.black,
                                backgroundColor: "#b58863",
                                data: []
                            }
                        ],
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            callbacks: {
                                title: function(tooltipItems, data) {
                                    return `Move ${tooltipItems[0].xLabel}`;
                                },
                                label: function(tooltipItem, data) {
                                    return `Score: ${tooltipItem.yLabel}`;
                                }
                            }
                        },
                        scales: {
                            xAxes: [{
                                ticks: {
                                    beginAtZero:false
                                }
                            }]
                        }
                    }
                }
            );
        });
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if( this._chartInstance ) {
            this.rebuildChart();
        }
    }

    rebuildChart() {
        this._logger.info('Rebuilding chart...');

        this._chartInstance.data.labels = [];

        // White
        this._chartInstance.data.datasets[0].label = this.white;
        this._chartInstance.data.datasets[0].data = [];
        
        // Black
        this._chartInstance.data.datasets[1].label = this.black;
        this._chartInstance.data.datasets[1].data = [];

        for (let i = 0; i < this.moves.length; i++) {
            let fullMoveNumber = Math.floor((i/2)+1);
            let isWhiteMove: boolean = (i%2 == 0);
            if(isWhiteMove) {
                this._chartInstance.data.datasets[0].data.push(this.moves[i].score.cp / 100);
                this._chartInstance.data.labels.push(fullMoveNumber);
            } else {
                this._chartInstance.data.datasets[1].data.push(this.moves[i].score.cp / 100);
            }
        }

        this._zone.runOutsideAngular(() => {
            this._chartInstance.update();
        });
    }
    
    ngOnDestroy() {
        this._zone.runOutsideAngular(() => {
            this._chartInstance.destroy();
        });
    }
}
