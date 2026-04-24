import { Component } from '@angular/core';
import { PricingShellComponent } from './components/pricing-shell/pricing-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PricingShellComponent],
  template: `
    <app-pricing-shell></app-pricing-shell>
  `,
  styles: []
})
export class AppComponent {}
