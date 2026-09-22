export type CampaignKey = "default" | "students" | "meetings" | "writers";

export const campaigns = {
  default: {
    h1: "Talk. It's written.",
    subhead:
      "VoiceToNotes turns what you say into clean notes, transcripts, summaries and action items in real time.",
    showcaseOrder: ["live", "cleanup", "summary", "rephrase"],
  },
  students: {
    h1: "Record the lecture. Read the notes.",
    subhead:
      "Stay focused on the class while VoiceToNotes captures the transcript and turns it into a clean note you can review later.",
    showcaseOrder: ["live", "summary", "cleanup", "rephrase"],
  },
  meetings: {
    h1: "Every meeting, minuted by AI.",
    subhead:
      "Keep your attention on the conversation while VoiceToNotes captures the discussion, summary and action items.",
    showcaseOrder: ["live", "summary", "cleanup", "rephrase"],
  },
  writers: {
    h1: "Draft at the speed of speech.",
    subhead:
      "Speak the rough idea first. VoiceToNotes turns it into editable text you can clean, structure and rewrite.",
    showcaseOrder: ["live", "cleanup", "rephrase", "summary"],
  },
} as const;
