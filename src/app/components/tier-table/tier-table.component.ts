import { Component, input, output, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PriceValue } from '../../models/pricing.models';

export interface TierRow {
  label: string;
  prices: PriceValue[];
}

@Component({
  selector: 'app-tier-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      <div class="table-scroll-wrapper">
        <table class="pricing-table">
          <thead>
            <tr>
              <th class="sticky-col">Quantity (Min)</th>
              @for (tier of itemTier(); track $index) {
                <th class="tier-header">
                  <div class="header-content">
                    <input 
                      type="number" 
                      [ngModel]="tier" 
                      (ngModelChange)="onTierChange.emit({ colIndex: $index, value: $event })"
                    >
                    <button class="btn-remove" (click)="onRemoveColumn.emit($index)">Remove</button>
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows(); track row.label; let rowIndex = $index) {
              <tr>
                <td class="sticky-col row-label">{{ row.label }}</td>
                @for (price of row.prices; track $index) {
                  <td class="price-cell">
                    <div class="input-wrapper">
                      @if (isSpecial(price)) {
                        <span class="status-badge" [class]="price">{{ price }}</span>
                      } @else {
                        <span class="currency">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          [ngModel]="price" 
                          (ngModelChange)="onPriceChange.emit({ rowIndex, colIndex: $index, value: $event })"
                        >
                      }
                      
                      <div class="status-dropdown">
                        <button (click)="onPriceChange.emit({ rowIndex, colIndex: $index, value: 0 })">Price</button>
                        <button (click)="onPriceChange.emit({ rowIndex, colIndex: $index, value: 'n/a' })">N/A</button>
                        <button (click)="onPriceChange.emit({ rowIndex, colIndex: $index, value: 'dropout' })">Dropout</button>
                        <button (click)="onPriceChange.emit({ rowIndex, colIndex: $index, value: 'quote' })">Quote</button>
                      </div>
                    </div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (showDiscount()) {
        <div class="discount-section">
          <label>Global Section Discount (%)</label>
          <div class="discount-input">
            <input 
              type="number" 
              [ngModel]="discount()" 
              (ngModelChange)="onDiscountChange.emit($event)"
            >
            <span class="percent">%</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid var(--border-main);
    }
    .table-scroll-wrapper {
      overflow-x: auto;
      background: white;
    }
    .pricing-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      table-layout: fixed;
    }
    
    th, td {
      padding: var(--space-4);
      border-bottom: 1px solid var(--border-light);
      border-right: 1px solid var(--border-light);
      text-align: left;
      width: 140px;
      min-width: 140px;
    }

    .sticky-col {
      position: sticky;
      left: 0;
      background: #f8fafc;
      z-index: 10;
      font-weight: 700;
      width: 180px;
      min-width: 180px;
      border-right: 2px solid var(--border-main);
    }

    .tier-header {
      background: #f1f5f9;
    }
    .header-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .header-content input {
      width: 100%;
      background: transparent;
      border: 1px solid transparent;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--primary);
    }
    .header-content input:hover, .header-content input:focus {
      border-color: var(--border-main);
      background: white;
    }

    .btn-remove {
      font-size: 0.7rem;
      color: var(--danger);
      background: none;
      border: none;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0;
      width: fit-content;
      opacity: 0.6;
    }
    .btn-remove:hover { opacity: 1; text-decoration: underline; }

    .pricing-table th:nth-child(even), 
    .pricing-table td:nth-child(even) {
      background-color: #fcfdfe;
    }

    .row-label {
      font-size: 0.875rem;
      color: var(--text-main);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .input-wrapper input {
      width: 100%;
      border: none;
      background: transparent;
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--text-main);
      padding: 4px;
    }
    .input-wrapper input:focus {
      outline: 2px solid var(--primary-light);
      background: white;
      border-radius: 4px;
    }
    .currency { color: var(--text-muted); font-weight: 500; font-size: 0.875rem; }

    .status-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid var(--border-main);
      box-shadow: var(--shadow-lg);
      border-radius: 8px;
      display: none;
      flex-direction: column;
      z-index: 20;
      width: 100px;
      padding: 4px;
    }
    .input-wrapper:hover .status-dropdown { display: flex; }
    .status-dropdown button {
      padding: 6px 12px;
      border: none;
      background: none;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
    }
    .status-dropdown button:hover { background: var(--bg-main); color: var(--primary); }

    .status-badge {
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      width: 100%;
      text-align: center;
    }
    .status-badge.n\\/a { background: #f1f5f9; color: #64748b; }
    .status-badge.dropout { background: #fef2f2; color: #ef4444; }
    .status-badge.quote { background: #fffbeb; color: #d97706; }

    .discount-section {
      padding: var(--space-6);
      background: #f8fafc;
      border-top: 1px solid var(--border-main);
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }
    .discount-section label { font-weight: 700; color: var(--text-muted); font-size: 0.8125rem; text-transform: uppercase; }
    .discount-input { position: relative; width: 100px; }
    .discount-input input {
      width: 100%;
      padding: 0.5rem 1.5rem 0.5rem 0.75rem;
      border: 1px solid var(--border-main);
      border-radius: 6px;
      font-weight: 700;
    }
    .percent { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
  `]
})
export class TierTableComponent {
  itemTier = input.required<number[]>();
  rows = input.required<TierRow[]>();
  discount = input<number>(0);
  showDiscount = input<boolean>(false);

  onPriceChange = output<{ rowIndex: number, colIndex: number, value: PriceValue }>();
  onTierChange = output<{ colIndex: number, value: number }>();
  onRemoveColumn = output<number>();
  onDiscountChange = output<number>();

  isSpecial(val: PriceValue): boolean {
    return typeof val === 'string';
  }
}
