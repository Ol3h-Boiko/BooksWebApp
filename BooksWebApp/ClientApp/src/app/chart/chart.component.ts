import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {}
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Number of books' }
    ]
  };

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getNumberOfBooksByYear();
  }

  getNumberOfBooksByYear(): void {
    this.chartService.getNumberOfBooksByYear()
      .subscribe({
        next: (response) => {
          const years = Object.keys(response);
          const countPerYear = Object.values(response) as number[];

          this.barChartData = {
            labels: years,
            datasets: [
              { data: countPerYear, label: 'Number of books' }
            ]
          };
        },
        error: (response) => {
          console.log(response);
        }
      });
  }
}
