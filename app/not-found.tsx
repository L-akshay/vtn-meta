import Link from "next/link";
export default function NotFound() {
  return <main className="not-found container"><h1>This note went missing.</h1><p>Let&apos;s get you back to VoiceToNotes.</p><Link className="cta" href="/">Back to the landing page</Link></main>;
}
