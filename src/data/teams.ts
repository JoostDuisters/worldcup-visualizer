// FIFA World Cup 2026 — participating teams.
//
// Keyed by FIFA country code (trigram) so that group and bracket data reference
// a stable identifier rather than a display string. This is the single source
// of truth for a team's name, flag and ranking, replacing the old name-keyed
// FLAGS map.
//
// `rank` is the team's position in the FIFA/Coca-Cola Men's World Ranking,
// edition of 11 June 2026 (source: fifa.com).

export interface Team {
  /** Display name. */
  readonly name: string
  /** Flag emoji. England/Scotland use subdivision flag sequences. */
  readonly flag: string
  /** FIFA Men's World Ranking position (11 June 2026). */
  readonly rank: number
}

export const TEAMS = {
  // Group A
  MEX: { name: 'Mexico', flag: '🇲🇽', rank: 14 },
  KOR: { name: 'South Korea', flag: '🇰🇷', rank: 25 },
  RSA: { name: 'South Africa', flag: '🇿🇦', rank: 60 },
  CZE: { name: 'Czechia', flag: '🇨🇿', rank: 40 },
  // Group B
  CAN: { name: 'Canada', flag: '🇨🇦', rank: 30 },
  SUI: { name: 'Switzerland', flag: '🇨🇭', rank: 19 },
  QAT: { name: 'Qatar', flag: '🇶🇦', rank: 56 },
  BIH: { name: 'Bosnia-Herzegovina', flag: '🇧🇦', rank: 64 },
  // Group C
  BRA: { name: 'Brazil', flag: '🇧🇷', rank: 6 },
  MAR: { name: 'Morocco', flag: '🇲🇦', rank: 7 },
  SCO: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rank: 42 },
  HAI: { name: 'Haiti', flag: '🇭🇹', rank: 83 },
  // Group D
  USA: { name: 'USA', flag: '🇺🇸', rank: 17 },
  PAR: { name: 'Paraguay', flag: '🇵🇾', rank: 41 },
  AUS: { name: 'Australia', flag: '🇦🇺', rank: 27 },
  TUR: { name: 'Turkiye', flag: '🇹🇷', rank: 22 },
  // Group E
  GER: { name: 'Germany', flag: '🇩🇪', rank: 10 },
  ECU: { name: 'Ecuador', flag: '🇪🇨', rank: 23 },
  CIV: { name: 'Ivory Coast', flag: '🇨🇮', rank: 33 },
  CUW: { name: 'Curacao', flag: '🇨🇼', rank: 82 },
  // Group F
  NED: { name: 'Netherlands', flag: '🇳🇱', rank: 8 },
  JPN: { name: 'Japan', flag: '🇯🇵', rank: 18 },
  TUN: { name: 'Tunisia', flag: '🇹🇳', rank: 45 },
  SWE: { name: 'Sweden', flag: '🇸🇪', rank: 38 },
  // Group G
  BEL: { name: 'Belgium', flag: '🇧🇪', rank: 9 },
  IRN: { name: 'Iran', flag: '🇮🇷', rank: 20 },
  EGY: { name: 'Egypt', flag: '🇪🇬', rank: 29 },
  NZL: { name: 'New Zealand', flag: '🇳🇿', rank: 85 },
  // Group H
  ESP: { name: 'Spain', flag: '🇪🇸', rank: 2 },
  URU: { name: 'Uruguay', flag: '🇺🇾', rank: 16 },
  KSA: { name: 'Saudi Arabia', flag: '🇸🇦', rank: 61 },
  CPV: { name: 'Cape Verde', flag: '🇨🇻', rank: 67 },
  // Group I
  FRA: { name: 'France', flag: '🇫🇷', rank: 3 },
  SEN: { name: 'Senegal', flag: '🇸🇳', rank: 15 },
  NOR: { name: 'Norway', flag: '🇳🇴', rank: 31 },
  IRQ: { name: 'Iraq', flag: '🇮🇶', rank: 57 },
  // Group J
  ARG: { name: 'Argentina', flag: '🇦🇷', rank: 1 },
  AUT: { name: 'Austria', flag: '🇦🇹', rank: 24 },
  ALG: { name: 'Algeria', flag: '🇩🇿', rank: 28 },
  JOR: { name: 'Jordan', flag: '🇯🇴', rank: 63 },
  // Group K
  POR: { name: 'Portugal', flag: '🇵🇹', rank: 5 },
  COL: { name: 'Colombia', flag: '🇨🇴', rank: 13 },
  UZB: { name: 'Uzbekistan', flag: '🇺🇿', rank: 50 },
  COD: { name: 'DR Congo', flag: '🇨🇩', rank: 46 },
  // Group L
  ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 4 },
  CRO: { name: 'Croatia', flag: '🇭🇷', rank: 11 },
  PAN: { name: 'Panama', flag: '🇵🇦', rank: 34 },
  GHA: { name: 'Ghana', flag: '🇬🇭', rank: 73 },
} as const satisfies Record<string, Team>

/** Stable identifier for a team (FIFA country code, e.g. "BRA"). */
export type TeamCode = keyof typeof TEAMS

export const getTeam = (code: TeamCode): Team => TEAMS[code]
export const nameOf = (code: TeamCode): string => TEAMS[code].name
export const flagOf = (code: TeamCode): string => TEAMS[code].flag
export const rankOf = (code: TeamCode): number => TEAMS[code].rank
