export type MembershipFn = (x: number) => number;
export type FuzzyVariables = Record<string, Record<string, MembershipFn>>;
export type FuzzyRule<Out extends string> = { when: Record<string, string>; then: Out };
export type Degrees = Record<string, Record<string, number>>;

/** 0 below a, rising to 1 at b, flat to c, falling to 0 at d. Use a = b or c = d for a shoulder. */
export const trapezoid =
  (a: number, b: number, c: number, d: number): MembershipFn =>
  (x) => {
    if (x < a || x > d) return 0;
    if (x >= b && x <= c) return 1;
    return x < b ? (x - a) / (b - a) : (d - x) / (d - c);
  };

export const triangle = (a: number, b: number, c: number): MembershipFn => trapezoid(a, b, b, c);

/** How strongly each input belongs to each term of its variable (0 to 1). */
export function fuzzify(variables: FuzzyVariables, inputs: Record<string, number>): Degrees {
  const degrees: Degrees = {};
  for (const [name, terms] of Object.entries(variables)) {
    degrees[name] = {};
    for (const [term, membership] of Object.entries(terms)) degrees[name][term] = membership(inputs[name]);
  }
  return degrees;
}

/** AND = min within a rule, OR = max across rules that share an outcome. */
export function infer<Out extends string>(rules: FuzzyRule<Out>[], degrees: Degrees): Partial<Record<Out, number>> {
  const strengths: Partial<Record<Out, number>> = {};
  for (const rule of rules) {
    const strength = Math.min(...Object.entries(rule.when).map(([variable, term]) => degrees[variable][term]));
    strengths[rule.then] = Math.max(strengths[rule.then] ?? 0, strength);
  }
  return strengths;
}

/** Weighted average of the outcome centers. */
export function defuzzify<Out extends string>(strengths: Partial<Record<Out, number>>, centers: Record<Out, number>): number {
  let weighted = 0;
  let total = 0;
  for (const term of Object.keys(centers) as Out[]) {
    const strength = strengths[term] ?? 0;
    weighted += strength * centers[term];
    total += strength;
  }
  return total > 0 ? weighted / total : 0;
}