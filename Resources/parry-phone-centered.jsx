// iPhone variant A — "Centered" — the canonical minimal layout.
// Wordmark top, parrot mascot center, headline, talk button.

function PhoneCentered({ accent = '#FF5B2E' }) {
  const ink = '#1A1815';
  const paper = '#F5F0E6';
  const muted = '#7A736A';
  const [speaking, setSpeaking] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');

  const reply = "I'm parry. Press and hold the orange button — I'll listen.";
  React.useEffect(() => {
    if (!speaking) return;
    setTranscript('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTranscript(reply.slice(0, i));
      if (i > reply.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [speaking]);

  return (
    <div className="pp-screen" style={{
      background: paper, color: ink, fontFamily: 'Inter',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* top bar */}
      <div style={{
        paddingTop: 56, paddingLeft: 20, paddingRight: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ParryMark size={22} color={ink} />
          <ParryWord size={22} color={ink} />
        </div>
        <MicroTag color={muted}>on-device · free</MicroTag>
      </div>

      {/* hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px 24px',
      }}>
        <ParrotMascot size={200} bodyColor={accent} speaking={speaking} />

        <h1 style={{
          fontFamily: '"Instrument Serif", serif',
          fontWeight: 400, fontSize: 44, lineHeight: 1.0,
          margin: '24px 0 0', letterSpacing: -0.8,
          textAlign: 'center', textWrap: 'balance', color: ink,
        }}>
          Say it.<br/>
          <em style={{ color: accent }}>I'll repeat.</em>
        </h1>
        <p style={{
          margin: '14px 0 0', fontSize: 14.5, lineHeight: 1.5,
          color: muted, textAlign: 'center', maxWidth: 280,
          textWrap: 'pretty',
        }}>
          A small parrot of an AI that lives on your phone.
          It learns from your world — and only yours.
        </p>

        {/* Live transcript / placeholder */}
        <div style={{
          marginTop: 22, minHeight: 48, padding: '10px 14px',
          borderRadius: 14, background: speaking ? '#FFFFFF' : 'rgba(0,0,0,0.04)',
          width: '100%', maxWidth: 320,
          fontFamily: '"Instrument Serif", serif',
          fontStyle: 'italic',
          fontSize: 16, lineHeight: 1.35, color: ink,
          textAlign: 'center',
          transition: 'background 200ms ease',
        }}>
          {speaking ? (
            <>
              {transcript}
              {transcript.length < reply.length && <Caret color={ink} />}
            </>
          ) : (
            <span style={{ color: muted, fontStyle: 'normal',
              fontFamily: 'Inter', fontSize: 13 }}>
              hold the button below, then speak
            </span>
          )}
        </div>
      </div>

      {/* talk button */}
      <div style={{
        flexShrink: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        paddingBottom: 56, paddingTop: 8,
      }}>
        <TalkButton
          size={92} color={accent}
          onPressStart={() => setSpeaking(true)}
          onPressEnd={() => setTimeout(() => setSpeaking(false), 600)}
        />
      </div>
    </div>
  );
}

window.PhoneCentered = PhoneCentered;
