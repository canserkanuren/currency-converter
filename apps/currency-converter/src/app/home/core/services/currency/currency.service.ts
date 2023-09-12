import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrencyHistory } from '../../models/currency-history.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private history$: BehaviorSubject<CurrencyHistory[]> = new BehaviorSubject<
    CurrencyHistory[]
  >([]);

  get history(): Observable<CurrencyHistory[]> {
    return this.history$.asObservable();
  }

  add(entry: CurrencyHistory): void {
    const currentHistory: CurrencyHistory[] = this.history$.getValue();

    currentHistory.push(entry);
    currentHistory.length > 5 && currentHistory.shift();

    this.history$.next(currentHistory);
  }
}
