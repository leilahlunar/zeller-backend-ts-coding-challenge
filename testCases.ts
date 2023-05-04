import { Checkout } from "./checkout";
import { DefaultDeal, FlatDeal, PricingRule, TieredDeal } from "./priceRules";

export function testCases(): void {
  const case1 = ["atv", "atv", "atv", "vga"];
  const case2 = ["atv", "ipd", "ipd", "atv", "ipd", "ipd", "ipd"];
  const case3 = ["mbp", "mbp", "mbp", "mbp", "mbp"];
  const res1 = 249.0;
  const res2 = 2718.95;
  const res3 = 4 * 1399.99;

  const flatRule = new FlatDeal({
    thresholdQuantity: 4,
    discountPrice: 499.99,
  });
  const tieredRule = new TieredDeal({
    thresholdQuantity: 3,
    factorOfDeal: 2,
  });
  const defaultRule = new DefaultDeal();
  const tieredRule2 = new TieredDeal({
    thresholdQuantity: 5,
    factorOfDeal: 4,
  });
  const pricingRules: Record<string, PricingRule> = {
    atv: new PricingRule(tieredRule),
    ipd: new PricingRule(flatRule),
    vga: new PricingRule(defaultRule),
    mbd: new PricingRule(defaultRule),
  };

  const co1 = new Checkout(pricingRules);
  for (let s1 of case1) {
    co1.scan(s1);
  }
  console.log(co1.total() === res1 ? "case1 success" : "case1 fail");

  const co2 = new Checkout(pricingRules);
  for (let s2 of case2) {
    co2.scan(s2);
  }
  console.log(co2.total() === res2 ? "case2 success" : "case2 fail");

  const pricingRules2: Record<string, PricingRule> = {
    mbp: new PricingRule(tieredRule2),
    atv: new PricingRule(defaultRule),
    ipd: new PricingRule(defaultRule),
    vga: new PricingRule(defaultRule),
  };
  const co3 = new Checkout(pricingRules2);
  for (let s3 of case3) {
    co3.scan(s3);
  }
  console.log(co3.total() === res3 ? "case3 success" : "case3 fail");
}
