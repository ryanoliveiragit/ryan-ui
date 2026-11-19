# Voice orb

> Orbe de assistente de voz que mostra quando ele escuta, pensa ou fala, com anéis e barras que acompanham o volume.

- Type: component (category AI agents), new in ryan-ui
- Page: https://ryanoliveiragit.github.io/ryan-ui/#/c/voice-orb
- Original description: A voice assistant orb with idle, listening, thinking and speaking states whose rings and waveform bars follow a live level value.

## Installation

With the shadcn CLI (one command copies the code and installs the dependencies):

```bash
npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/voice-orb.json
```

With another package manager: `pnpm dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/voice-orb.json`, `yarn dlx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/voice-orb.json` or `bunx --bun shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/voice-orb.json`. Registry path, relative to the site address: `r/voice-orb.json`.

- npm packages: `motion`
- Files, once installed:
  - `components/ryan-ui/voice-orb/voice-orb.tsx`
  - `components/ryan-ui/voice-orb/voice-orb.module.css`

First time in the project: install the foundation once (`npx shadcn@latest add https://ryanoliveiragit.github.io/ryan-ui/r/ryan-foundation.json`) and import `@/components/ryan-ui/foundation.css` at the root of the app. Requires React 19 and the `@/` alias.

### Manual

1. Install the packages: `npm install motion`.
2. Copy the files listed above. The content of each one is in `r/voice-orb.json` (field `files[].content`).
3. Make sure `foundation.css` (the tokens) and `motion-tokens.ts` are already in your project.

## When to use

- The face of a voice assistant: shows whose turn it is, among idle, listening, thinking and speaking.
- When there is a live audio level, from the microphone or playback, so the rings and bars follow the voice.
- As the main button of the voice conversation, to start listening or interrupt speech, with `onPress`.

## When not to use

- Use [`loading-states`](loading-states.md) to indicate that the AI is thinking in a text conversation.
- Use [`button`](button.md) with a microphone icon when you only need to turn recording on and off, without states or an audio level.
- Use [`loader`](loader.md) for generic loading, unrelated to voice.

## Usage

The demo from the item page, with imports as they look after installing through the CLI. `Stack`, `Row`, `Caption`, `Field` and `Surface` (from `./_kit`) are site layout helpers: replace them with your own project layout.

```tsx
import { useEffect, useRef, useState } from "react";
import { useAnimationFrame, useMotionValue } from "motion/react";
import VoiceOrb from "@/components/ryan-ui/voice-orb/voice-orb";
import type { VoiceOrbState } from "@/components/ryan-ui/voice-orb/voice-orb";
import SegmentedControl from "@/components/ryan-ui/segmented-control/segmented-control";
import { Caption, Stack } from "./_kit";

const options = [{ value: "idle", label: "Idle" }, { value: "listening", label: "Listening" }, { value: "thinking", label: "Thinking" }, { value: "speaking", label: "Speaking" }];
/** One voice turn: listen, think, answer, rest. Milliseconds each state lasts before the next one. */
const turn: Partial<Record<VoiceOrbState, { next: VoiceOrbState; after: number }>> = { listening: { next: "thinking", after: 3200 }, thinking: { next: "speaking", after: 2000 }, speaking: { next: "idle", after: 4200 } };
const hints: Record<VoiceOrbState, string> = { idle: "Press the orb to start a turn.", listening: "The rings follow the microphone level.", thinking: "Working on the answer.", speaking: "The bars follow the voice. Press the orb to interrupt." };

export default function VoiceOrbDemo() {
  const [state, setState] = useState<VoiceOrbState>("listening");
  const [auto, setAuto] = useState(true);
  const level = useMotionValue(0);
  const current = useRef(state);
  current.current = state;

  // A stand-in for a real audio level: syllable-like bursts inside slower phrases.
  useAnimationFrame(time => {
    const seconds = time / 1000;
    const live = current.current === "listening" || current.current === "speaking";
    const syllable = (0.5 + 0.5 * Math.sin(seconds * 7.3)) * (0.6 + 0.4 * Math.sin(seconds * 2.1 + 1));
    const phrase = 0.7 + 0.3 * Math.sin(seconds * 0.9);
    level.set(live ? Math.min(1, 0.25 + syllable * 0.75 * phrase) : 0);
  });

  // While a turn is running, each state hands over to the next one on its own.
  useEffect(() => {
    const step = turn[state];
    if (!auto || !step) return;
    const timer = window.setTimeout(() => setState(step.next), step.after);
    return () => window.clearTimeout(timer);
  }, [auto, state]);

  return (
    <Stack gap={5} align="center" width={420}>
      <VoiceOrb state={state} level={level} size={224} label="Assistant voice" onPress={() => { setAuto(true); setState(state === "idle" ? "listening" : "idle"); }} />
      <SegmentedControl label="Orb state" value={state} onValueChange={value => { setAuto(false); setState(value as VoiceOrbState); }} options={options} />
      <Caption>{hints[state]}</Caption>
    </Stack>
  );
}
```

