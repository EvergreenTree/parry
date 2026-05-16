const {
  DesignCanvas, DCSection, DCArtboard,
  IOSDevice, ChromeWindow,
  TweaksPanel, TweakSection, TweakColor, useTweaks,
  PhoneCentered, PhoneEditorial, PhoneDark,
  DesktopCentered, DesktopEditorial, DesktopStage,
} = window;

// Phone artboard
const PW = 402, PH = 874;
const PHONE_PAD = 32;
const PAW = PW + PHONE_PAD * 2;
const PAH = PH + PHONE_PAD * 2;

// Desktop artboard
const DW = 1280, DH = 800;
const DESK_PAD = 24;
const DAW = DW + DESK_PAD * 2;
// Browser chrome adds ~80px of height
const DAH = DH + DESK_PAD * 2 + 80;

function PhoneFrame({ children }) {
  return (
    <div style={{
      width: PAW, height: PAH,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <IOSDevice width={PW} height={PH}>{children}</IOSDevice>
    </div>
  );
}

function WebFrame({ children }) {
  return (
    <div style={{
      width: DAW, height: DAH,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <ChromeWindow
        width={DW} height={DH + 80}
        url="parry.app"
        tabs={[{ title: 'Parry — on-device AI', active: true }, { title: 'New Tab' }]}
        activeIndex={0}
      >
        <div style={{ width: '100%', height: '100%' }}>{children}</div>
      </ChromeWindow>
    </div>
  );
}

function App() {
  const t = useTweaks(window.__TWEAK_DEFAULTS);
  const accent = t.accent;

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="parry-desktop"
          title="Parry — desktop landing page"
          subtitle="Parrot mascot · minimal talk-button hero · 3 directions"
        >
          <DCArtboard id="d-centered" label="A · Centered" width={DAW} height={DAH}>
            <WebFrame><DesktopCentered accent={accent}/></WebFrame>
          </DCArtboard>
          <DCArtboard id="d-editorial" label="B · Editorial split" width={DAW} height={DAH}>
            <WebFrame><DesktopEditorial accent={accent}/></WebFrame>
          </DCArtboard>
          <DCArtboard id="d-stage" label="C · Stage (dark)" width={DAW} height={DAH}>
            <WebFrame><DesktopStage accent={accent}/></WebFrame>
          </DCArtboard>
        </DCSection>

        <DCSection
          id="parry-phone"
          title="Parry — iPhone landing page"
          subtitle="Same parrot, same minimalism, three iPhone treatments"
        >
          <DCArtboard id="p-centered" label="A · Centered" width={PAW} height={PAH}>
            <PhoneFrame><PhoneCentered accent={accent}/></PhoneFrame>
          </DCArtboard>
          <DCArtboard id="p-editorial" label="B · Editorial" width={PAW} height={PAH}>
            <PhoneFrame><PhoneEditorial accent={accent}/></PhoneFrame>
          </DCArtboard>
          <DCArtboard id="p-dark" label="C · Stage (dark)" width={PAW} height={PAH}>
            <PhoneFrame><PhoneDark accent={accent}/></PhoneFrame>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent">
          <TweakColor
            label="Color"
            value={t.accent}
            options={['#FF5B2E', '#1F8A5B', '#2A6FDB', '#B8336A', '#D4A017', '#1A1815']}
            onChange={(v) => t.setTweak('accent', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
