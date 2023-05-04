import { DefaultDeal, PricingRule, FlatDeal, TieredDeal } from './priceRules';
import { Item} from './item';

class CartItem {
    item: Item;
    rule: PricingRule ;
    constructor(item: Item, rule: PricingRule) {
        this.item = item;
        this.rule = rule;
    }
}

export class Checkout {
    private cart: Map<string, CartItem> = new Map();
    private pricingRules: Record<string, PricingRule>;
    private prices: number[] = [];

    constructor(pricingRules: Record<string, PricingRule>) {
        this.pricingRules = pricingRules;
        this.cart = new Map<string, CartItem>();
    }

    scan(sku: string) {
        const cartItem = this.cart.get(sku);
        if (!cartItem) {
            const newItem = new Item(sku);
            const newRule = this.pricingRules[sku] ? this.pricingRules[sku] : new PricingRule(new DefaultDeal());
            const newCartItem: CartItem | null = new CartItem(newItem, newRule);
            this.cart.set(sku, newCartItem);
        } else {
            cartItem.item.quantity += 1;
        }
    }

    total() :number {
        let totalPrice = 0.0;
        for (const [sku, cartItem] of this.cart.entries()) {
            let curItem = cartItem.item;
            let curRule = cartItem.rule;
            totalPrice += curRule.calculatDiscount(curItem.basePrice, curItem.quantity);
        }
        return totalPrice;
    }
}