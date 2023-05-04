type ItemMap = Map<string, {name: string, price: number}>;

class Item {
  static catalog: ItemMap = new Map([
    ['ipd', {name: 'Super Ipad', price: 549.99}],
    ['mbp', { name: 'MacBook Pro', price: 1399.99}],
    ['atv', { name: 'Apple TV', price: 109.50}],
    ['vga', { name: 'VGA Adapater', price: 30.00}],
  ]);
  
  sku: string;
  name: string;
  basePrice: number;
  calculatedPrice: number;

  constructor(sku: string) {
    const item = Item.catalog.get(sku);

    if (!item) {
      throw new Error(`Invalid SKU: ${sku}`);
    }

    this.sku = sku;
    this.name = item.name;
    this.basePrice = item.price;
  }
}

interface cartItem {
  item: Item,
  quantity: number,
}

interface IPricingRule {
  sku: string;
  dealType: 'flat' | 'x-for-y';
  threshold?: number | null;
  alternatePrice?: number | null;
  x?: number | null;
  y?: number | null;
}
class PricingRule implements IPricingRule {
  sku: string;
  dealType: 'flat' | 'x-for-y';
  threshold?: number | null;
  altPrice?: number | null;
  x?: number | null;
  y?: number | null;

  constructor(
    sku: string, 
    dealType: 'flat' | 'x-for-y', 
    threshold: number | null = null, 
    altPrice: number | null = null,
    x: number | null = null,
    y: number | null = null
  ) {
    this.sku = sku;
    this.dealType = dealType;
    if (this.dealType === 'flat') {
      this.threshold = threshold;
      this.altPrice = altPrice;
    }
    else if (this.dealType === 'x-for-y') {
      this.x = x;
      this.y = y;
    }
  }
}

class Checkout {
  private cart: Map<string, cartItem> = new Map();
  private pricingRules: Map<string, PricingRule> = new Map();

  constructor(pricingRules: Map<string, PricingRule>) {
    this.pricingRules = pricingRules;
  }

  scan(sku: string, quantity: number = 1): void {
    const item = new Item(sku); 
    if (!item) {
      throw new Error(`Unknown product: ${sku}`);
    } else {
      const currentQuantity = this.cart.get(sku)?.quantity || 0;
      const newQuantity = currentQuantity + quantity;
      this.cart.set(sku, {item: item, quantity: newQuantity});
    }
  }
  private getDiscountedPrice(item: Item, quantity: number): number {
    const rule = this.pricingRules.get(item.sku);
    if (rule) {
      if(rule.dealType === 'flat') {
        if (quantity >= rule.threshold!) {
          return rule.altPrice! * quantity;
        }
      } else if (rule.dealType === 'x-for-y') {
        if (quantity >= rule.y!) {
          const x = rule.x!;
          const y = rule.y!;
          const discount = (x - y) * Math.floor(quantity / x) * item.basePrice;
          const price = item.basePrice * quantity;
          return price - discount;
        }
      }
    }
    return item.basePrice * quantity;
  }

  total(){
    let totalPrice = 0.0;
    for ( let entry of this.cart.values()) {
      totalPrice += this.getDiscountedPrice(entry.item, entry.quantity);
    }
    return totalPrice;
  }

}

function runCases(): void {
  const case1 = ['atv', 'atv', 'atv', 'vga'];
  const case2 = ['atv', 'ipd', 'ipd', 'atv', 'ipd', 'ipd', 'ipd'];
  const res1 = 249.00
  const res2 = 2718.95;

  const pricingRules = new Map<string, PricingRule>();

  const co1 = new Checkout(pricingRules);
  for(let s1 of case1) {
    co1.scan(s1);
  }
  console.log(co1.total());

}
