import { useMemo, useState, type CSSProperties } from 'react'
import { C } from './theme'
import { Header } from './components/Header'
import { GroupsPanel } from './components/GroupsPanel'
import { BracketPanel } from './components/BracketPanel'
import { BottomTabs } from './components/BottomTabs'
import { useIsDesktop } from './lib/useIsDesktop'
import { useGroupDrag } from './lib/useGroupDrag'
import { rankedGroups, resolve, type Groups, type Picks } from './lib/resolve'
import type { MatchId } from './data/bracket'
import type { TeamCode } from './data/teams'

export default function App() {
  const isDesktop = useIsDesktop()
  const [groups, setGroups] = useState<Groups>(rankedGroups)
  const [picks, setPicks] = useState<Picks>({})
  const [tab, setTab] = useState<'groups' | 'bracket'>('groups')
  const [round, setRound] = useState(0)

  const { drag, startDrag, moveDrag, endDrag, stride } = useGroupDrag(groups, setGroups, isDesktop)
  const resolution = useMemo(() => resolve(groups, picks), [groups, picks])

  const reset = () => {
    setGroups(rankedGroups())
    setPicks({})
  }

  const pick = (id: MatchId, team: TeamCode | null) => {
    if (!team) return
    setPicks((prev) => {
      const next = { ...prev }
      if (next[id] === team) delete next[id]
      else next[id] = team
      return next
    })
  }

  const containerStyle: CSSProperties = isDesktop
    ? {
        width: '100%',
        maxWidth: 1520,
        height: '100dvh',
        background: C.surface,
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        width: '100%',
        maxWidth: 440,
        height: '100dvh',
        background: C.surface,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }

  const bodyStyle: CSSProperties = isDesktop
    ? { flex: 1, display: 'flex', gap: 16, padding: '14px 16px', overflow: 'hidden', minHeight: 0 }
    : { flex: 1, overflowY: 'auto', overflowX: 'hidden' }

  return (
    <div style={{ minHeight: '100dvh', background: C.appBg, display: 'flex', justifyContent: 'center' }}>
      <div style={containerStyle}>
        <Header isDesktop={isDesktop} onReset={reset} />
        <div className="scroll" style={bodyStyle}>
          <GroupsPanel
            groups={groups}
            qualifiedThirds={resolution.qualifiedThirds}
            isDesktop={isDesktop}
            visible={tab === 'groups'}
            drag={drag}
            stride={stride}
            startDrag={startDrag}
            moveDrag={moveDrag}
            endDrag={endDrag}
          />
          <BracketPanel
            resolution={resolution}
            isDesktop={isDesktop}
            visible={tab === 'bracket'}
            round={round}
            setRound={setRound}
            onPick={pick}
          />
        </div>
        {!isDesktop && (
          <BottomTabs tab={tab} onGroups={() => setTab('groups')} onBracket={() => setTab('bracket')} />
        )}
      </div>
    </div>
  )
}
