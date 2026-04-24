import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargeFieldComponent } from '../charge-field/charge-field.component';

@Component({
  selector: 'app-additional-charges',
  standalone: true,
  imports: [CommonModule, ChargeFieldComponent],
  template: `
    <div class="charges-grid">
      @if (charges(); as c) {
        <div class="charge-card">
          <div class="card-header">
            <h3>Standard Setups</h3>
          </div>
          <div class="card-body">
            <app-charge-field label="Standard" [data]="c.standard" (onChange)="onChargeChange.emit({ key: 'standard', field: $event.field, value: $event.value })"></app-charge-field>
            <app-charge-field label="Rush" [data]="c.rush" (onChange)="onChargeChange.emit({ key: 'rush', field: $event.field, value: $event.value })"></app-charge-field>
          </div>
        </div>

        <div class="charge-card">
          <div class="card-header">
            <h3>Customizations</h3>
          </div>
          <div class="card-body">
            <app-charge-field label="Personalization" [data]="c.personalization" (onChange)="onChargeChange.emit({ key: 'personalization', field: $event.field, value: $event.value })"></app-charge-field>
            <app-charge-field label="Digitizing" [data]="c.digitizing" (onChange)="onChargeChange.emit({ key: 'digitizing', field: $event.field, value: $event.value })"></app-charge-field>
          </div>
        </div>

        <div class="charge-card full-width">
          <div class="card-header">
            <h3>Physical Requirements</h3>
          </div>
          <div class="card-body multi-row">
            @for (item of c.physical; track $index) {
              <app-charge-field [label]="item.name" [data]="item" (onChange)="onChargeChange.emit({ key: 'physical', index: $index, field: $event.field, value: $event.value })"></app-charge-field>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .charges-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-8);
    }
    .full-width { grid-column: span 2; }

    .charge-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .card-header {
      background: #f8fafc;
      padding: var(--space-4) var(--space-6);
      border-bottom: 1px solid var(--border-light);
    }
    .card-header h3 { font-size: 0.875rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

    .card-body { padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-6); }
    .card-body.multi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-8); }
  `]
})
export class AdditionalChargesComponent {
  charges = input.required<any>();
  onChargeChange = output<{ key: string, field: 'price' | 'percentage' | 'size_tier' | 'over' | 'every' | 'min' | 'max' | 'type', value: any, index?: number }>();
}
