// Knockout format for World Cup 2026, transcribed from FIFA's official bracket.
//
// This describes the *structure* of the knockout phase (which slots feed which
// matches) and is independent of which teams are playing. Resolving slots into
// actual teams is application logic, not data.

import type { GroupKey } from './groups'

/**
 * Stable id for every knockout match, "M73"–"M104", matching FIFA's match
 * numbers. (M103, the third-place play-off, is intentionally omitted: its
 * winner does not feed the final.)
 */
export type MatchId =
  // Round of 32
  | 'M73' | 'M74' | 'M75' | 'M76' | 'M77' | 'M78' | 'M79' | 'M80'
  | 'M81' | 'M82' | 'M83' | 'M84' | 'M85' | 'M86' | 'M87' | 'M88'
  // Round of 16
  | 'M89' | 'M90' | 'M91' | 'M92' | 'M93' | 'M94' | 'M95' | 'M96'
  // Quarter-finals
  | 'M97' | 'M98' | 'M99' | 'M100'
  // Semi-finals
  | 'M101' | 'M102'
  // Final
  | 'M104'

/** Finishing position in a group that earns a direct R32 slot. */
export type GroupPosition = 1 | 2 // 1 = winner, 2 = runner-up

/** A R32 slot filled by a group's 1st- or 2nd-placed team. */
export interface GroupSlot {
  readonly kind: 'group'
  readonly group: GroupKey
  readonly position: GroupPosition
}

/** A R32 slot filled by one of the 8 best third-placed teams. */
export interface ThirdPlaceSlot {
  readonly kind: 'third'
  /** Index 0–7 into the best-third assignment (see INITIAL_THIRD_PLACE). */
  readonly slot: number
  /** Groups whose third-placed team is eligible for this slot (FIFA bracket). */
  readonly eligibleGroups: readonly GroupKey[]
}

export type Slot = GroupSlot | ThirdPlaceSlot

/** A Round of 32 match: both contestants resolve from the group stage. */
export interface GroupStageMatch {
  readonly id: MatchId
  readonly home: Slot
  readonly away: Slot
}

/** Any later-round match: contestants are the winners of two earlier matches. */
export interface KnockoutMatch {
  readonly id: MatchId
  readonly feeders: readonly [MatchId, MatchId]
}

const group = (g: GroupKey, position: GroupPosition): GroupSlot => ({
  kind: 'group',
  group: g,
  position,
})

const third = (slot: number, eligibleGroups: readonly GroupKey[]): ThirdPlaceSlot => ({
  kind: 'third',
  slot,
  eligibleGroups,
})

/** Round of 32 pairings (FIFA official bracket order, left half then right half). */
export const R32 = [
  // ── LEFT HALF ──
  { id: 'M73', home: group('E', 1), away: third(0, ['A', 'B', 'C', 'D', 'F']) },
  { id: 'M74', home: group('I', 1), away: third(1, ['C', 'D', 'F', 'G', 'H']) },
  { id: 'M75', home: group('A', 2), away: group('B', 2) },
  { id: 'M76', home: group('F', 1), away: group('C', 2) },
  { id: 'M77', home: group('K', 2), away: group('L', 2) },
  { id: 'M78', home: group('H', 1), away: group('J', 2) },
  { id: 'M79', home: group('D', 1), away: third(2, ['B', 'E', 'F', 'I', 'J']) },
  { id: 'M80', home: group('G', 1), away: third(3, ['A', 'E', 'H', 'I', 'J']) },
  // ── RIGHT HALF ──
  { id: 'M81', home: group('C', 1), away: group('F', 2) },
  { id: 'M82', home: group('E', 2), away: group('I', 2) },
  { id: 'M83', home: group('A', 1), away: third(4, ['C', 'E', 'F', 'H', 'I']) },
  { id: 'M84', home: group('L', 1), away: third(5, ['E', 'H', 'I', 'J', 'K']) },
  { id: 'M85', home: group('J', 1), away: group('H', 2) },
  { id: 'M86', home: group('D', 2), away: group('G', 2) },
  { id: 'M87', home: group('B', 1), away: third(6, ['E', 'F', 'G', 'I', 'J']) },
  { id: 'M88', home: group('K', 1), away: third(7, ['D', 'E', 'I', 'J', 'L']) },
] as const satisfies readonly GroupStageMatch[]

/** Round of 16: winners of the R32 matches. */
export const R16 = [
  { id: 'M89', feeders: ['M73', 'M74'] },
  { id: 'M90', feeders: ['M75', 'M76'] },
  { id: 'M91', feeders: ['M77', 'M78'] },
  { id: 'M92', feeders: ['M79', 'M80'] },
  { id: 'M93', feeders: ['M81', 'M82'] },
  { id: 'M94', feeders: ['M83', 'M84'] },
  { id: 'M95', feeders: ['M85', 'M86'] },
  { id: 'M96', feeders: ['M87', 'M88'] },
] as const satisfies readonly KnockoutMatch[]

/** Quarter-finals. */
export const QF = [
  { id: 'M97', feeders: ['M89', 'M90'] },
  { id: 'M98', feeders: ['M91', 'M92'] },
  { id: 'M99', feeders: ['M93', 'M94'] },
  { id: 'M100', feeders: ['M95', 'M96'] },
] as const satisfies readonly KnockoutMatch[]

/** Semi-finals (left half, then right half). */
export const SF = [
  { id: 'M101', feeders: ['M97', 'M98'] },
  { id: 'M102', feeders: ['M99', 'M100'] },
] as const satisfies readonly KnockoutMatch[]

/** Final. */
export const FINAL = { id: 'M104', feeders: ['M101', 'M102'] } as const satisfies KnockoutMatch

export type RoundKey = 'r32' | 'r16' | 'qf' | 'sf' | 'final'

export interface Round {
  readonly key: RoundKey
  readonly title: string
  readonly short: string
  readonly matchIds: readonly MatchId[]
}

/** Ordered rounds of the knockout phase. */
export const ROUNDS = [
  { key: 'r32', title: 'Round of 32', short: 'R32', matchIds: R32.map((m) => m.id) },
  { key: 'r16', title: 'Round of 16', short: 'R16', matchIds: R16.map((m) => m.id) },
  { key: 'qf', title: 'Quarter-finals', short: 'QF', matchIds: QF.map((m) => m.id) },
  { key: 'sf', title: 'Semi-finals', short: 'SF', matchIds: SF.map((m) => m.id) },
  { key: 'final', title: 'Final', short: 'Final', matchIds: [FINAL.id] },
] as const satisfies readonly Round[]

/** Every knockout match, group-stage matches first. */
export const ALL_MATCHES: readonly (GroupStageMatch | KnockoutMatch)[] = [
  ...R32, ...R16, ...QF, ...SF, FINAL,
]

/** Lookup of any match by its id. */
export const MATCH_BY_ID = Object.fromEntries(
  ALL_MATCHES.map((m) => [m.id, m]),
) as Record<MatchId, GroupStageMatch | KnockoutMatch>

/**
 * The canonical FIFA slot code shown in the official bracket, e.g. "1E", "2B",
 * or "3 ABCDF" for a third-place slot. Derived from the slot — never stored.
 */
export function slotCode(slot: Slot): string {
  return slot.kind === 'group'
    ? `${slot.position}${slot.group}`
    : `3 ${slot.eligibleGroups.join('')}`
}
