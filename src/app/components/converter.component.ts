import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { map, finalize } from 'rxjs';
import { Currency } from '../interfaces/currency.interface';
import { CurrencyService } from '../services/currency.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  converterForm: FormGroup;
  currencies: { [key: string]: Currency } = {};
  loading = false;
  result: number | null = null;
  conversionHistory: any[] = [];

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.converterForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      fromCurrency: ['', Validators.required],
      toCurrency: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCurrencies();
    this.loadHistory();
  }

  private loadCurrencies() {
    this.currencyService.getCurrencies().pipe(
      map(response => response.data)
    ).subscribe({
      next: (data) => {
        this.currencies = data;
      },
      error: (error) => {
        this.showError('Failed to load currencies');
      }
    });
  }

  private loadHistory() {
    this.currencyService.getConversionHistory().subscribe(
      history => this.conversionHistory = history
    );
  }

  onSubmit() {
    if (!this.converterForm.valid || this.loading) {
      return;
    }

    this.loading = true;
    this.result = null; // Reset previous result
    const { amount, fromCurrency, toCurrency } = this.converterForm.value;

    this.currencyService.getLatestRates(fromCurrency).pipe(
      map(response => response.data)
    ).subscribe({
        next: (rates) => {
          console.log('Received rates:', rates);
          if (!rates || !rates[toCurrency]) {
            this.showError(`Rate not found for currency: ${toCurrency}`);
            return;
          }

          const rate = rates[toCurrency];
          const result = amount * rate;
          this.result = parseFloat(result.toFixed(2));

          this.currencyService.addToHistory({
            id: '',
            fromCurrency,
            toCurrency,
            amount,
            result: this.result,
            date: new Date().toISOString()
          });
          
          // Force change detection
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Conversion error:', error);
          this.showError(`Failed to convert currency: ${error.message || 'Unknown error'}`);
          this.loading = false;
          this.cdr.detectChanges();
        },
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}