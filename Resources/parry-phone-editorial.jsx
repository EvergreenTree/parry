// iPhone variant B — "Editorial" — large serif, parrot in caption,
// rectangular labelled talk button at bottom.

function PhoneEditorial({ accent = '#FF5B2E' }) {
  const ink = '#1A1815';
  const paper = '#F5F0E6';
  const muted = '#7A736A';
  const [speaking, setSpeaking] = React.useState(false);

  const start = (e) => { if (e) e.preventDefault?.(); setSpeaking(true); };
  const end   = () => setTimeout(() => setSpeaking(false), 500);

  return (
    <div className="pp-screen" style={{ background: paper, color: ink, fontFamily: 'Inter' }}>
      <div style={{
        paddingTop: 56, paddingLeft: 24, paddingRight: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <ParryWord size={24} color={ink} />
        <MicroTag color={muted}>vol. 01</MicroTag>
      </div>

      <div style={{ padding: '36px 24px 8px' }}>
        <MicroTag color={accent}>◆ on-device · free · forever</MicroTag>
        <h1 style={{
          fontFamily: '"Instrument Serif", serif',
          fontWeight: 400, fontSize: 64, lineHeight: 0.94,
          margin: '18px 0 0', letterSpacing: -1.6, color: ink,
          textWrap: 'balance',
        }}>
          A pocket<br/>parrot<br/>
          <em style={{ color: accent }}>that listens.</em>
        </h1>
      </div>

      <div style={{
        margin: '20px 24px 0', padding: '18px 0 0',
        borderTop: '1px solid rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <ParrotMascot size={130} bodyColor={accent} speaking={speaking} showBranch={false}/>
        <div style={{ flex: 1, paddingTop: 8 }}>
          <MicroTag color={muted}>fig. 1</MicroTag>
          <p style={{
            margin: '8px 0 0', fontSize: 13.5, lineHeight: 1.5, color: ink,
            fontFamily: '"Instrument Serif", serif', fontStyle: 'italic',
          }}>
            The parrot remembers what you teach it. It speaks only
            to you. Nothing it learns ever leaves the perch.
          </p>
        </div>
      </div>

      <div style={{ padding: '28px 24px 8px' }}>
        {[
          ['01', 'Free.', "Runs on your phone's neural chip."],
          ['02', 'Private.', 'Trains on what you let it see.'],
          ['03', 'Yours.', 'Each parrot is one of one.'],
        ].map(([n, t, b]) => (
          <div key={n} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr',
            padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.1)',
            alignItems: 'baseline', gap: 12,
          }}>
            <MicroTag color={accent}>{n}</MicroTag>
            <div>
              <span style={{
                fontFamily: '"Instrument Serif", serif',
                fontSize: 22, fontStyle: 'italic', color: ink, marginRight: 6,
              }}>{t}</span>
              <span style={{ fontSize: 14, color: muted }}>{b}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '28px 24px 80px' }}>
        <button
          onMouseDown={start} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchEnd={end}
          style={{
            width: '100%', appearance: 'none', cursor: 'pointer',
            background: speaking ? '#0E0E0C' : ink, color: paper, border: 0,
            padding: '18px 22px', borderRadius: 999,
            fontFamily: 'Inter', fontWeight: 600, fontSize: 16,
            letterSpacing: -0.1,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'transform 120ms ease, background 200ms ease',
            transform: speaking ? 'scale(0.98)' : 'scale(1)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'inline-flex', width: 28, height: 28, borderRadius: '50%',
              background: accent, alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="3" width="6" height="12" rx="3" fill="#fff"/>
                <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            {speaking ? 'Listening…' : 'Hold to talk to Parry'}
          </span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11, opacity: 0.55,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>{speaking ? '● rec' : '↗'}</span>
        </button>
      </div>
    </div>
  );
}

window.PhoneEditorial = PhoneEditorial;
