// Group stage: which teams are in which group, and the default best-third-place
// qualifiers. Teams are referenced by TeamCode (see teams.ts).

import type { TeamCode } from './teams'

export const GROUP_KEYS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
] as const

export type GroupKey = (typeof GROUP_KEYS)[number]

/** A group is exactly four teams, ordered by current standing (1st → 4th). */
export type Group = readonly [TeamCode, TeamCode, TeamCode, TeamCode]

/**
 * The drawn groups for 2026. Initial order reflects the seeded draw order
 * (Pot 1 first); reordering a group changes who finishes 1st/2nd/3rd.
 */
export const INITIAL_GROUPS = {
  A: ['MEX', 'KOR', 'RSA', 'CZE'],
  B: ['CAN', 'SUI', 'QAT', 'BIH'],
  C: ['BRA', 'MAR', 'SCO', 'HAI'],
  D: ['USA', 'PAR', 'AUS', 'TUR'],
  E: ['GER', 'ECU', 'CIV', 'CUW'],
  F: ['NED', 'JPN', 'TUN', 'SWE'],
  G: ['BEL', 'IRN', 'EGY', 'NZL'],
  H: ['ESP', 'URU', 'KSA', 'CPV'],
  I: ['FRA', 'SEN', 'NOR', 'IRQ'],
  J: ['ARG', 'AUT', 'ALG', 'JOR'],
  K: ['POR', 'COL', 'UZB', 'COD'],
  L: ['ENG', 'CRO', 'PAN', 'GHA'],
} as const satisfies Record<GroupKey, Group>

/**
 * Default assignment of the 8 best third-place qualifiers: which groups' third-
 * placed team fills each of the 8 third-place R32 slots, in slot order (slot 0
 * first). A placeholder — in reality this is decided by points across groups.
 */
export const INITIAL_THIRD_PLACE = [
  'C', 'E', 'F', 'H', 'I', 'K', 'A', 'G',
] as const satisfies readonly GroupKey[]
