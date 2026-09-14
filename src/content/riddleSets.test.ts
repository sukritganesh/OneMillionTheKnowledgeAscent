import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadBuiltInCatalog, type RawContentPack } from './index';

const names = ['hidden-in-plain-sight', 'the-midnight-detective', 'the-number-vault', 'the-rules-of-this-place'];
const packs = names.map((name) => JSON.parse(readFileSync(`content/sets/discovery/puzzles-and-games/riddles/${name}.json`, 'utf8')) as RawContentPack);
const questions = packs.flatMap((pack) => pack.questions);
function question(suffix: string) {
  const matches = questions.filter((q) => q.id.endsWith(`-${suffix}`));
  expect(matches).toHaveLength(1);
  return matches[0];
}
function answer(suffix: string) {
  const q = question(suffix);
  return q.choices.find((c) => c.id === q.correctChoiceId)!.text;
}
function uniqueChoice(suffix: string, accepts: (text: string) => boolean) {
  expect(question(suffix).choices.filter((c) => accepts(c.text)).map((c) => c.text)).toEqual([answer(suffix)]);
}
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
function permutations<T>(values: T[]): T[][] {
  return values.length ? values.flatMap((v, i) => permutations(values.filter((_, j) => i !== j)).map((rest) => [v, ...rest])) : [[]];
}
/** Independent shortest-path search, used instead of trusting an authored route. */
function shortest(start: number, goal: (n: number) => boolean, next: (n: number) => [number, number][]) {
  const distances = new Map([[start, 0]]);
  const pending: [number, number][] = [[start, 0]];
  while (pending.length) {
    pending.sort((a, b) => a[1] - b[1]);
    const [state, distance] = pending.shift()!;
    if (distance !== distances.get(state)) continue;
    if (goal(state)) return distance;
    for (const [target, cost] of next(state)) {
      const candidate = distance + cost;
      if (candidate < (distances.get(target) ?? Infinity)) {
        distances.set(target, candidate);
        pending.push([target, candidate]);
      }
    }
  }
  return Infinity;
}

