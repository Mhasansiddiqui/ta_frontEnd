import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ConverterComponent } from './components/converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    ConverterComponent
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Currency Converter</span>
    </mat-toolbar>

    <app-converter></app-converter>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class App {}
