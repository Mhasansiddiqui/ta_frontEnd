import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Currency, ConversionHistory } from '../interfaces/currency.interface';
import { ENV } from '../app.environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly API_URL: string;
  private readonly STORAGE_KEY = 'conversionHistory';
  private historySubject = new BehaviorSubject<ConversionHistory[]>(this.loadHistory());

  constructor(
    private http: HttpClient,
    @Inject(ENV) private environment: { apiUrl: string }
  ) {
    this.API_URL = this.environment.apiUrl + '/api/currency';
  }

  getCurrencies(): Observable<{ data: { [key: string]: Currency } }> {
    console.log('Making API request to:', `${this.API_URL}/currencies`);
    return this.http.get<{ data: { [key: string]: Currency } }>(
      `${this.API_URL}/currencies`
    );
  }

  getLatestRates(baseCurrency: string): Observable<{ data: { [key: string]: number } }> {
    return this.http.get<{ data: { [key: string]: number } }>(
      `${this.API_URL}/latest?base_currency=${baseCurrency}`
    );
  }

  private loadHistory(): ConversionHistory[] {
    const history = localStorage.getItem(this.STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  }

  getConversionHistory(): Observable<ConversionHistory[]> {
    return this.historySubject.asObservable();
  }

  addToHistory(conversion: ConversionHistory): void {
    const history = this.loadHistory();
    history.unshift({ ...conversion, id: Date.now().toString() });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    this.historySubject.next(history);
  }
}