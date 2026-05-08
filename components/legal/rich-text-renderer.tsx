import Link from "next/link";

type RichTextRendererProps = {
  content: string;
};

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function renderInlineText(text: string) {
  const nodes: React.ReactNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, label, href] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <Link
        key={`${href}-${start}`}
        href={href}
        className="text-[#66fcf1] underline decoration-[#66fcf1]/35 underline-offset-4 transition hover:text-[#95fff8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c10]"
      >
        {label}
      </Link>,
    );

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      index += 1;
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)/);
    const orderedMatch = line.match(/^\d+\.\s+(.+)/);

    if (unorderedMatch || orderedMatch) {
      const type: "ul" | "ol" = orderedMatch ? "ol" : "ul";
      const items: string[] = [];

      while (index < lines.length) {
        const currentLine = lines[index]?.trim() ?? "";
        const currentMatch = type === "ol"
          ? currentLine.match(/^\d+\.\s+(.+)/)
          : currentLine.match(/^[-*]\s+(.+)/);

        if (!currentMatch) {
          break;
        }

        items.push(currentMatch[1].trim());
        index += 1;
      }

      blocks.push({ type, items });
      continue;
    }

    const paragraphLines: string[] = [line];
    index += 1;

    while (index < lines.length) {
      const nextLine = lines[index]?.trim() ?? "";

      if (!nextLine) {
        index += 1;
        break;
      }

      if (
        nextLine.startsWith("## ")
        || nextLine.startsWith("### ")
        || /^[-*]\s+/.test(nextLine)
        || /^\d+\.\s+/.test(nextLine)
      ) {
        break;
      }

      paragraphLines.push(nextLine);
      index += 1;
    }

    blocks.push({ type: "p", text: paragraphLines.join(" ") });
  }

  return blocks;
}

export function RichTextRenderer({ content }: RichTextRendererProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-4 text-[1.02rem] leading-8 text-[#c6c6c6]">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h3 key={`h2-${index}`} className="text-2xl font-semibold leading-tight text-white">
              {renderInlineText(block.text)}
            </h3>
          );
        }

        if (block.type === "h3") {
          return (
            <h4 key={`h3-${index}`} className="text-xl font-semibold leading-tight text-white">
              {renderInlineText(block.text)}
            </h4>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={`ul-${index}`} className="list-disc space-y-2 pl-6 marker:text-[#66fcf1]">
              {block.items.map((item, itemIndex) => (
                <li key={`ul-item-${index}-${itemIndex}`}>{renderInlineText(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={`ol-${index}`} className="list-decimal space-y-2 pl-6 marker:text-[#66fcf1]">
              {block.items.map((item, itemIndex) => (
                <li key={`ol-item-${index}-${itemIndex}`}>{renderInlineText(item)}</li>
              ))}
            </ol>
          );
        }

        return <p key={`p-${index}`}>{renderInlineText(block.text)}</p>;
      })}
    </div>
  );
}
