import { StarterPrompts } from "@/registry/components/starter-prompts/starter-prompts";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 520 };

export default function StarterPromptsDemo() {
  return (
    <Stack gap={3} width={668}>
      <StarterPrompts />
    </Stack>
  );
}
