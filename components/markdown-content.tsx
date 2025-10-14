import { cn } from "@/lib/utils";

type MarkdownContentProps = {
  content: string | null;
  className?: string;
};

const allowedLinkProtocols = new Set(["http:", "https:"]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string): string {
  const trimmed = value.trim();
  try {
    const url = new URL(trimmed, "https://placeholder.local");
    if (!allowedLinkProtocols.has(url.protocol)) {
      return "#";
    }
  } catch {
    return "#";
  }
  return trimmed
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInline(value: string): string {
  let html = escapeHtml(value);

  html = html.replace(/`([^`]+)`/g, (_, code: string) => `<code>${code}</code>`);
  html = html.replace(/\*\*(.+?)\*\*/g, (_, text: string) => `<strong>${text}</strong>`);
  html = html.replace(/\*(.+?)\*/g, (_, text: string) => `<em>${text}</em>`);
  html = html.replace(/~~(.+?)~~/g, (_, text: string) => `<del>${text}</del>`);
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, label: string, url: string) =>
      `<a href="${escapeAttribute(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`,
  );

  return html;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  if (!content || content.trim().length === 0) {
    return (
      <p className="text-sm text-[#6f6f78]">No introduction is available for this tool yet.</p>
    );
  }

  const lines = content.split(/\r?\n/);
  const elements: JSX.Element[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;
  let codeBuffer: string[] | null = null;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }
    const paragraphHtml = renderInline(paragraphBuffer.join(" "));
    elements.push(
      <p
        key={`paragraph-${elements.length}`}
        className="text-sm leading-relaxed text-[#2d2d32]"
        dangerouslySetInnerHTML={{ __html: paragraphHtml }}
      />,
    );
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer || listBuffer.items.length === 0) {
      return;
    }
    const Tag = listBuffer.type === "ul" ? "ul" : "ol";
    const listClass =
      listBuffer.type === "ul"
        ? "list-disc"
        : "list-decimal";
    elements.push(
      <Tag
        key={`list-${elements.length}`}
        className={cn(listClass, "space-y-2 pl-5 text-sm leading-relaxed text-[#2d2d32]")}
      >
        {listBuffer.items.map((item, index) => (
          <li
            key={`list-item-${elements.length}-${index}`}
            dangerouslySetInnerHTML={{ __html: renderInline(item) }}
          />
        ))}
      </Tag>,
    );
    listBuffer = null;
  };

  const flushCode = () => {
    if (!codeBuffer) {
      return;
    }
    const codeHtml = escapeHtml(codeBuffer.join("\n"));
    elements.push(
      <pre
        key={`code-${elements.length}`}
        className="overflow-x-auto rounded-[14px] bg-[#f3f4f9] px-4 py-3 text-sm text-[#2d2d32]"
      >
        <code dangerouslySetInnerHTML={{ __html: codeHtml }} />
      </pre>,
    );
    codeBuffer = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, "    ");
    const trimmed = line.trim();

    if (codeBuffer) {
      if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
        flushCode();
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (trimmed.length === 0) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      flushParagraph();
      flushList();
      codeBuffer = [];
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = Math.min(headingMatch[1]!.length, 3);
      const text = headingMatch[2] ?? "";
      const HeadingTag = ("h" + level) as "h1" | "h2" | "h3";
      const headingClasses = {
        h1: "text-2xl font-semibold text-[#1f1f24]",
        h2: "text-xl font-semibold text-[#1f1f24]",
        h3: "text-lg font-semibold text-[#1f1f24]",
      } as const;
      elements.push(
        <HeadingTag
          key={`heading-${elements.length}`}
          className={headingClasses[HeadingTag] ?? headingClasses.h3}
          dangerouslySetInnerHTML={{ __html: renderInline(text) }}
        />,
      );
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      elements.push(
        <blockquote
          key={`blockquote-${elements.length}`}
          className="border-l-2 border-[#ff7d68] pl-4 text-sm italic text-[#5a5a63]"
          dangerouslySetInnerHTML={{ __html: renderInline(quoteMatch[1] ?? "") }}
        />,
      );
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*+]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (!listBuffer || listBuffer.type !== "ul") {
        flushList();
        listBuffer = { type: "ul", items: [] };
      }
      listBuffer.items.push(bulletMatch[1] ?? "");
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (!listBuffer || listBuffer.type !== "ol") {
        flushList();
        listBuffer = { type: "ol", items: [] };
      }
      listBuffer.items.push(orderedMatch[2] ?? "");
      continue;
    }

    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushCode();

  return <div className={cn("space-y-5", className)}>{elements}</div>;
}
