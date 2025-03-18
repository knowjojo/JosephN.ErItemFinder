export type AttackPower = {
    name: string;
    amount: number;
  };
  
  export type Item = {
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
  };
  
  export type RootStackParamList = {
    Search: undefined;
    Details: { item: Item };
    Favorites: undefined;
  };