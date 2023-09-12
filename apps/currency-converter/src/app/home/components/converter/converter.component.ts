import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject, debounceTime, distinctUntilChanged, interval } from 'rxjs';
import { CurrencyService } from '../../core/services/currency/currency.service';

@UntilDestroy()
@Component({
  selector: 'currency-converter-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // pipes
    CurrencyPipe,
    DecimalPipe,

    // material modules
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  currencyService: CurrencyService = inject(CurrencyService);
  amount = 0;
  result = 0;
  rate = 1.1;
  fixedRate = 0;

  currentCurrency = 'USD';
  reversedCurrentCurrency = 'EUR';
  isUsd = true;
  hasFixedRate = false;

  amount$ = new Subject<number>();
  fixedRate$ = new Subject<number>();

  generateRandomInteger(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  calculateAmount(): void {
    const rate = this.hasFixedRate ? this.fixedRate : this.rate;

    this.result = this.amount * rate;

    this.amount > 0 &&
      this.currencyService.add({
        amount: this.amount,
        source: this.currentCurrency,
        result: this.result,
        destination: this.reversedCurrentCurrency,
        wasFixedRate: this.hasFixedRate,
        rate
      });
  }

  resetCurrency(): void {
    this.rate = 1.1;

    this.calculateAmount();
  }

  reverseCurrency(): void {
    const current = this.currentCurrency;
    const wanted = this.reversedCurrentCurrency;
    const result = this.result;
    const amount = this.amount;

    this.currentCurrency = wanted;
    this.reversedCurrentCurrency = current;
    this.result = amount;
    this.amount = result;

    this.calculateAmount();
  }

  checkRateOverlap(): void {
    const increasedFixedRate = this.fixedRate * 1.02;

    if (this.rate > increasedFixedRate) {
      this.hasFixedRate = false;

      this.fixedRate = 0;
      this.fixedRate$.next(this.fixedRate);

      this.calculateAmount();
    }
  }

  ngOnInit(): void {
    interval(3000)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const number = this.generateRandomInteger(-0.05, 0.05);

        const sign = Math.sign(number);

        if (sign === -1) {
          this.rate -= number;
        } else {
          this.rate += number;
        }

        this.calculateAmount();

        this.hasFixedRate && this.checkRateOverlap();
      });

    this.amount$
      .pipe(debounceTime(500), untilDestroyed(this), distinctUntilChanged())
      .subscribe(() => {
        this.calculateAmount();
      });

    this.fixedRate$
      .pipe(untilDestroyed(this), distinctUntilChanged())
      .subscribe(() => {
        this.calculateAmount();
      });
  }
}
