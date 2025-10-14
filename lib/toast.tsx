"use client";

import { useEffect, useState } from "react";

export type ToastType = "default" | "success" | "error";

type ToastMessage = {
  id: number;
  content: string;
  type: ToastType;
};

type ToastState = ToastMessage & { closing: boolean };

type Listener = (message: ToastMessage) => void;

const listeners = new Set<Listener>();

function emit(content: string, type: ToastType): number {
  const message: ToastMessage = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    content,
    type,
  };

  listeners.forEach((listener) => listener(message));
  return message.id;
}

export function toast(content: string) {
  emit(content, "default");
}

toast.success = (content: string) => emit(content, "success");

toast.error = (content: string) => emit(content, "error");

type ToastContainerProps = {
  position?: "top-right" | "bottom-right" | "top-center";
  autoClose?: number;
};

export function ToastContainer({
  position = "top-center",
  autoClose = 4000,
}: ToastContainerProps) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    const handleToast: Listener = (message) => {
      setToasts((previous) => [...previous, { ...message, closing: false }]);

      const hideTimer = window.setTimeout(() => {
        setToasts((previous) =>
          previous.map((toast) =>
            toast.id === message.id ? { ...toast, closing: true } : toast,
          ),
        );

        window.setTimeout(() => {
          setToasts((previous) =>
            previous.filter((toast) => toast.id !== message.id),
          );
        }, 250);
      }, autoClose);
    };

    listeners.add(handleToast);
    return () => {
      listeners.delete(handleToast);
    };
  }, [autoClose]);

  const positionClasses =
    position === "top-right"
      ? "top-6 right-6"
      : position === "bottom-right"
      ? "bottom-6 right-6"
      : "top-6 left-1/2 -translate-x-1/2";

  return (
    <div className={`pointer-events-none fixed z-[9999] flex flex-col gap-3 ${positionClasses}`}>
      {toasts.map((toastItem) => (
        <div
          key={toastItem.id}
          className={`pointer-events-auto flex min-w-[260px] max-w-sm items-center gap-3 rounded-[14px] border px-4 py-3 text-sm shadow-lg transition ${
            toastItem.type === "success"
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
            : toastItem.type === "error"
              ? "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
              : "border-[#e4e4e7] bg-white text-[#27272a]"
          } ${toastItem.closing ? "toast-leave" : "toast-enter"}`}
        >
          <span className="font-semibold">
            {toastItem.type === "success"
              ? "Success"
              : toastItem.type === "error"
              ? "Error"
              : "Notice"}
          </span>
          <span className="text-sm leading-snug">{toastItem.content}</span>
        </div>
      ))}
    </div>
  );
}
