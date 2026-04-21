export type PriceValue = number | 'n/a' | 'dropout' | 'quote';

export interface PricingData {
  data: {
    embroidered_specials: {
      rui: RuiData;
    };
  };
}

export interface RuiData {
  fr: SizeTieredPricing;
  fancy: FlatPricing;
  reflective: FlatPricing;
  fancy_inserts: FlatPricing;
  additional_charge: AdditionalCharge;
}

export interface FlatPricing {
  price: PriceValue[];
  discount?: number;
  item_tier: number[];
}

export interface SizeTier {
  size: number;
  price: PriceValue[];
}


export interface SizeTieredPricing {
  discount: number;
  item_tier: number[];
  size_tier: SizeTier[];
  additional_charge: AdditionalCharge;
}


