import { AbsoluteFill, Composition, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { campaigns } from "../lib/variants";

export function VoiceToNotesDemo() {
  const frame = useCurrentFrame();
  const words = campaigns.default.transcript.split(" ");
  const shown = Math.max(0, Math.min(words.length, Math.floor((frame - 18) / 2)));
  return <AbsoluteFill style={{ backgroundColor: "#f5f5f7", fontFamily: "Geist, sans-serif", color: "#1d1d1f", padding: "120px 90px" }}>
    <style>{`@font-face{font-family:Geist;src:url('${staticFile("fonts/geist-latin.woff2")}') format('woff2');font-weight:100 900;}`}</style>
    <Img src={staticFile("brand/wordmark.svg")} style={{ width: 330, height: 53, objectFit: "contain" }} />
    <h1 style={{ fontSize: 112, letterSpacing: "-.04em", lineHeight: 1, fontWeight: 600, margin: "76px 0 35px" }}>Talk.<br />It&apos;s written.</h1>
    <p style={{ fontSize: 44, lineHeight: 1.35, color: "#6e6e73", margin: 0 }}>A thought, out loud.<br />A note you can use.</p>
    <div style={{ position: "relative", backgroundColor: "#fff", borderRadius: 32, padding: 48, marginTop: 60, height: 710, boxShadow: "0 24px 65px -30px #0003" }}>
      <div style={{ fontSize: 26, color: "#6e6e73", marginBottom: 24 }}>Illustrative demo · Personal notes</div>
      <h2 style={{ fontSize: 47, fontWeight: 600, lineHeight: 1.12, margin: "0 0 26px" }}>A little plan for Friday</h2>
      <p style={{ fontSize: 31, lineHeight: 1.5, margin: 0 }}>{words.slice(0, shown).join(" ")}</p>
      <div style={{ opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: 30, borderTop: "1px solid #d2d2d7", paddingTop: 24 }}>
        <h3 style={{ fontSize: 30, margin: "0 0 15px" }}>Action items</h3>
        {campaigns.default.actions.map(action => <p key={action} style={{ fontSize: 29, margin: "0 0 14px" }}>✓ {action}</p>)}
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", height: 58, position: "absolute", bottom: 35, left: 48, right: 48 }}>
        {Array.from({ length: 63 }, (_, i) => <div key={i} style={{ width: 6, borderRadius: 6, backgroundColor: "#db123f", height: 8 + Math.abs(Math.sin(i * 1.2 + Math.min(frame, 85) * .2)) * 38 }} />)}
      </div>
    </div>
    <div style={{ marginTop: 60, backgroundColor: "#db123f", borderRadius: 24, padding: "30px 24px", color: "white", textAlign: "center", fontSize: 42, fontWeight: 600 }}>Get the app free</div>
    <p style={{ textAlign: "center", fontSize: 24, marginTop: 24, color: "#6e6e73" }}>iPhone & Android · In-app purchases available</p>
  </AbsoluteFill>;
}
export function MotionRoot() {
  return <Composition id="VoiceToNotesDemo" component={VoiceToNotesDemo} durationInFrames={210} fps={30} width={1080} height={1920} />;
}
