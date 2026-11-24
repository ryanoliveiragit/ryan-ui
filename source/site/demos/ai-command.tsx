import { AiCommand } from "@/registry/components/ai-command/ai-command";
import { Stack } from "./_kit";
import type { DemoStage } from "./_kit";

export const stage: DemoStage = { height: 540 };

export default function AiCommandDemo() {
  return (
    <Stack gap={3} width={680}>
      <AiCommand />
    </Stack>
  );
}
