import { shorten } from "..";
import { EnrichedRouteStep } from "./enrichRoute";

const MAX_INGAME_LENGTH = 3900 - 10; // 3900 is the maximum length of a route in the game notepad, keep 10 characters in case of minor changes/errors

type TextRoutePart = {
  title: string;
  help: string;
  content: string;
  ingameContent: string;
};

type TextRouteStep = {
  content: string;
  ingameContent: string;
};

function createRoutePart(
  fromName: string,
  toName: string,
  start: number,
  startName: string
): TextRoutePart {
  const part = {
    title: `${fromName} → ${toName}`,
    help: "Gate: (x)→ SmartGate: []→ Jump: ly→",
    content: `<a href="showinfo:5//${start}">${startName}</a>`,
    length: 0,
  };
  const ingameContent =
    `<font size="14" color="#bfffffff">${part.title} 1/6<br>` +
    `${part.help}<br></font>` +
    `<font size="14" color="#ffd98d00">${part.content}</font>`;
  return {
    ...part,
    ingameContent,
  };
}

function buildSmartgateStep(
  to: number,
  toName: string,
  id: string,
  itemId: string,
  itemName?: string
): TextRouteStep {
  const name = itemName ? shorten(itemName, 10, "…") : shorten(id, 6, "…");
  const content = `[<a href="showinfo:88086//${itemId}">${name}</a>]→ <a href="showinfo:5//${to}">${toName}</a>`;
  const ingameContent =
    `<font size="14" color="#bfffffff"> [</font><font size="14" color="#ffd98d00"><a href="showinfo:88086//${itemId}">${name}</a></font>` +
    `<font size="14" color="#bfffffff">]→ </font><font size="14" color="#ffd98d00"><a href="showinfo:5//${to}">${toName}</a></font>`;
  return {
    content,
    ingameContent,
  };
}

function buildJumpStep(
  to: number,
  toName: string,
  distance: number
): TextRouteStep {
  const content = `${distance.toFixed(0)}→ <a href="showinfo:5//${to}">${toName}</a>`;
  const ingameContent = `<font size="14" color="#bfffffff"> ${distance.toFixed(0)}→ </font><font size="14" color="#ffd98d00"><a href="showinfo:5//${to}">${toName}</a></font>`;
  return {
    content,
    ingameContent,
  };
}

function buildGateStep(
  to: number,
  toName: string,
  count: number
): TextRouteStep {
  const content = `(${count})→ <a href="showinfo:5//${to}">${toName}</a>`;
  const ingameContent = `<font size="14" color="#bfffffff"> (${count})→ </font><font size="14" color="#ffd98d00"><a href="showinfo:5//${to}">${toName}</a></font>`;
  return {
    content,
    ingameContent,
  };
}

// Use a generator to emit the route parts one by one
// Each part in game text length is limited to MAX_INGAME_LENGTH to fit in the game notepad
function* buildRoute(path: EnrichedRouteStep[]): Generator<TextRoutePart> {
  const start = path[0];
  const end = path[path.length - 1];
  if (!start || !end) {
    return [];
  }
  let currentPart: TextRoutePart = createRoutePart(
    start.fromName,
    end.toName,
    start.from,
    start.fromName
  );

  let gateCount = 0;
  for (let i = 0; i < path.length; i++) {
    let textStep: TextRouteStep | undefined;
    const step = path[i]!;

    if (step.type === "gate") {
      const nextStep = i + 1 < path.length ? path[i + 1] : undefined;
      const isNextGate = nextStep?.type === "gate";
      if (isNextGate) {
        // If next step is a gate, we count it to render the stack at the end
        gateCount++;
        continue;
      } else {
        // If next step is not a gate, we need to render the stack
        gateCount++;
        textStep = buildGateStep(step.to, step.toName, gateCount);
        gateCount = 0;
      }
    } else if (step.type === "smartgate") {
      textStep = buildSmartgateStep(
        step.to,
        step.toName,
        step.id,
        step.itemId,
        step.name
      );
    } else if (step.type === "jump") {
      textStep = buildJumpStep(step.to, step.toName, step.distance);
    }
    if (!textStep) {
      continue; // Should not happen
    }
    if (
      currentPart.ingameContent.length + textStep.ingameContent.length >
      MAX_INGAME_LENGTH
    ) {
      yield currentPart;
      currentPart = createRoutePart(
        start.fromName,
        end.toName,
        step.from,
        step.fromName
      );
    }
    currentPart.content += " " + textStep.content;
    currentPart.ingameContent += textStep.ingameContent;
  }

  yield currentPart;
}

export function gameNotepadRoute(path: EnrichedRouteStep[]): string[] {
  const parts = Array.from(buildRoute(path));
  return parts.map((part, idx) => {
    let r = `${part.title}`;
    if (parts.length > 1) {
      r += ` ${idx + 1}/${parts.length}`;
    }
    return r + `\n${part.help}\n${part.content}`;
  });
}
