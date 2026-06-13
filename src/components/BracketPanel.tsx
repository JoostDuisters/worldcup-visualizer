import type { CSSProperties } from 'react'
import { C } from '../theme'
import type { MatchId } from '../data/bracket'
import type { TeamCode } from '../data/teams'
import type { Resolution } from '../lib/resolve'
import { DesktopBracket } from './DesktopBracket'
import { MobileBracket } from './MobileBracket'

interface Props {
  resolution: Resolution
  isDesktop: boolean
  /** On mobile, whether the Bracket tab is active. Ignored on desktop. */
  visible: boolean
  round: number
  setRound: (i: number) => void
  onPick: (id: MatchId, team: TeamCode | null) => void
}

export function BracketPanel({ resolution, isDesktop, visible, round, setRound, onPick }: Props) {
  const panelStyle: CSSProperties = isDesktop
    ? { flex: 1, overflow: 'auto', minWidth: 0, padding: '0 4px' }
    : { display: visible ? 'block' : 'none', paddingBottom: 24 }

  return (
    <div className="scroll" style={panelStyle}>
      {isDesktop ? (
        <>
          <div style={{ fontSize: 11.5, color: C.dim, marginBottom: 14 }}>
            Every match is pre-filled with the predicted winner. Click a team to advance it instead —
            results flow forward automatically.
          </div>
          <DesktopBracket resolution={resolution} onPick={onPick} />
        </>
      ) : (
        <MobileBracket resolution={resolution} round={round} setRound={setRound} onPick={onPick} />
      )}
    </div>
  )
}
