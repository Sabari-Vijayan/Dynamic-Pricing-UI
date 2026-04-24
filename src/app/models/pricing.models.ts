export type PriceValue = number | 'n/a' | 'dropout' | 'quote';

export interface FlatTierSection {
  price: PriceValue[];
  item_tier: number[];
  discount?: number;
}

export interface SizeTierEntry {
  size: number;
  price: PriceValue[];
}

export interface SizeTierSection {
  item_tier: number[];
  size_tier: SizeTierEntry[];
  discount?: number;
}

export interface FixedCharge {
  price: number;
}

export interface PercentageCharge {
  percentage: number;
}

export interface TieredPriceCharge {
  size_tier: number[];
  price: number[];
}

export interface TieredPercentageCharge {
  size_tier: number[];
  percentage: (number | string)[];
}

export interface ExtraCharge {
  over: number;
  every?: number;
  price: number;
}

export interface PhysicalCharge {
  name: string;
  price: number;
  type: string;
  min: number;
  max: number;
}

export interface AdditionalCharge {
  standard: FixedCharge;
  rush: PercentageCharge;
  personalization: TieredPriceCharge;
  digitizing: TieredPercentageCharge;
  stitch: ExtraCharge;
  color: ExtraCharge;
  physical: PhysicalCharge[];
}

export interface RuiData {
  fancy: FlatTierSection;
  reflective: FlatTierSection;
  fancy_inserts: FlatTierSection;
  fr: SizeTierSection;
  additional_charge: AdditionalCharge;
}

export interface PricingData {
  data: {
    embroidered_specials: {
      rui: RuiData;
    };
  };
}