## API reference

Extracted from the source code. Prop descriptions come from code comments.

### `VoiceOrb`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `state` | `"idle" \| "listening" \| "thinking" \| "speaking"` | `"idle"` | Who has the floor. Drives the colors, the rings and how the bars move. |
| `level` | `number \| MotionValue<number>` | `0` | Loudness from 0 to 1 (microphone while listening, playback while speaking). Pass a motion value to update it every frame without re-rendering. |
| `size` | `number` | `176` | Diameter of the whole orb, rings included, in pixels. |
| `label` | `string` | `"Voice assistant"` | Accessible name of the orb. The current state is announced after it. |
| `showLabel` | `boolean` | `true` | Shows the state caption under the orb. When false the state is still announced to assistive technology. |
| `stateLabels` | `Partial<Record<VoiceOrbState, string>>` | — | Caption per state, to translate or reword the defaults. |
| `onPress` | `() => void` | — | Makes the orb a button, for example to start listening or to interrupt the answer. |
| `className` | `string` | — | Extra class for the root element. |

### Exported types

| Type | Definition |
| --- | --- |
| `VoiceOrbState` | `"idle" \| "listening" \| "thinking" \| "speaking"` |

## Keyboard

| Keys | Action |
| --- | --- |
| `Enter` or `Space` | With `onPress`, the orb is a `<button>` and these keys activate it; without `onPress`, it does not receive focus. |

## Accessibility

- With `onPress` the orb is a `<button>` with `aria-label` equal to `label`; without `onPress`, it is a `role="img"` with the same name.
- The state sits in a `role="status"`, visible as a caption or for screen readers only with `showLabel={false}`; the default texts (“Tap to talk”, “Listening”, “Thinking”, “Speaking”) change through `stateLabels`.
- The `label` does not change with the state: if the tap does different things, such as start listening or interrupt, change the `label` for each state.

## Motion

- At rest the core breathes; listening, outlined rings open around it; thinking, an arc spins; speaking, the core fills with the accent color and the rings become soft discs.
- While listening and speaking, the bars and rings follow `level` on every frame: the middle bar rises most and the outer rings follow with a looser spring, like a wave; while thinking, the bars undulate on their own.
- With “reduce motion” on, each state becomes a still shape: fixed bars per state, rings at a single size, with no breathing, spinning or core pulse.

## Performance

- Each of the five bars runs a per-frame callback while the orb is mounted, even at rest or with “reduce motion”; keep one orb per screen and unmount it outside the voice conversation.
- Pass `level` as a `MotionValue`, for example fed by an `AnalyserNode`, to update every frame without rendering React; a number in `level` requires a render on every change.

## Notes for AI

- The orb does not read the microphone: compute the volume from 0 to 1 and pass it in `level`, preferably as a `MotionValue`; `state` decides colors, rings and the bars' movement.
- Use `onPress` to start listening or interrupt speech, and change `label` according to what the tap does in each state.
- `size` is the diameter in pixels, rings included (default 176); the orb does not shrink with the container, so choose the size with the smallest screen in mind.

---

ryan-ui · https://ryanoliveiragit.github.io/ryan-ui/#/c/voice-orb · index for assistants: https://ryanoliveiragit.github.io/ryan-ui/llms.txt
