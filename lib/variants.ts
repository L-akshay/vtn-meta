export type Variant = "default" | "students" | "meetings" | "writers";
export type ShowcaseStep = "live" | "cleanup" | "summary" | "rephrase";
export interface Campaign {
  title: string; description: string; noteTitle: string; transcript: string;
  summary: string; actions: string[]; email: string; order: ShowcaseStep[];
}
export const campaigns: Record<Variant, Campaign> = {
  default: {
    title: "Talk. It's written.",
    description: "Turn what you say into clear notes, transcripts, summaries, and action items.",
    noteTitle: "A little plan for Friday",
    transcript: "Let's finish the campaign page by Friday. I'll handle the first draft, then we can review the analytics together before we launch.",
    summary: "The campaign page is due Friday. Finish the draft, then review analytics before launch.",
    actions: ["Finish the first draft", "Review analytics together", "Launch the page on Friday"],
    email: "Hi team,\nLet's aim to finish the campaign page by Friday. I'll prepare the first draft so we can review the analytics together before launch.\nThanks!",
    order: ["live", "cleanup", "summary", "rephrase"],
  },
  students: {
    title: "Record the lecture. Read the notes.",
    description: "Stay with the lesson. Turn spoken ideas into clear study notes you can revisit later.",
    noteTitle: "Today's biology lecture",
    transcript: "Photosynthesis turns light into chemical energy. Plants use sunlight, water, and carbon dioxide to make glucose, releasing oxygen along the way. Review this for Thursday.",
    summary: "Plants convert light into chemical energy through photosynthesis, producing glucose and releasing oxygen.",
    actions: ["Review the photosynthesis process", "Learn the inputs and outputs", "Revise before Thursday"],
    email: "Photosynthesis: revision outline\n1. Energy from sunlight\n2. Water and carbon dioxide as inputs\n3. Glucose and oxygen as outputs",
    order: ["live", "summary", "cleanup", "rephrase"],
  },
  meetings: {
    title: "Every meeting, minuted by AI.",
    description: "Stay in the conversation. Leave with the key points, a clear summary, and what comes next.",
    noteTitle: "Monday team catch-up",
    transcript: "Let's move the launch review to Thursday morning. I'll update the presentation today. We also need the customer feedback ready before the review.",
    summary: "The launch review moves to Thursday morning. Update the presentation and gather customer feedback first.",
    actions: ["Update the presentation today", "Gather customer feedback", "Review the launch on Thursday"],
    email: "Hi team,\nOur launch review is now Thursday morning. I'll update the presentation today. Please have the customer feedback ready for our discussion.\nThanks!",
    order: ["live", "summary", "cleanup", "rephrase"],
  },
  writers: {
    title: "Draft at the speed of speech.",
    description: "Catch the idea while it's fresh. Turn your spoken thoughts into a first draft you can shape.",
    noteTitle: "An idea worth keeping",
    transcript: "I want to write about the little things we notice when we slow down. Start with the walk to the coffee shop, then the conversation with a stranger. End with why paying attention matters.",
    summary: "An essay about slowing down and noticing everyday moments, from a walk to an unexpected conversation.",
    actions: ["Open with the morning walk", "Write the chance conversation", "Close on paying attention"],
    email: "The art of paying attention\nThe walk to the coffee shop was the same as always. Today, I slowed down. A conversation with a stranger reminded me how much there is to notice.",
    order: ["live", "cleanup", "rephrase", "summary"],
  },
};
export const stepCopy: Record<ShowcaseStep, { label: string; title: string; description: string }> = {
  live: { label: "Transcribe", title: "Your words.\nAlready on the page.", description: "Speak naturally. See your thoughts take shape as editable text." },
  cleanup: { label: "Clean up", title: "A little less ramble.\nA lot more clarity.", description: "Give rough thoughts punctuation, paragraphs, and a clear structure." },
  summary: { label: "Summarize", title: "The big picture.\nAnd the next step.", description: "Find the key points in a conversation and turn them into useful actions." },
  rephrase: { label: "Rephrase", title: "Same thought.\nA fresh way to say it.", description: "Shape your note into an email, an outline, or a first draft." },
};
