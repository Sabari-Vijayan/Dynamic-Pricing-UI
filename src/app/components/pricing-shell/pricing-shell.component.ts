import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingStateService } from '../../services/pricing-state.service';
import { TierTableComponent, TierRow } from '../tier-table/tier-table.component';
import { AdditionalChargesComponent } from '../additional-charges/additional-charges.component';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { PriceValue } from '../../models/pricing.models';

type TabId = 'default' | 'inserts' | 'fr' | 'charges';

interface Tab {
  id: TabId;
  label: string;
}

@Component({
  selector: 'app-pricing-shell',
  standalone: true,
  imports: [CommonModule, TierTableComponent, AdditionalChargesComponent, OnboardingComponent],
  template: `
    <div class="app-layout">
      <header class="main-header">
        <div class="header-container">
          <div class="brand-group">
            <h1 class="app-title">Pricing Management Portal</h1>
          </div>
          <div class="header-actions">
            <button class="btn-help" (click)="showTour.set(true)">Help Guide</button>
            <button class="btn-reset" (click)="confirmReset()" [disabled]="!state()">Reset All</button>
            <button class="btn-export" data-tour="export" (click)="service.downloadJSON()" [disabled]="!state()">
              Export JSON
            </button>
          </div>
        </div>
      </header>

      <div class="nav-bar-container">
        <div class="nav-bar-content">
          @if (state()) {
            <nav class="nav-tabs" data-tour="tabs">
              <div class="active-indicator" [style.transform]="'translateX(' + activeTabIndex() * 100 + '%)'"></div>
              @for (tab of tabs; track tab.id) {
                <button 
                  [class.active]="activeTab() === tab.id" 
                  (click)="activeTab.set(tab.id)"
                  class="tab-btn">
                  {{ tab.label }}
                </button>
              }
            </nav>
          }
        </div>
      </div>

      <main class="content-area">
        @if (state(); as rui) {
          <div class="panel-outer">
            <div class="panel-container">
              @switch (activeTab()) {
                @case ('default') {
                  <div class="tab-content-fade">
                    <div class="section-intro">
                      <div class="text">
                        <h2>Primary Pricing Tiers</h2>
                        <p>Configure the standard quantity breakpoints and base unit prices for the embroidery catalog.</p>
                      </div>
                      <button class="btn-primary-outline" data-tour="add-tier" (click)="service.addColumn('fancy')">+ Add New Tier</button>
                    </div>
                    <app-tier-table 
                      data-tour="table"
                      [itemTier]="rui.fancy.item_tier" 
                      [rows]="fancyRows()" 
                      [discount]="rui.fancy.discount || 0"
                      [showDiscount]="true"
                      (onPriceChange)="service.updateFlatPrice('fancy', $event.colIndex, $event.value)"
                      (onTierChange)="service.updateFlatTier('fancy', $event.colIndex, $event.value)"
                      (onRemoveColumn)="service.removeColumn('fancy', $event)"
                      (onDiscountChange)="service.updateDiscount('fancy', $event)"
                    ></app-tier-table>
                  </div>
                }
                @case ('inserts') {
                  <div class="tab-content-fade">
                    <div class="section-intro">
                      <div class="text">
                        <h2>Insert Specifications</h2>
                        <p>Manage pricing tiers specifically designated for high-density product inserts.</p>
                      </div>
                      <button class="btn-primary-outline" data-tour="add-tier" (click)="service.addColumn('fancy_inserts')">+ Add New Tier</button>
                    </div>
                    <app-tier-table 
                      data-tour="table"
                      [itemTier]="rui.fancy_inserts.item_tier" 
                      [rows]="insertRows()" 
                      (onPriceChange)="service.updateFlatPrice('fancy_inserts', $event.colIndex, $event.value)"
                      (onTierChange)="service.updateFlatTier('fancy_inserts', $event.colIndex, $event.value)"
                      (onRemoveColumn)="service.removeColumn('fancy_inserts', $event)"
                    ></app-tier-table>
                  </div>
                }
                @case ('fr') {
                  <div class="tab-content-fade">
                    <div class="section-intro">
                      <div class="text">
                        <h2>Flame Resistant Matrices</h2>
                        <p>Detailed pricing based on the intersection of item quantity and physical size dimensions.</p>
                      </div>
                      <button class="btn-primary-outline" data-tour="add-tier" (click)="service.addColumn('fr')">+ Add New Tier</button>
                    </div>
                    <app-tier-table 
                      data-tour="table"
                      [itemTier]="rui.fr.item_tier" 
                      [rows]="frRows()" 
                      [discount]="rui.fr.discount || 0"
                      [showDiscount]="true"
                      (onPriceChange)="service.updateSizePrice($event.rowIndex, $event.colIndex, $event.value)"
                      (onTierChange)="service.updateSizeTier($event.colIndex, $event.value)"
                      (onRemoveColumn)="service.removeColumn('fr', $event)"
                      (onDiscountChange)="service.updateDiscount('fr', $event)"
                    ></app-tier-table>
                  </div>
                }
                @case ('charges') {
                  <div class="tab-content-fade">
                    <div class="section-intro">
                      <div class="text">
                        <h2>Global Surcharges</h2>
                        <p>Fixed and percentage-based additional charges applicable across all product categories.</p>
                      </div>
                    </div>
                    <app-additional-charges 
                      data-tour="table"
                      [charges]="rui.additional_charge"
                      (onChargeChange)="service.updateAdditionalCharge($event.key, $event.field, $event.value, $event.index)"
                    ></app-additional-charges>
                  </div>
                }
              }
            </div>
          </div>

        } @else {
          <div class="skeleton-loader">
            <div class="loader-circle"></div>
            <p>Initializing Secure Data Connection...</p>
          </div>
        }
      </main>

      @if (showTour()) {
        <app-onboarding (close)="showTour.set(false)"></app-onboarding>
      }
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .main-header {
      background: white;
      padding: var(--space-6) var(--space-8) var(--space-2) var(--space-8);
      position: relative;
      z-index: 110;
    }
    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .app-title {
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--text-main);
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
    .header-actions {
      display: flex;
      gap: var(--space-3);
    }

    .nav-bar-container {
      background: white;
      border-bottom: 1px solid var(--border-main);
      padding: var(--space-2) var(--space-8) var(--space-6) var(--space-8);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }
    .nav-bar-content {
      max-width: 1280px;
      margin: 0 auto;
      height: 48px;
      display: flex;
      align-items: center;
    }

    .btn-help, .btn-export, .btn-reset, .btn-primary-outline {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.8125rem;
      transition: all 0.2s;
    }
    .btn-help {
      background: white;
      color: var(--text-muted);
      border: 1px solid var(--border-main);
    }
    .btn-help:hover { background: var(--bg-main); color: var(--text-main); }
    
    .btn-reset {
      background: white;
      color: var(--danger);
      border: 1px solid var(--danger);
    }
    .btn-reset:hover:not(:disabled) { background: #fef2f2; }
    .btn-reset:disabled { opacity: 0.5; }

    .btn-export { background: var(--primary); color: white; border: none; }
    .btn-export:hover:not(:disabled) { background: #172554; transform: translateY(-1px); }
    .btn-export:disabled { opacity: 0.5; }

    .btn-primary-outline {
      background: white;
      color: var(--primary);
      border: 2px solid var(--primary);
    }
    .btn-primary-outline:hover { background: var(--primary-light); }

    .content-area {
      flex: 1;
      max-width: 1280px;
      margin: 0 auto;
      width: 100%;
      padding: var(--space-8);
      min-height: 70vh;
    }

    .nav-tabs {
      display: flex;
      background: #e2e8f0;
      padding: 4px;
      border-radius: 12px;
      width: fit-content;
      position: relative;
      overflow: hidden;
    }
    .tab-btn {
      padding: 0.6rem 1.5rem;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-weight: 700;
      font-size: 0.875rem;
      border-radius: 8px;
      transition: color 0.3s;
      position: relative;
      z-index: 2;
      width: 160px;
      text-align: center;
    }
    .tab-btn.active { color: var(--primary); }
    .active-indicator {
      position: absolute;
      top: 4px;
      left: 4px;
      height: calc(100% - 8px);
      width: 160px;
      background: white;
      border-radius: 8px;
      box-shadow: var(--shadow-md);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }

    .panel-outer {
      min-height: 600px;
    }
    .panel-container {
      background: white;
      border-radius: 16px;
      padding: var(--space-8);
      border: 1px solid var(--border-main);
      box-shadow: var(--shadow-lg);
    }

    .tab-content-fade {
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .section-intro {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid var(--border-light);
    }
    .section-intro h2 { font-size: 1.5rem; margin-bottom: var(--space-1); }
    .section-intro p { color: var(--text-muted); font-size: 0.9375rem; max-width: 600px; }

    .skeleton-loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      color: var(--text-muted);
    }
    .loader-circle {
      width: 48px;
      height: 48px;
      border: 4px solid var(--primary-light);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--space-4);
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PricingShellComponent implements OnInit {
  service = inject(PricingStateService);
  state = this.service.pricingState;
  activeTab = signal<TabId>('default');
  showTour = signal(false);

  tabs: Tab[] = [
    { id: 'default', label: 'Main Pricing' },
    { id: 'inserts', label: 'Product Inserts' },
    { id: 'fr', label: 'FR Specifications' },
    { id: 'charges', label: 'Global Charges' }
  ];

  activeTabIndex = computed(() => {
    return this.tabs.findIndex(t => t.id === this.activeTab());
  });

  ngOnInit() {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      this.showTour.set(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }

  confirmReset() {
    if (confirm('Are you sure you want to revert all changes to their original values? This action cannot be undone.')) {
      this.service.resetData();
    }
  }

  fancyRows = computed(() => {
    const s = this.state();
    if (!s) return [];
    return [{ label: 'Unit Price', prices: s.fancy.price }] as TierRow[];
  });

  insertRows = computed(() => {
    const s = this.state();
    if (!s) return [];
    return [{ label: 'Unit Price', prices: s.fancy_inserts.price }] as TierRow[];
  });

  frRows = computed(() => {
    const s = this.state();
    if (!s) return [];
    return s.fr.size_tier.map(st => ({
      label: st.size.toFixed(1) + '" Pattern',
      prices: st.price
    })) as TierRow[];
  });
}
