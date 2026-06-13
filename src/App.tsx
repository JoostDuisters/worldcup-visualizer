import { GROUP_KEYS, INITIAL_GROUPS, flagOf, nameOf, rankOf } from './data'

export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 760 }}>
      <h1>World Cup 2026 ⚽</h1>
      <p>Tournament data ported. Groups below are read from <code>src/data</code>.</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1rem',
        }}
      >
        {GROUP_KEYS.map((g) => (
          <section key={g} style={{ border: '1px solid #ccc', borderRadius: 8, padding: '0.75rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>Group {g}</h2>
            <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {INITIAL_GROUPS[g].map((code) => (
                <li key={code}>
                  {flagOf(code)} {nameOf(code)}{' '}
                  <span style={{ color: '#888' }}>#{rankOf(code)}</span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  )
}
