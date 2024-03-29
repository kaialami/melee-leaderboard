const k = 32;
const c = 400;
const lowest = 1000;

/**
 * Returns the new rating of players A and B and change in elo with respect to player A.
 * 
 * Elo changes by half for losers bracket sets.
 * 
 * Weight increases elo changes by a factor of the weight. 
 * Higher-stakes tournaments (e.g. air series) should use higher weights (2 seems good).
 * 
 * https://stanislav-stankovic.medium.com/elo-rating-system-6196cc59941e 
 * 
 * @param {*} ra Rating of player A
 * @param {*} rb Rating of player B
 * @param {*} outcome 1 if A won, 0 if A lost
 * @param {*} bracket 1 if winners bracket, 2 if losers
 * @param {*} weight factor to multiply change by
 */
export function calculate(ra, rb, outcome, bracket, weight) {
    let expected = (10 ** (ra / c)) / (10 ** (ra / c) + 10 ** (rb / c));
    let change = Math.round(k * weight * (outcome - expected) / bracket);
    let newRa = Math.max(ra + change, lowest);
    let newRb = Math.max(rb - change, lowest);
    
    return { newRa, newRb , change};
}

// let result = calculate(1100, 1200, 1, 2);
// console.log(result);
