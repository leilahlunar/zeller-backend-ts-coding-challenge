type FlatParams = {
    thresholdQuantity: number,
    discountPrice: number,
};

type TieredParams = {
    factorOfDeal: number;
    thresholdQuantity: number;
}

interface Deal {
    type: 'flat' | 'tiered' | 'default';
    dealParameters: FlatParams | TieredParams | null;
    calculateItemPrice(itemPrice: number, itemQuantity: number): number;
}

export class FlatDeal implements Deal {
    type: 'flat';
    dealParameters: {
        thresholdQuantity: number;
        discountPrice: number;
    };
    constructor(params: FlatParams) {
        this.type = 'flat';
        this.dealParameters = {...params};
    }
    calculateItemPrice(itemPrice: number, itemQuantity: number): number {
        if(this.dealParameters.thresholdQuantity <= itemQuantity) {
            return itemQuantity * this.dealParameters.discountPrice;
        }
        return itemPrice * itemQuantity;
    }

}

export class TieredDeal implements Deal {
    type: 'tiered';
    dealParameters: TieredParams;
    constructor(params: TieredParams) {
        this.type = "tiered";
        this.dealParameters = {...params};
        if (this.dealParameters.factorOfDeal >= this.dealParameters.thresholdQuantity) {
            throw new Error(`Invalid Deal: ${this.type}`)
        }
    }
    calculateItemPrice(itemPrice: number, itemQuantity: number): number {
        let totalPrice = 0.0;
        const thresholdQuantity = this.dealParameters.thresholdQuantity;
        const factor = this.dealParameters.factorOfDeal;
        if(itemQuantity >= thresholdQuantity) {
            const discountQty = Math.floor(itemQuantity / thresholdQuantity); //num discounted sets of items
            const nonDiscountQty = itemQuantity % thresholdQuantity; // num non-discounted items
            const discountedPrice = (itemPrice * (thresholdQuantity - 1)) / thresholdQuantity; // Price after discount per unit
            const discPerUnit = itemPrice - discountedPrice; // Total discount per unit
            const netDiscountedPrice = discountedPrice * thresholdQuantity; //Total Price after discount for each set of items
            const netNonDiscountedPrice = nonDiscountQty * thresholdQuantity; // total price of non-discounted items
            const totalDiscountAmount = discPerUnit * Math.min(discountQty, nonDiscountQty); // total discount amount
            totalPrice = (discountQty * netDiscountedPrice) + netNonDiscountedPrice - totalDiscountAmount;
        } else {
            totalPrice = itemPrice * itemQuantity;
        }
        return totalPrice;
    }
}

export class DefaultDeal implements Deal {
    type: 'default';
    dealParameters: null;
    constructor() {
        this.type = 'default';
        this.dealParameters = null;
    }
    calculateItemPrice(itemPrice: number, itemQuantity: number): number {
        return itemPrice * itemQuantity;
    }
}

export class PricingRule {
    deal: FlatDeal | TieredDeal | DefaultDeal;

    constructor(deal: FlatDeal | TieredDeal | DefaultDeal) {
        this.deal = deal;
    }
    calculatDiscount(itemPrice: number, quantity: number): number {
        return this.deal.calculateItemPrice(itemPrice, quantity);
    }
}