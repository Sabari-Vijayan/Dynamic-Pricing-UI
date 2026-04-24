import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http':
import { RuiData, PricingData, PriceValue } from '../models/pricing.models';
import { map, tap } from 'rxjs';

pricingState = signal<Ruidata | null>(null);

@Injectable({
  provideIn: 'root'
})

export class PricingStateService {
  private http = inject(HttpClient);

  pricingState = signal<RuiData | null>(null);

  constructor() {
    this.loadPricingData();
  }

  loadPricingData() {
    this.http.get<PricingData>('assets/pricing.json').pipe(
      map(response => response.data.embroidered_specials.rui),
      tap(data => this.pricingState.set(data))
    ).subscribe({
        error: (err) => console.warn('assets/pricing.json not found, waiting for manual upload.')
      });
  }

}
