import { LandingPage } from "@/components/LandingPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Every meeting, minuted by AI. — VoiceToNotes" };
export default function Meetings() { return <LandingPage variant="meetings" />; }
