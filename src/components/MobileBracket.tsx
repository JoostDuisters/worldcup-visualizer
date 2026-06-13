import { C, FONT_DISPLAY } from '../theme'
import { ROUNDS, type MatchId } from '../data/bracket'
import type { TeamCode } from '../data/teams'
import type { Resolution } from '../lib/resolve'
import { MatchCard } from './MatchCard'

interface Props {
  resolution: Resolution
  round: number
  setRound: (i: number) => void
  onPick: (id: MatchId, team: TeamCode | null) => void
}

export function MobileBracket({ resolution, round, setRound, onPick }: Props) {
  const rd = ROUNDS[round]
  const count = rd.matchIds.length

  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(180deg,#0b1322 72%,rgba(11,19,34,0))',
          padding: '12px 14px',
          zIndex: 3,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {ROUNDS.map((r, i) => (
            <button
              key={r.key}
              onClick={() => setRound(i)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 9,
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 11.5,
                letterSpacing: 0.5,
                cursor: 'pointer',
                background: i === round ? 'rgba(37,210,154,0.16)' : 'transparent',
                border: `1px solid ${i === round ? C.green : C.line}`,
                color: i === round ? C.green : C.dim,
              }}
            >
              {r.short}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          padding: '0 16px',
          marginBottom: 11,
        }}
      >
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: C.text }}>
          {rd.title}
        </div>
        <div style={{ fontSize: 11, color: C.dim }}>
          {count} {count === 1 ? 'match' : 'matches'}
        </div>
      </div>

      <div style={{ padding: '0 14px' }}>
        {rd.matchIds.map((id, i) => (
          <div key={id} style={{ marginBottom: count > 2 && i % 2 === 1 ? 20 : 9 }}>
            <MatchCard
              match={resolution.matches[id]}
              isDesktop={false}
              onPick={(team) => onPick(id, team)}
            />
          </div>
        ))}
      </div>
    </>
  )
}
