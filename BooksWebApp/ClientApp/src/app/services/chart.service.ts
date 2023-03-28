import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private _baseUrl: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this._baseUrl = baseUrl
  }

  getNumberOfBooksByYear(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(this._baseUrl + 'api/chart/number-of-books-by-year');
  }
}
