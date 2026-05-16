// iPhone variant C — "Dark Stage" — black background, a single
// spotlight, parrot huge in center, talk button glowing below.

function PhoneDark({ accent = '#FF5B2E' }) {
  const bg = '#0E0E0C';
  const ink = '#F2EFE8';
  const muted = 'rgba(242,239,232,0.55)';
  const [speaking, setSpeaking] = React.useState(false);

  return (
    <div className="pp-screen" style={{
      background: bg, color: ink, fontFamily: 'Inter',
      display: 'flex', flexDirection: 'column',
      backgroundImage: `radial-gradient(ellipse 60% 40% at 50% 35%, ${accent}1f 0%, transparent 70%)`,
    }}>
      <div style={{
        paddingTop: 56, paddingLeft: 20, paddingRight: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ParryMark size={22} color={ink} />
          <ParryWord size={22} color={ink} />
        </div>
        <MicroTag color={muted}>● local · 0 ms</MicroTag>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '8px 24px',
      }}>
        <ParrotMascot size={230} bodyColor={accent}
                      bellyColor="#3B2E1F" wingColor="#C9381B"
                      branchColor={ink} speaking={speaking} />
        <h1 style={{
          fontFamily: '"Instrument Serif", serif',
          fontWeight: 400, fontSize: 40, lineHeight: 1.0,
          margin: '20px 0 0', letterSpacing: -0.6, color: ink,
          textAlign: 'center', textWrap: 'balance',
        }}>
          One parrot.<br/>
          <em style={{ color: accent }}>One person.</em>
        </h1>
        <p style={{
          margin: '12px 0 0', fontSize: 14, lineHeight: 1.5,
          color: muted, textAlign: 'center', maxWidth: 280,
        }}>
          Trained on your phone. By you. For you.
        </p>
      </div>

      <div style={{
        flexShrink: 0, paddingBottom: 56, paddingTop: 12,
        display: 'flex', justifyContent: 'center',
      }}>
        <TalkButton size={92} color={accent} dark
          onPressStart={() => setSpeaking(true)}
          onPressEnd={() => setTimeout(() => setSpeaking(false), 600)} />
      </div>
    </div>
  );
}

window.PhoneDark = PhoneDark;
