import { Component, output, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TourStep {
  target: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tour-overlay" (click)="close.emit()">
      <div class="spotlight" [style.top.px]="spotlightTop()" [style.left.px]="spotlightLeft()" [style.width.px]="spotlightWidth()" [style.height.px]="spotlightHeight()"></div>
      
      <div class="tour-popup" [style.top.px]="popupTop()" [style.left.px]="popupLeft()" (click)="$event.stopPropagation()">
        <div class="popup-header">
          <span class="step-counter">Step {{ currentStep() + 1 }} of {{ steps.length }}</span>
          <button class="btn-close-x" (click)="close.emit()">×</button>
        </div>
        <h3>{{ steps[currentStep()].title }}</h3>
        <p>{{ steps[currentStep()].content }}</p>
        <div class="popup-footer">
          <button class="btn-skip" (click)="close.emit()">Skip Tour</button>
          <div class="nav-btns">
            @if (currentStep() > 0) {
              <button class="btn-prev" (click)="prevStep()">Back</button>
            }
            <button class="btn-next" (click)="nextStep()">
              {{ currentStep() === steps.length - 1 ? 'Finish' : 'Next' }}
            </button>
          </div>
        </div>
        <div class="popup-arrow" [class]="arrowPos()"></div>
      </div>
    </div>
  `,
  styles: [`
    .tour-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 2000;
      overflow: hidden;
    }
    .spotlight {
      position: absolute;
      box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75);
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2001;
      pointer-events: none;
    }
    .tour-popup {
      position: absolute;
      width: 320px;
      background: white;
      border-radius: 16px;
      padding: var(--space-6);
      z-index: 2002;
      box-shadow: var(--shadow-2xl);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    .step-counter { font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; }
    .btn-close-x { border: none; background: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; }
    
    .tour-popup h3 { margin-bottom: var(--space-2); color: var(--text-main); }
    .tour-popup p { font-size: 0.9375rem; color: var(--text-muted); line-height: 1.5; margin-bottom: var(--space-6); }

    .popup-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-skip { border: none; background: none; color: var(--text-muted); font-weight: 600; font-size: 0.8125rem; cursor: pointer; }
    .btn-skip:hover { color: var(--text-main); text-decoration: underline; }

    .nav-btns { display: flex; gap: var(--space-2); }
    .btn-next, .btn-prev {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.8125rem;
      cursor: pointer;
    }
    .btn-next { background: var(--primary); color: white; border: none; }
    .btn-prev { background: white; color: var(--text-main); border: 1px solid var(--border-main); }

    .popup-arrow {
      position: absolute;
      width: 16px;
      height: 16px;
      background: white;
      transform: rotate(45deg);
    }
    .popup-arrow.bottom { bottom: -8px; left: 50%; margin-left: -8px; }
    .popup-arrow.top { top: -8px; left: 50%; margin-left: -8px; }
  `]
})
export class OnboardingComponent implements AfterViewInit, OnDestroy {
  close = output<void>();
  
  steps: TourStep[] = [
    {
      target: '[data-tour="tabs"]',
      title: 'Switch Categories',
      content: 'Toggle between Main Pricing, Inserts, FR Specifications, and Global Surcharges.'
    },
    {
      target: '[data-tour="table"]',
      title: 'Direct Data Entry',
      content: 'Click any cell to edit prices or quantity tiers. Changes are saved instantly to the local state.'
    },
    {
      target: '[data-tour="add-tier"]',
      title: 'Expand Scaling',
      content: 'Need more quantity breakpoints? Add new tiers horizontally to the current pricing matrix.'
    },
    {
      target: '[data-tour="export"]',
      title: 'Finalize & Export',
      content: 'Download your updated configuration as a production-ready JSON file whenever you are ready.'
    }
  ];

  currentStep = signal(0);
  
  spotlightTop = signal(0);
  spotlightLeft = signal(0);
  spotlightWidth = signal(0);
  spotlightHeight = signal(0);

  popupTop = signal(0);
  popupLeft = signal(0);
  arrowPos = signal<'top' | 'bottom'>('top');

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit() {
    this.updateSpotlight();
    this.resizeObserver = new ResizeObserver(() => this.updateSpotlight());
    this.resizeObserver.observe(document.body);
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  nextStep() {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update(s => s + 1);
      this.updateSpotlight();
    } else {
      this.close.emit();
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
      this.updateSpotlight();
    }
  }

  updateSpotlight() {
    const step = this.steps[this.currentStep()];
    const el = document.querySelector(step.target);
    
    if (el) {
      const rect = el.getBoundingClientRect();
      const padding = 10;
      
      this.spotlightTop.set(rect.top - padding + window.scrollY);
      this.spotlightLeft.set(rect.left - padding + window.scrollX);
      this.spotlightWidth.set(rect.width + padding * 2);
      this.spotlightHeight.set(rect.height + padding * 2);

      const popupHeight = 200;
      const popupWidth = 320;
      
      let top = rect.bottom + padding + 20 + window.scrollY;
      let left = rect.left + (rect.width / 2) - (popupWidth / 2) + window.scrollX;
      let arrow: 'top' | 'bottom' = 'top';

      if (top + popupHeight > window.innerHeight + window.scrollY) {
        top = rect.top - padding - popupHeight - 20 + window.scrollY;
        arrow = 'bottom';
      }

      left = Math.max(20, Math.min(left, window.innerWidth - popupWidth - 20));

      this.popupTop.set(top);
      this.popupLeft.set(left);
      this.arrowPos.set(arrow);
    }
  }
}
