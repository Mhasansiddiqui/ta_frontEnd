import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Currency, ConversionHistory } from '../interfaces/currency.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly API_URL = 'http://localhost:3001/api/currency';
  private readonly STORAGE_KEY = 'conversionHistory';
  private historySubject = new BehaviorSubject<ConversionHistory[]>(this.loadHistory());

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<{ data: { [key: string]: Currency } }> {
    return this.http.get<{ data: { [key: string]: Currency } }>(
      `${this.API_URL}/currencies`
    );
  }

  getLatestRates(baseCurrency: string): Observable<{ data: { [key: string]: number } }> {
    return this.http.get<{ data: { [key: string]: number } }>(
      `${this.API_URL}/latest?base_currency=${baseCurrency}`
    );
  }

  getHistoricalRate(date: string, baseCurrency: string): Observable<{ data: { [key: string]: number } }> {
    return this.http.get<{ data: { [key: string]: number } }>(
      `${this.API_URL}/historical?date=${date}&base_currency=${baseCurrency}`
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