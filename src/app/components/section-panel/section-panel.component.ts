import { Component, input, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-card" [class.is-open]="isOpen()">
      <div class="section-header" (click)="toggle()">
        <div class="header-left">
          <span class="toggle-arrow" [class.rotated]="isOpen()">›</span>
          <h2 class="title">{{ title() }}</h2>
        </div>
        <div class="actions">
          @if (showAddColumn()) {
            <button class="add-col-btn" (click)="$event.stopPropagation(); onAddColumn.emit()">
              + Add Tier
            </button>
          }
        </div>
      </div>
      
      @if (isOpen()) {
        <div class="section-content">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .section-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }
    .section-card:hover {
      border-color: #cbd5e1;
    }
    .section-card.is-open {
      box-shadow: var(--shadow);
    }
    .section-header {
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      background: white;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .toggle-arrow {
      font-size: 1.5rem;
      color: var(--text-muted);
      transition: transform 0.2s;
      line-height: 1;
      margin-top: -2px;
    }
    .toggle-arrow.rotated {
      transform: rotate(90deg);
    }
    .title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-main);
      margin: 0;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .add-col-btn {
      background-color: var(--primary-light);
      color: var(--primary);
      border: 1px solid transparent;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .add-col-btn:hover {
      background-color: #e0e7ff;
      border-color: #c7d2fe;
    }
    .section-content {
      padding: 1.25rem;
      border-top: 1px solid var(--border-color);
      background-color: #ffffff;
    }
  `]
})
export class SectionPanelComponent {
  title = input.required<string>();
  expanded = input<boolean>(false);
  showAddColumn = input<boolean>(false);
  
  onAddColumn = output<void>();
  
  isOpen = signal(false);

  ngOnInit() {
    this.isOpen.set(this.expanded());
  }

  toggle() {
    this.isOpen.update(v => !v);
  }
}
