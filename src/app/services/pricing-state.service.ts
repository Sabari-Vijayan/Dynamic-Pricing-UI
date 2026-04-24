import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RuiData, PricingData, PriceValue } from '../models/pricing.models';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingStateService {
  private http = inject(HttpClient);
  
  pricingState = signal<RuiData | null>(null);
  
  private originalData: RuiData | null = null;

  constructor() {
    this.loadPricingData();
  }

  loadPricingData() {
    this.http.get<PricingData>('assets/pricing.json').pipe(
      map(response => response.data.embroidered_specials.rui),
      tap(data => {
        this.originalData = structuredClone(data);
        this.pricingState.set(data);
      })
    ).subscribe({
      error: (err) => console.error('Error loading assets/pricing.json', err)
    });
  }

  resetData() {
    if (this.originalData) {
      this.pricingState.set(structuredClone(this.originalData));
    }
  }

  updateFlatPrice(section: keyof Pick<RuiData, 'fancy' | 'reflective' | 'fancy_inserts'>, colIndex: number, value: PriceValue) {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      updated[section].price[colIndex] = value;
      return updated;
    });
  }

  updateFlatTier(section: keyof Pick<RuiData, 'fancy' | 'reflective' | 'fancy_inserts'>, colIndex: number, value: number) {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      updated[section].item_tier[colIndex] = value;
      return updated;
    });
  }

  updateSizePrice(rowIndex: number, colIndex: number, value: PriceValue) {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      updated.fr.size_tier[rowIndex].price[colIndex] = value;
      return updated;
    });
  }

  updateSizeTier(colIndex: number, value: number) {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      updated.fr.item_tier[colIndex] = value;
      return updated;
    });
  }

  updateAdditionalCharge(key: string, field: 'price' | 'percentage' | 'size_tier' | 'over' | 'every' | 'min' | 'max' | 'type', value: any, index?: number) {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      const charge = updated.additional_charge[key as keyof typeof updated.additional_charge];
      
      if (Array.isArray(charge)) {
        if (index !== undefined) {
          (charge[index] as any)[field] = value;
        }
      } else {
        (charge as any)[field] = value;
      }
      return updated;
    });
  }

  updateDiscount(section: 'fancy' | 'fr', value: number) {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      updated[section].discount = value;
      return updated;
    });
  }

  addColumn(section: 'fancy' | 'fancy_inserts' | 'fr') {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      
      updated[section].item_tier.push((updated[section].item_tier.at(-1) || 0) + 1);
      
      if (section === 'fr') {
        updated.fr.size_tier.forEach(st => st.price.push(0));
      } else {
        (updated[section] as any).price.push(0);
      }
      
      return updated;
    });
  }

  removeColumn(section: 'fancy' | 'fancy_inserts' | 'fr', index: number) {
    this.pricingState.update(state => {
      if (!state) return state;
      const updated = structuredClone(state);
      
      updated[section].item_tier.splice(index, 1);
      
      if (section === 'fr') {
        updated.fr.size_tier.forEach(st => st.price.splice(index, 1));
      } else {
        (updated[section] as any).price.splice(index, 1);
      }
      
      return updated;
    });
  }

  downloadJSON() {
    const s = this.pricingState();
    if (!s) return;

    const fullExport = {
      data: {
        embroidered_specials: {
          rui: s
        }
      }
    };

    const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pricing_export.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
