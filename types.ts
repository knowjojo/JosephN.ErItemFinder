export type AttackPower = {
    name: string;
    amount: number;
  };
  
  export type Item = {
    id: string;
    name: string;
    image: string;
    description: string;
    type: string;
    passive: string;
    attackPower: AttackPower[];
  };
  
  export type RootStackParamList = {
    Search: undefined;
    Details: { item: Item };
  };