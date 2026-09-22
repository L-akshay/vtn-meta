import { LandingPage } from "@/components/LandingPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Draft at the speed of speech. — VoiceToNotes" };
export default function Writers() { return <LandingPage variant="writers" />; }
