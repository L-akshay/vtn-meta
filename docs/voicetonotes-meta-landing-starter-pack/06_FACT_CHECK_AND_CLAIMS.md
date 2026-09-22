# Fact check & claims gate

Research date: **2026-09-22**

This file exists to stop a coding agent from turning old marketing copy into “facts”.

## Current public sources checked

- Main site: https://voicetonotes.ai/
- Privacy policy: https://voicetonotes.ai/privacy-policy/
- Terms: https://voicetonotes.ai/terms/
- US App Store listing: https://apps.apple.com/us/app/voicetonotes-ai-voice-to-text/id6747948555
- Google Play listing: https://play.google.com/store/apps/details?id=ai.voicetonotes.mobileapp

## Safe product statements

Public sources currently support:
- real-time speech-to-text / transcription
- AI formatting / rewriting / summaries
- notes for meetings, lectures, writers and general productivity
- iOS and Android availability
- Google Play describes support for **20+ languages**
- privacy policy says VoiceToNotes does not sell users’ notes, recordings or personal content
- privacy policy says private recordings/transcripts are not used to train public AI models without explicit consent

## Claims that need approval before use

### `90+ languages`
Do not use yet.

The supplied brief says 90+, while the current Google Play listing and current VoiceToNotes web content say 20+.

### `1M+ users`
Do not use as proof on this ad landing page unless the team supplies an internal source or a public source that clearly supports the metric.

### `99% accuracy`
Do not use as a blanket claim. Existing site pages contain multiple accuracy statements with different conditions and methodologies.

### `bank-level encryption`
Do not use. It is vague marketing language and is not needed for this landing page.

### `zero data retention`
Do not use. The current privacy policy describes processing/storage through Firebase and third-party AI infrastructure, which is not consistent with a broad “zero retention” claim.

### `Featured on Product Hunt / G2 / Capterra`
Do not display unless source URLs are supplied and verified.

### reviews
Do not scrape and reproduce reviews during development. Use team-approved review copy.

## Store metrics

Store numbers change and vary by locale.

Current public snapshots found during research include:
- US App Store: 3.9 / 5 from 14 ratings
- Google Play: 1L+ downloads

These should **not be hardcoded** into the page.

Use a content config with:
```ts
proof: null
```

Only ship proof after someone approves the exact wording and date.

## Why this matters

For a paid landing page, weak proof is worse than no proof. A visible low/ambiguous rating or a claim that differs from the store can reduce trust and create ad-review risk.
