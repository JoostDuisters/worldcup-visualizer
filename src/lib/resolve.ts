// Resolution logic — the heart of the planner.
//
// Given the current group orderings plus any user winner-overrides ("picks"),
// derive every match in the knockout phase. Everything here is a pure function
// of its inputs; nothing is stored. Predictions (best thirds + auto-picked
// winners) are driven by each team's FIFA ranking (teams.ts), where a lower
// rank number is stronger.

import {
  GROUP_KEYS,
  INITIAL_GROUPS,
  type GroupKey,
} from '../data/groups'
import { rankOf, type TeamCode } from '../data/teams'
import {
  R32,
  R16,
  QF,
  SF,
  FINAL,
  type GroupPosition,
  type KnockoutMatch,
  type MatchId,
  type Slot,
} from '../data/bracket'

/** Current standings: each group's teams ordered 1st → 4th (editable state). */
export type Groups = Record<GroupKey, readonly TeamCode[]>

/** User winner-overrides, keyed by match id. Absent ⇒ auto-predicted. */
export type Picks = Partial<Record<MatchId, TeamCode>>

export interface ResolvedMatch {
  readonly home: TeamCode | null
  readonly away: TeamCode | null
  readonly winner: TeamCode | null
  /** True when the winner came from a user pick rather than auto-prediction. */
  readonly pinned: boolean
  /** Seed label shown on R32 rows ("1st E", "2nd C", "3rd"); empty elsewhere. */
  readonly homeLabel: string
  readonly awayLabel: string
}

export interface Resolution {
  readonly matches: Record<MatchId, ResolvedMatch>
  /** Groups whose third-placed team qualifies as one of the 8 best thirds. */
  readonly qualifiedThirds: ReadonlySet<GroupKey>
  readonly champion: TeamCode | null
}

/** Initial standings: each group sorted by FIFA rank (strongest finishes 1st). */
export function rankedGroups(): Groups {
  const out = {} as Record<GroupKey, readonly TeamCode[]>
  for (const g of GROUP_KEYS) {
    out[g] = [...INITIAL_GROUPS[g]].sort((a, b) => rankOf(a) - rankOf(b))
  }
  return out
}

/** Auto-predicted winner of a match: the better-ranked of the two teams. */
export function autoWin(a: TeamCode | null, b: TeamCode | null): TeamCode | null {
  if (!a) return b
  if (!b) return a
  return rankOf(a) <= rankOf(b) ? a : b
}

/**
 * Determine the 8 best third-placed teams (by rank) and assign each to its R32
 * third-place slot, respecting each slot's eligibility set. Assignment is greedy
 * — the best eligible unused third per slot, in slot order — matching the
 * prototype's approximation of the official lookup table.
 */
function computeThirds(groups: Groups): {
  qualified: Set<GroupKey>
  slotMap: (GroupKey | undefined)[]
} {
  const rankedThirds = GROUP_KEYS
    .map((g) => ({ g, team: groups[g][2] }))
    .sort((a, b) => rankOf(a.team) - rankOf(b.team))
  const qualifiedList = rankedThirds.slice(0, 8).map((x) => x.g)
  const qualified = new Set<GroupKey>(qualifiedList)

  const thirdSlots = R32
    .map((m) => m.away)
    .filter((s): s is Extract<Slot, { kind: 'third' }> => s.kind === 'third')
    .sort((a, b) => a.slot - b.slot)

  const used = new Set<GroupKey>()
  const slotMap: (GroupKey | undefined)[] = []
  for (const slot of thirdSlots) {
    const candidates = qualifiedList
      .filter((g) => slot.eligibleGroups.includes(g) && !used.has(g))
      .sort((a, b) => rankOf(groups[a][2]) - rankOf(groups[b][2]))
    const pick = candidates.length
      ? candidates[0]
      : qualifiedList.find((g) => !used.has(g))
    if (pick) {
      used.add(pick)
      slotMap[slot.slot] = pick
    }
  }
  return { qualified, slotMap }
}

const ORDINAL: Record<GroupPosition, string> = { 1: '1st', 2: '2nd' }

export function resolve(groups: Groups, picks: Picks): Resolution {
  const { qualified, slotMap } = computeThirds(groups)

  const teamFor = (slot: Slot): TeamCode | null => {
    if (slot.kind === 'third') {
      const g = slotMap[slot.slot]
      return g ? groups[g][2] : null
    }
    return groups[slot.group][slot.position - 1]
  }

  const labelFor = (slot: Slot): string =>
    slot.kind === 'third' ? '3rd' : `${ORDINAL[slot.position]} ${slot.group}`

  const decide = (
    id: MatchId,
    home: TeamCode | null,
    away: TeamCode | null,
  ): { winner: TeamCode | null; pinned: boolean } => {
    const pick = picks[id]
    if (pick && (pick === home || pick === away)) return { winner: pick, pinned: true }
    return { winner: autoWin(home, away), pinned: false }
  }

  const matches = {} as Record<MatchId, ResolvedMatch>

  for (const m of R32) {
    const home = teamFor(m.home)
    const away = teamFor(m.away)
    const { winner, pinned } = decide(m.id, home, away)
    matches[m.id] = {
      home,
      away,
      winner,
      pinned,
      homeLabel: labelFor(m.home),
      awayLabel: labelFor(m.away),
    }
  }

  const laterRounds: readonly KnockoutMatch[] = [...R16, ...QF, ...SF, FINAL]
  for (const m of laterRounds) {
    const home = matches[m.feeders[0]].winner
    const away = matches[m.feeders[1]].winner
    const { winner, pinned } = decide(m.id, home, away)
    matches[m.id] = { home, away, winner, pinned, homeLabel: '', awayLabel: '' }
  }

  return { matches, qualifiedThirds: qualified, champion: matches[FINAL.id].winner }
}
