import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { YesNoPipe } from '../../../shared/pipes/yes-no/yes-no.pipe';
import { CurrencyHistory } from '../../core/models/currency-history.model';
import { CurrencyService } from '../../core/services/currency/currency.service';

@UntilDestroy()
@Component({
  selector: 'currency-converter-converter-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, YesNoPipe],
  templateUrl: './converter-history.component.html',
  styleUrls: ['./converter-history.component.scss']
})
export class ConverterHistoryComponent implements OnInit {
  currencyService: CurrencyService = inject(CurrencyService);

  columns: string[] = [
    'amount',
    'source',
    'result',
    'destination',
    'wasFixedRate'
  ];

  history: MatTableDataSource<CurrencyHistory> = new MatTableDataSource();

  ngOnInit(): void {
    this.currencyService.history
      .pipe(untilDestroyed(this))
      .subscribe(history => {
        this.history = new MatTableDataSource(history);
      });
  }
}
