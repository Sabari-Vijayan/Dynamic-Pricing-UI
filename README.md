# Dynamic Pricing Management Portal

A professional, high-contrast Angular application designed for managing complex embroidery and product pricing matrices. This portal provides a streamlined interface for updating quantity tiers, unit prices, and global surcharges with real-time state management.

## 🚀 Key Features

- **Tabbed Navigation:** Seamlessly switch between Main Pricing, Product Inserts, FR Specifications, and Global Charges.
- **Interactive Tier Management:** Add or remove quantity breakpoints dynamically across all pricing tables.
- **Advanced Table UX:** 
  - Sticky row labels and headers for easy navigation in dense data sets.
  - Alternating column striping for improved readability.
  - Hover-activated status selectors for "Dropout", "Quote", and "N/A" values.
- **Interactive Onboarding:** A guided spotlight tour to help new users navigate the portal's core features.
- **Data Integrity Tools:** 
  - **Reset All:** Revert all local changes back to the original JSON source.
  - **Export JSON:** Download the updated configuration as a production-ready nested JSON file.
- **Responsive Layout:** Optimized for desktop workflows with a stable, high-contrast UI that eliminates layout shifts.

## 🛠 Tech Stack

- **Angular (Latest Stable):** Built using Standalone Components and the latest architectural patterns.
- **State Management:** Fully reactive state driven by **Angular Signals** (`signal`, `computed`, `effect`).
- **Styling:** Custom Vanilla CSS utilizing a standardized spacing scale and a high-contrast palette (#1e3a8a).
- **TypeScript:** Strict type-safety across models and services.

## 📁 Project Structure

- `src/app/components/`: Modular standalone components (Shell, TierTable, Onboarding, etc.).
- `src/app/services/`: Core state management and data fetching services.
- `src/app/models/`: TypeScript interfaces reflecting the hierarchical pricing schema.
- `src/assets/`: Source of truth `pricing.json` data.

## 🚦 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Angular CLI

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Open `http://localhost:4200` in your browser.

---
*This project was developed using **Gemini CLI** for architectural design, Angular Signals state management implementation, and comprehensive UI/UX refactoring.*
