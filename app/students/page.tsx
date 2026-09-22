import { LandingPage } from "@/components/LandingPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Record the lecture. Read the notes. — VoiceToNotes" };
export default function Students() { return <LandingPage variant="students" />; }
