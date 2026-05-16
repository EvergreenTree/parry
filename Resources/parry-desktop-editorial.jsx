// Desktop variant B — "Editorial split" — left half: large serif headline
// + manifesto lines + inline talk action. Right half: parrot framed
// like a botanical plate.

function DesktopEditorial({ accent = '#FF5B2E' }) {
  const ink = '#1A1815';
  const paper = '#F5F0E6';
  const muted = '#7A736A';
  const [speaking, setSpeaking] = React.useState(false);

  const start = () => setSpeaking(true);
  const end   = () => setTimeout(() => setSpeaking(false), 500);

  return (
    <div style={{
      width: '100%', height: '100%', background: paper, color: ink,
      fontFamily: 'Inter', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 40px', borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ParryMark size={22} color={ink}/>
          <ParryWord size={24} color={ink}/>
        </div>
        <MicroTag color={muted}>vol. 01 · on-device intelligence</MicroTag>
        <div style={{ display: 'flex', gap: 22, fontSize: 13 }}>
          <span>Manifesto</span><span>Privacy</span><span>Download</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: 0 }}>
        {/* left column */}
        <div style={{
          padding: '60px 56px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', borderRight: '1px solid rgba(0,0,0,0.1)',
        }}>
          <MicroTag color={accent}>◆ free · forever · on-device</MicroTag>
          <h1 style={{
            fontFamily: '"Instrument Serif", serif',
            fontWeight: 400, fontSize: 96, lineHeight: 0.92,
            margin: '24px 0 0', letterSpacing: -2.4, color: ink,
            textWrap: 'balance',
          }}>
            A pocket<br/>parrot<br/>
            <em style={{ color: accent }}>that listens.</em>
          </h1>
          <p style={{
            margin: '26px 0 0', fontSize: 17, lineHeight: 1.55,
            color: muted, maxWidth: 460,
          }}>
            Parry runs free on the chip already in your phone.
            It learns from your world — texts, photos, voice — and
            never sends a packet anywhere. Each parrot is one of one.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32 }}>
            <button
              onMouseDown={start} onMouseUp={end} onMouseLeave={end}
              style={{
                appearance: 'none', cursor: 'pointer', border: 0,
                background: speaking ? '#0E0E0C' : ink, color: paper,
                padding: '16px 22px 16px 16px', borderRadius: 999,
                fontFamily: 'Inter', fontWeight: 600, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', gap: 12,
                transition: 'background 200ms ease, transform 120ms ease',
                transform: speaking ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              <span style={{
                display: 'inline-flex', width: 32, height: 32, borderRadius: '50%',
                background: accent, alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="3" width="6" height="12" rx="3" fill="#fff"/>
                  <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              {speaking ? 'Listening…' : 'Hold to talk to Parry'}
            </button>
            <MicroTag color={muted}>or press <span style={{
              padding: '2px 6px', border: `1px solid ${muted}`, borderRadius: 4,
            }}>SPACE</span></MicroTag>
          </div>

          <div style={{
            marginTop: 40, paddingTop: 22, borderTop: '1px solid rgba(0,0,0,0.1)',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18,
          }}>
            {[
              ['01', 'Free.', "Runs on the neural chip already in your phone."],
              ['02', 'Private.', 'Trains only on what you let it see.'],
              ['03', 'Yours.', 'No two parrots are alike.'],
            ].map(([n, t, b]) => (
              <div key={n}>
                <MicroTag color={accent}>{n}</MicroTag>
                <div style={{
                  fontFamily: '"Instrument Serif", serif',
                  fontStyle: 'italic', fontSize: 22, marginTop: 6,
                }}>{t}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.45, color: muted, marginTop: 4 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>

        {/* right column — botanical plate */}
        <div style={{
          padding: 28, display: 'flex', flexDirection: 'column',
          background: `linear-gradient(180deg, ${accent}0d, transparent 60%)`,
        }}>
          <div style={{
            flex: 1, border: '1px solid rgba(0,0,0,0.18)', borderRadius: 8,
            padding: 24, display: 'flex', flexDirection: 'column',
            position: 'relative', background: paper,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <MicroTag color={ink}>plate i.</MicroTag>
              <MicroTag color={muted}>parrus domesticus</MicroTag>
            </div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 12,
            }}>
              <ParrotMascot size={300} bodyColor={accent} speaking={speaking}/>
            </div>
            <Hairline color="rgba(0,0,0,0.18)" />
            <p style={{
              margin: '14px 0 0',
              fontFamily: '"Instrument Serif", serif',
              fontStyle: 'italic', fontSize: 16, lineHeight: 1.4, color: ink,
              textAlign: 'center',
            }}>
              "speaks only to the one who feeds it"
            </p>
            {/* corner crosshairs */}
            {[[8,8],[8,'auto','auto',8],[
              'auto',8,8,'auto'
            ],['auto','auto',8,8]].map((p, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: p[0], right: p[1], bottom: p[2], left: p[3],
                width: 8, height: 8,
                borderTop: i < 2 ? `1px solid ${ink}` : 'none',
                borderBottom: i >= 2 ? `1px solid ${ink}` : 'none',
                borderLeft:  i % 2 === 0 ? `1px solid ${ink}` : 'none',
                borderRight: i % 2 === 1 ? `1px solid ${ink}` : 'none',
              }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.DesktopEditorial = DesktopEditorial;
