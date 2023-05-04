type ItemMap = Map<string, { name: string; price: number; }>;
export class Item {
    static catalog: ItemMap = new Map([
        ['ipd', { name: 'Super Ipad', price: 549.99 }],
        ['mbp', { name: 'MacBook Pro', price: 1399.99 }],
        ['atv', { name: 'Apple TV', price: 109.50 }],
        ['vga', { name: 'VGA Adapater', price: 30.00 }],
    ]);

    sku: string;
    name: string;
    basePrice: number;
    quantity: number;

    constructor(sku: string) {
        const item= Item.catalog.get(sku);

        if (!item) {
            throw new Error(`Invalid SKU: ${sku}`);
        }

        this.sku = sku;
        this.name = item.name;
        this.basePrice = item.price;
        this.quantity = 1;
    }
}