import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charge-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="field-card">
      <div class="field-header">
        <h4 class="field-label">{{ formattedLabel() }}</h4>
      </div>
      
      <div class="field-content">
        @if (type() === 'price') {
          <div class="input-stack">
            <label>Unit Price ($)</label>
            <input type="number" [value]="data().price" (input)="update('price', $event)" class="text-input">
          </div>
        } @else if (type() === 'percentage') {
          <div class="input-stack">
            <label>Percentage Rate (%)</label>
            <input type="number" [value]="data().percentage" (input)="update('percentage', $event)" class="text-input">
          </div>
        } @else if (type() === 'tier-price') {
          <div class="table-wrap">
            <table class="nested-table">
              <thead>
                <tr>
                  <th>Size Tier</th>
                  @for (tier of data().size_tier; track $index) {
                    <th>
                      <input type="number" [value]="tier" (input)="update('size_tier', $event, $index)" class="tiny-input">
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="row-tag">Price</td>
                  @for (price of data().price; track $index) {
                    <td>
                      <input type="number" [value]="price" (input)="update('price', $event, $index)" class="tiny-input">
                    </td>
                  }
                </tr>
              </tbody>
            </table>
          </div>
        } @else if (type() === 'size-percentage') {
          <div class="table-wrap">
            <table class="nested-table">
              <thead>
                <tr>
                  <th>Size Tier</th>
                  @for (tier of data().size_tier; track $index) {
                    <th>
                      <input type="number" [value]="tier" (input)="update('size_tier', $event, $index)" class="tiny-input">
                    </th>
                  }
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="row-tag">Rate (%)</td>
                  @for (pct of data().percentage; track $index) {
                    <td>
                      @if (isEditable(pct)) {
                        <input type="number" [value]="pct" (input)="update('percentage', $event, $index)" class="tiny-input">
                      } @else {
                        <span class="inline-badge">{{ pct }}</span>
                      }
                    </td>
                  }
                </tr>
              </tbody>
            </table>
          </div>
        } @else if (type() === 'stitch' || type() === 'color') {
          <div class="input-grid">
            <div class="input-stack">
              <label>Threshold (Over)</label>
              <input type="number" [value]="data().over" (input)="update('over', $event)" class="text-input">
            </div>
            @if (data().every !== undefined) {
              <div class="input-stack">
                <label>Frequency (Every)</label>
                <input type="number" [value]="data().every" (input)="update('every', $event)" class="text-input">
              </div>
            }
            <div class="input-stack">
              <label>Price Impact ($)</label>
              <input type="number" [value]="data().price" (input)="update('price', $event)" class="text-input">
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .field-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      padding: var(--space-6);
      transition: all 0.2s;
    }
    .field-card:hover {
      border-color: var(--border-main);
      box-shadow: var(--shadow-sm);
    }
    .field-header { margin-bottom: var(--space-4); }
    .field-label { 
      font-size: 0.8125rem; 
      font-weight: 800; 
      color: var(--primary); 
      text-transform: uppercase; 
      letter-spacing: 0.05em; 
    }
    
    .input-stack { display: flex; flex-direction: column; gap: var(--space-2); }
    .input-stack label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }
    
    .text-input {
      background: #f8fafc;
      border: 1px solid var(--border-light);
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 600;
      width: 100%;
      max-width: 240px;
      transition: all 0.2s;
    }
    .text-input:focus {
      background: white;
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }

    .input-grid { display: flex; gap: var(--space-6); flex-wrap: wrap; }

    .table-wrap {
      border: 1px solid var(--border-light);
      border-radius: 8px;
      overflow: hidden;
    }
    .nested-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8125rem;
    }
    .nested-table th, .nested-table td {
      border: 1px solid var(--border-light);
      padding: var(--space-2);
      text-align: center;
    }
    .nested-table th { background: #f1f5f9; color: var(--text-muted); font-weight: 700; }
    .row-tag { background: #f8fafc; font-weight: 700; color: var(--text-main); }
    
    .tiny-input {
      width: 100%;
      border: none;
      background: transparent;
      text-align: center;
      font-weight: 600;
      padding: 4px;
      outline: none;
    }
    .tiny-input:focus { background: var(--primary-light); }

    .inline-badge {
      font-size: 0.65rem;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      background: var(--primary-light);
      padding: 2px 6px;
      border-radius: 4px;
    }
  `]
})
export class ChargeFieldComponent {
  label = input.required<string>();
  data = input.required<any>();
  
  onChange = output<{ field: 'price' | 'percentage' | 'size_tier' | 'over' | 'every' | 'min' | 'max' | 'type'; value: any; index?: number }>();

  formattedLabel = computed(() => this.label().replace(/_/g, ' '));

  type = computed(() => {
    const d = this.data();
    if (!d) return 'unknown';
    if (this.label() === 'size' && d.size_tier) return 'size-percentage';
    if (d.price !== undefined && d.size_tier !== undefined) return 'tier-price';
    if (d.over !== undefined && d.every !== undefined) return 'stitch';
    if (d.over !== undefined && d.price !== undefined) return 'color';
    if (d.price !== undefined) return 'price';
    if (d.percentage !== undefined) return 'percentage';
    return 'unknown';
  });

  isEditable(val: any) { return typeof val === 'number'; }

  update(field: 'price' | 'percentage' | 'size_tier' | 'over' | 'every' | 'min' | 'max' | 'type', event: Event, index?: number) {
    const val = (event.target as HTMLInputElement).value;
    this.onChange.emit({ field, value: isNaN(+val) ? val : +val, index });
  }
}
