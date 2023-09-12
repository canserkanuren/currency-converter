import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConverterHistoryComponent } from './components/converter-history/converter-history.component';
import { ConverterComponent } from './components/converter/converter.component';

@Component({
  selector: 'currency-converter-home',
  standalone: true,
  imports: [CommonModule, ConverterComponent, ConverterHistoryComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
