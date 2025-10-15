"use client";

import { useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type MarkdownEditorProps = {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
};

type Command =
  | { key: string; icon: string; prefix: string; suffix: string }
  | { key: string; icon: string; action: "noop" };

const commands: Command[] = [
  { key: "heading", icon: "fa-solid fa-heading", prefix: "## ", suffix: "" },
  { key: "bold", icon: "fa-solid fa-bold", prefix: "**", suffix: "**" },
  { key: "italic", icon: "fa-solid fa-italic", prefix: "*", suffix: "*" },
  { key: "strike", icon: "fa-solid fa-strikethrough", prefix: "~~", suffix: "~~" },
  { key: "code", icon: "fa-solid fa-code", prefix: "```,\n", suffix: "\n```" },
  { key: "quote", icon: "fa-solid fa-quote-right", prefix: "> ", suffix: "" },
  { key: "bullet", icon: "fa-solid fa-list-ul", prefix: "- ", suffix: "" },
  { key: "number", icon: "fa-solid fa-list-ol", prefix: "1. ", suffix: "" },
  { key: "link", icon: "fa-solid fa-link", prefix: "[", suffix: "](url)" },
  { key: "preview", icon: "fa-solid fa-eye", action: "noop" },
  { key: "help", icon: "fa-solid fa-circle-question", action: "noop" },
];

export function MarkdownEditor({
  value,
  defaultValue = "",
  placeholder,
  onChange,
  className,
}: MarkdownEditorProps) {
  const isControlled = typeof value === "string";
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const grouped = useMemo(() => commands, []);

  const currentValue = isControlled ? value ?? "" : uncontrolledValue;

  const setNextValue = (next: string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onChange?.(next);
  };

  const applyMarkup = (command: Command) => {
    if ("action" in command) {
      if (command.key === "help") {
        window?.open("https://www.markdownguide.org/basic-syntax/", "_blank");
      }
      return;
    }

    const { prefix, suffix } = command;
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd, value: textAreaValue } = textarea;
    const selected = textAreaValue.slice(selectionStart, selectionEnd);
    const next =
      textAreaValue.slice(0, selectionStart) +
      `${prefix}${selected}${suffix}` +
      textAreaValue.slice(selectionEnd);
    const cursorPosition = selectionStart + prefix.length + selected.length + suffix.length;
    setNextValue(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  return (
    <div className={cn("rounded-[10px] border border-[#e0e0e6] bg-white", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-[#ededf0] px-4 py-3 text-xs font-semibold text-[#7a7a87]">
        {grouped.map((command) => (
          <button
            key={command.key}
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-sm font-semibold text-[#6c6c75] transition hover:border-[#dfe0e8] hover:bg-[#f4f4f7]"
            onClick={() => applyMarkup(command)}
            aria-label={command.key}
          >
            <i className={`${command.icon} text-[15px]`} aria-hidden="true" />
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={currentValue}
        onChange={(event) => {
          setNextValue(event.target.value);
        }}
        placeholder={placeholder}
        rows={8}
        className="h-72 w-full rounded-[10px] rounded-t-none border-0 px-5 py-4 text-sm leading-relaxed text-[#2d2d32] placeholder:text-[#b0b0b5] focus:outline-none"
      />
    </div>
  );
}
