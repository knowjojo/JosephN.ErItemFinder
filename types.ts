export type AttackPower = {
    name: string;
    amount: number;
  };
  
  export type Item = {
    resistance: boolean;
    dmgNegation: boolean;
    cost: any;
    requires: any;
    effects: any;
    slots: any;
    id: string;
    name: string;
    image: string;
    description: string;
    category?: string;
    weight?: number;
    attack?: any;
    defence?: any;
    scalesWith?: any;
    requiredAttributes?: any;
    effect?: string;
    type?: string;
    fpCost?: number;
  };
  
  export type RootStackParamList = {
    Search: undefined;
    Details: { item: Item };
    Favorites: undefined;
  };