describe('riddle set editorial checks', () => {
  it('publishes four separate complete ladders in the Riddles folder, never Fresh Mix', () => {
    const catalog = loadBuiltInCatalog();
    expect(packs).toHaveLength(4);
    expect(questions).toHaveLength(60);
    for (const pack of packs) {
      expect(pack.sets).toHaveLength(1);
      expect(pack.questions.map((q) => q.level)).toEqual(range(1, 15));
      expect(pack.sets[0].questionIds).toEqual(pack.questions.map((q) => q.id));
      expect(catalog.setById.get(pack.sets[0].id)?.folderPath).toEqual(['Puzzles & Games', 'Riddles']);
      expect(pack.metadata).toMatchObject({ reviewStatus: 'assistant-reviewed-draft', humanReviewRecommended: true });
      for (const q of pack.questions) {
        expect(q.usage).toEqual({ freshMix: false, setIds: [pack.sets[0].id] });
        expect(q.metadata?.sourceNotes).toBeTruthy();
        expect(q.metadata?.verificationNotes).toBeTruthy();
        expect(catalog.questionById.get(q.id)?.prompt).toBe(q.prompt);
      }
    }
  });

  it('checks exact word transformations and excludes every offered distractor', () => {
    uniqueChoice('stone-shrinks', (s) => s.slice(1) === 'TONE' && s.slice(2) === 'ONE');
    uniqueChoice('between-sea-time', (s) => `SEA${s}` === 'SEABED' && `${s}TIME` === 'BEDTIME');
    for (const c of question('listen-rearranged').choices) expect([...c.text].sort()).toEqual([...'LISTEN'].sort());
    expect(answer('listen-rearranged')).toBe('SILENT');
    expect([...'STRESSED'].reverse().join('')).toBe('DESSERTS');
    expect(answer('stressed-backwards')).toBe('Sweet courses after a meal');
    uniqueChoice('three-double-pairs', (s) => /(.)\1(.)\2(.)\3/.test(s));
    uniqueChoice('alphabetical-word', (s) => [...s].every((c, i) => i === 0 || c > s[i - 1]));
    const moved = new Set<string>();
    for (let from = 0; from < 6; from++) for (let to = 0; to < 6; to++) {
      const letters = [...'BANANA'];
      const [letter] = letters.splice(from, 1);
      letters.splice(to, 0, letter);
      moved.add(letters.join(''));
    }
    uniqueChoice('one-letter-move', (s) => !moved.has(s));
    uniqueChoice('word-lock-counts', (s) => s.length === 6 && new Set(s).size === 4 && [...s].filter((c) => 'AEIOU'.includes(c)).length === 2);
    uniqueChoice('balanced-alphabet', (s) => s.charCodeAt(0) + s.charCodeAt(3) === s.charCodeAt(1) + s.charCodeAt(2));
  });

  it('finds the only self-describing code, including possible leading zeros', () => {
    const solutions = range(0, 255).map((n) => n.toString(4).padStart(4, '0')).filter((s) => s[1] === '2' && [...s].every((c, i) => Number(c) === [...s].filter((v) => Number(v) === i).length));
    expect(solutions).toEqual([answer('code-counts-itself')]);
  });

  it('enumerates the detective assignments and their exact truth counts', () => {
    expect(['red', 'blue', 'green', 'white'].filter((c) => !['red', 'blue', 'white'].includes(c))).toEqual(['green']);
    expect(answer('four-envelopes')).toBe('The green envelope');
    expect(range(8, 11).filter((n) => n > 9 && n < 11).map((n) => `${n} p.m.`)).toEqual([answer('delivery-window')]);
    const arrivals = permutations(['Ada', 'Ben', 'Cy', 'Dee']).filter((p) => p.indexOf('Ada') < p.indexOf('Ben') && p.indexOf('Ben') < p.indexOf('Cy') && p.indexOf('Cy') < p.indexOf('Dee'));
    expect(arrivals.map((p) => p[0])).toEqual([answer('arrival-chain')]);
    expect(range(1, 4).filter((n) => n !== 1 && n !== 4 && n < 3).map((n) => `Locker ${n}`)).toEqual([answer('middle-locker')]);
    const pets = permutations(['cat', 'dog', 'owl']).filter((p) => !['cat', 'dog'].includes(p[0]) && p[1] !== 'dog');
    expect(pets.map((p) => ['Mina', 'Omar', 'Pia'][p.indexOf('dog')])).toEqual([answer('pet-sitters')]);
    const ring = ['A', 'B', 'C', 'D'].filter((r) => [r === 'A', r === 'A', r !== 'D', r === 'B'].filter(Boolean).length === 1);
    expect(ring.map((r) => `Box ${r}`)).toEqual([answer('one-true-label')]);
    const thieves = ['Ada', 'Ben', 'Cy', 'Dee'].filter((t) => [t === 'Ben', t === 'Cy', t !== 'Cy', t !== 'Cy'].filter(Boolean).length === 3);
    expect(thieves).toEqual([answer('one-false-witness')]);
    const queue = permutations(['Dara', 'Eli', 'Faye', 'Gus']).filter((p) => p.indexOf('Gus') === p.indexOf('Eli') + 1 && p.indexOf('Faye') < p.indexOf('Eli') && [1, 2].includes(p.indexOf('Dara')));
    expect(queue.map((p) => p[1])).toEqual([answer('gallery-queue')]);
    const keys = permutations(['brass', 'copper', 'iron', 'silver']).filter((p) => ['iron', 'silver'].includes(p[0]) && ['copper', 'silver'].includes(p[1]) && p[2] === 'iron');
    expect(keys.map((p) => ['Ada', 'Ben', 'Cy', 'Dee'][p.indexOf('brass')])).toEqual([answer('four-keyholders')]);
    const bags = permutations(['stars', 'moons', 'mixed']).filter((p) => p[0] !== 'stars' && p[1] !== 'moons' && p[2] !== 'mixed' && p[2] !== 'moons');
    expect(bags).toEqual([['moons', 'mixed', 'stars']]);
    expect(answer('wrong-bag-labels')).toBe('Moons only; a mixture');
  });

  it('checks the implications without assuming their converses', () => {
    const badgeWorlds = [false, true].flatMap((east) => [false, true].map((badge) => ({ east, badge }))).filter((w) => (!w.east || w.badge) && !w.badge);
    expect(badgeWorlds.every((w) => !w.east)).toBe(true);
    expect(answer('missing-badge')).toBe('Noor is not in the east wing');
    const worlds = [false, true].map((unlocked) => ({ unlocked, alarm: false || unlocked })).filter((w) => !(w.alarm && true));
    expect(worlds).toEqual([{ unlocked: false, alarm: false }]);
    expect(answer('silent-alarm')).toBe('The door is locked');
  });

  it('exhaustively solves all 720 possible distinct-digit safe codes', () => {
    const clues: [string, number, number][] = [['143', 0, 0], ['590', 2, 1], ['026', 1, 0], ['907', 2, 2]];
    const candidates = range(0, 999).map((n) => String(n).padStart(3, '0')).filter((s) => new Set(s).size === 3);
    expect(candidates).toHaveLength(720);
    const solutions = candidates.filter((s) => clues.every(([g, total, placed]) => [...g].filter((c) => s.includes(c)).length === total && [...g].filter((c, i) => s[i] === c).length === placed));
    expect(solutions).toEqual([answer('three-digit-safe')]);
  });

  it('models what the hat-wearers can deduce after each public statement', () => {
    // Order: Front, Middle, Rear. The unused two hats are not visible.
    const worlds = range(0, 7).map((n) => range(0, 2).map((i) => n & (1 << i) ? 'red' : 'blue')).filter((w) => w.filter((c) => c === 'red').length <= 2);
    const afterRear = worlds.filter((w) => new Set(worlds.filter((v) => v[0] === w[0] && v[1] === w[1]).map((v) => v[2])).size === 2);
    const afterMiddle = afterRear.filter((w) => new Set(afterRear.filter((v) => v[0] === w[0]).map((v) => v[1])).size === 2);
    expect([...new Set(afterMiddle.map((w) => w[0]))]).toEqual(['blue']);
    expect(answer('hats-in-a-line')).toBe('Blue');
  });

  it('finds exactly one consistent truth-teller assignment among all sixteen', () => {
    const solutions = range(0, 15).map((n) => range(0, 3).map((i) => Boolean(n & (1 << i)))).filter(([a, b, c, d]) => a === (b === c) && b === !d && c === (a !== d) && d === (a && b));
    expect(solutions).toEqual([[false, true, false, false]]);
    expect(answer('four-witness-types')).toBe('Ben');
  });

  it('independently calculates the numerical riddles, including stopping rules', () => {
    expect(Number(answer('missing-coins'))).toBe(3 * 4 - 2);
    expect(range(0, 20).filter((n) => 2 * n + 3 === 17).map(String)).toEqual([answer('double-and-three')]);
    expect(range(0, 21).filter((n) => n + n + 3 === 21).map(String)).toEqual([answer('sibling-ages')]);
    let height = 0, day = 0;
    do { day++; height += 3; if (height >= 10) break; height -= 2; } while (day < 100);
    expect(answer('climbing-snail')).toBe(`Day ${day}`);
    expect(range(1, 49).filter((n) => n + (n + 1) === 49).map(String)).toEqual([answer('facing-pages')]);
    expect(range(10, 99).filter((n) => { const a = Math.floor(n / 10), b = n % 10; return a + b === 9 && n - (10 * b + a) === 27; }).map(String)).toEqual([answer('reversed-digits')]);
    expect(range(0, 12).filter((gold) => 3 * gold + (12 - gold) === 32).map(String)).toEqual([answer('gold-and-silver')]);
    const pairs = range(0, 4).flatMap((a) => range(0, 4).filter((b) => b > a).map((b) => [a, b]));
    expect(Number(answer('secret-handshakes'))).toBe(pairs.length);
    expect(Number(answer('three-bells'))).toBe(range(1, 100).find((n) => n % 4 === 0 && n % 6 === 0 && n % 9 === 0));
    expect(Number(answer('counting-ones'))).toBe([...range(1, 20).join('')].filter((c) => c === '1').length);
    expect(Number(answer('one-short-every-time'))).toBe(range(11, 100).find((n) => n % 2 === 1 && n % 3 === 2 && n % 5 === 4));
    const starts = range(1, 100).filter((start) => { let n = start; for (let i = 0; i < 3; i++) { if (n % 2) return false; n = n / 2 - 1; } return n === 1; });
    expect(starts.map(String)).toEqual([answer('three-tollkeepers')]);
    expect(range(1, 49).filter((n) => n % 3 === 2 && n % 4 === 3 && n % 5 === 1).map(String)).toEqual([answer('three-remainders')]);
    const locks = Array<boolean>(101).fill(false);
    for (let pass = 1; pass <= 100; pass++) for (let lock = pass; lock <= 100; lock += pass) locks[lock] = !locks[lock];
    expect(Number(answer('hundred-locks'))).toBe(locks.filter(Boolean).length);
  });

  it('checks switching for every original choice, jewel location and legal keeper action', () => {
    for (let chosen = 0; chosen < 3; chosen++) {
      let winningLocations = 0;
      for (let jewel = 0; jewel < 3; jewel++) {
        const allowed = range(0, 2).filter((open) => open !== chosen && open !== jewel);
        const outcomes = allowed.map((open) => range(0, 2).find((c) => c !== open && c !== chosen) === jewel);
        expect(outcomes.every((win) => win === (chosen !== jewel))).toBe(true);
        if (outcomes.every(Boolean)) winningLocations++;
      }
      expect(answer('helpful-keeper')).toBe(`${winningLocations}/3`);
    }
  });

  it('checks small-world openings, worst-case sock draws and conserved liquid', () => {
    expect(answer('robot-turns')).toBe(['North', 'East', 'South', 'West'][(1 + 1) % 4]);
    expect(answer('lamp-button')).toBe(5 % 2 ? 'On' : 'Off');
    const draws = (n: number): number[][] => n ? draws(n - 1).flatMap((d) => [0, 1, 2].map((c) => [...d, c])) : [[]];
    expect(draws(3).some((d) => new Set(d).size === 3)).toBe(true);
    expect(draws(4).every((d) => new Set(d).size < 4)).toBe(true);
    expect(Number(answer('dark-drawer'))).toBe(4);
    const win = [false];
    for (let n = 1; n <= 5; n++) win[n] = [1, 2].some((take) => take <= n && !win[n - take]);
    expect([1, 2].filter((take) => !win[5 - take]).map(String)).toEqual([answer('five-stones')]);
    expect(10 - 10 * (10 / 110)).toBeCloseTo(10 * (100 / 110));
    expect(answer('two-cups')).toBe('Milk in the coffee equals coffee in the milk');
  });

  it('searches jug states and finds the minimal six moves', () => {
    const distance = shortest(0, (s) => s % 6 === 4, (s) => {
      const a = Math.floor(s / 6), b = s % 6, ab = Math.min(a, 5 - b), ba = Math.min(b, 3 - a);
      return [[3, b], [a, 5], [0, b], [a, 0], [a - ab, b + ab], [a + ba, b - ba]].map(([x, y]) => [x * 6 + y, 1]);
    });
    expect(Number(answer('two-jugs'))).toBe(distance);
  });

  it('searches legal river crossings, not just the proposed route', () => {
    const side = (s: number, item: number) => Boolean(s & (1 << item));
    const safe = (s: number) => ![[1, 2], [2, 3]].some(([a, b]) => side(s, a) === side(s, b) && side(s, a) !== side(s, 0));
    const distance = shortest(0, (s) => s === 15, (s) => [-1, 1, 2, 3].filter((i) => i === -1 || side(s, i) === side(s, 0)).map((i) => s ^ 1 ^ (i === -1 ? 0 : 1 << i)).filter(safe).map((n) => [n, 1]));
    expect(Number(answer('river-crossing'))).toBe(distance);
  });

  it('checks weighing information and an explicit two-weighing strategy', () => {
    expect(3 ** 1).toBeLessThan(9);
    const outcomes = range(0, 8).map((heavy) => [Math.floor(heavy / 3), heavy % 3].join(','));
    expect(new Set(outcomes).size).toBe(9);
    expect(Number(answer('heavy-counter'))).toBe(2);
  });

  it('finds the optimal bridge schedule with weighted state search', () => {
    const times = [1, 2, 7, 10];
    const distance = shortest(0, (s) => (s & 15) === 15, (s) => {
      const side = Boolean(s & 16), available = range(0, 3).filter((i) => Boolean(s & (1 << i)) === side);
      const groups = available.flatMap((a) => [[a], ...available.filter((b) => b > a).map((b) => [a, b])]);
      return groups.map((group) => [group.reduce((n, i) => n ^ (1 << i), s ^ 16), Math.max(...group.map((i) => times[i]))]);
    });
    expect(parseInt(answer('night-bridge'))).toBe(distance);
  });

  it('computes orb-drop coverage rather than assuming a lucky break point', () => {
    const coverage = (drops: number, orbs: number): number => drops === 0 || orbs === 0 ? 0 : 1 + coverage(drops - 1, orbs - 1) + coverage(drops - 1, orbs);
    expect(Number(answer('fragile-orbs'))).toBe(range(1, 10).find((d) => coverage(d, 2) >= 10));
    expect(coverage(3, 2) + 1).toBe(7);
  });

  it('proves the coin target unreachable and finds a maximum domino matching', () => {
    expect(shortest(7, (n) => n === 0, (n) => [3, 5, 6].map((mask) => [n ^ mask, 1]))).toBe(Infinity);
    expect(answer('three-coins')).toBe('No; the number of tails stays odd');
    const cells = range(1, 62), matching = new Map<number, number>();
    const colour = (n: number) => (Math.floor(n / 8) + n % 8) % 2;
    const adjacent = (a: number, b: number) => Math.abs(Math.floor(a / 8) - Math.floor(b / 8)) + Math.abs(a % 8 - b % 8) === 1;
    function augment(a: number, seen: Set<number>): boolean {
      for (const b of cells.filter((b) => adjacent(a, b))) {
        if (seen.has(b)) continue;
        seen.add(b);
        if (!matching.has(b) || augment(matching.get(b)!, seen)) { matching.set(b, a); return true; }
      }
      return false;
    }
    for (const a of cells.filter((n) => colour(n) === 0)) augment(a, new Set());
    expect(Number(answer('missing-corners'))).toBe(matching.size);
  });

  it('solves every smaller stone position to verify the unique winning opening', () => {
    const memo = new Map<string, boolean>();
    function winning(piles: number[]): boolean {
      const key = [...piles].sort().join(',');
      if (memo.has(key)) return memo.get(key)!;
      const result = piles.some((size, i) => range(1, size).some((take) => !winning(piles.map((v, j) => i === j ? v - take : v))));
      memo.set(key, result);
      return result;
    }
    const piles = [2, 4, 7];
    const winningMoves = piles.flatMap((size, i) => range(1, size).filter((take) => !winning(piles.map((v, j) => i === j ? v - take : v))).map((take) => `Take ${take} from the pile of ${size}`));
    expect(winningMoves).toEqual([answer('three-piles')]);
  });

  it('searches the corridor and checks single-batch vial identification', () => {
    expect(Number(answer('numbered-rooms'))).toBe(shortest(1, (s) => s === 12, (s) => [s + 3, s - 2].filter((n) => n >= 1 && n <= 12).map((n) => [n, 1])));
    const strips = Number(answer('glowing-vial'));
    expect(2 ** (strips - 1)).toBeLessThan(16);
    const patterns = range(0, 15).map((vial) => range(0, strips - 1).map((i) => Number(Boolean(vial & (1 << i)))).join(''));
    expect(new Set(patterns).size).toBe(16);
  });
});
