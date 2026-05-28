import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVisibilityProps = {
  isVisible?: boolean;
  transitionDuration?: number;
};

type WhatsappConfig = {
  enabled: boolean;
  phoneNumber: string;
  url: string;
  icon: string;
  position: "bottom-right" | "bottom-left";
  openInNewTab: boolean;
  ariaLabel: string;
};

type CallConfig = {
  enabled: boolean;
  phoneNumber: string;
  telLink: string;
  icon: string;
  position: "bottom-right" | "bottom-left";
  ariaLabel: string;
};

type FloatingContactButtonsProps = ButtonVisibilityProps & {
  whatsapp: WhatsappConfig;
  call: CallConfig;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8A13 13 0 0 0 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3Zm0 23.5c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 .9.9-3.9-.2-.4A10.3 10.3 0 1 1 16 26.5Zm5.7-7.6c-.3-.1-1.8-.9-2.1-1s-.5-.1-.8.2-.9 1-1 1.1-.4.2-.7.1c-2-.9-3.3-2.8-3.4-3-.2-.3 0-.5.1-.6l.5-.6c.2-.2.3-.4.4-.6.1-.2 0-.4 0-.6l-.8-1.9c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.2.2 2.2 3.4 5.3 4.7.8.3 1.4.5 1.9.6.8.2 1.6.2 2.2.1.7-.1 1.8-.8 2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.2-.6-.3Z" />
    </svg>
  );
}

function baseButtonClasses(position: "bottom-right" | "bottom-left") {
  return cn(
    "scroll-chrome-floating fixed bottom-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(218,218,218,0.18)] bg-[#1f2a2d] text-[#dadada] shadow-[0_14px_34px_-26px_rgba(39,104,100,0.9)] transition-[transform,opacity,background-color,border-color,color] duration-300 hover:-translate-y-0.5 hover:border-[#276864] hover:bg-[#276864] hover:text-[#d8c7a3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#276864]",
    position === "bottom-left" ? "left-5" : "right-5",
  );
}

export function FloatingContactButtons({
  whatsapp,
  call,
  isVisible = true,
  transitionDuration = 300,
}: FloatingContactButtonsProps) {
  const visibilityClass = isVisible
    ? "translate-y-0 opacity-100 pointer-events-auto"
    : "translate-y-6 opacity-0 pointer-events-none";

  const whatsappUrl =
    whatsapp.url || `https://wa.me/${whatsapp.phoneNumber.replace(/[^\d]/g, "")}`;
  const callUrl = call.telLink || `tel:${call.phoneNumber.replace(/\s/g, "")}`;

  return (
    <>
      {call.enabled ? (
        <a
          href={callUrl}
          aria-label={call.ariaLabel}
          className={cn(baseButtonClasses(call.position), visibilityClass)}
          style={{ transitionDuration: `${transitionDuration}ms` }}
        >
          <Phone className="h-6 w-6" />
        </a>
      ) : null}

      {whatsapp.enabled ? (
        <a
          href={whatsappUrl}
          target={whatsapp.openInNewTab ? "_blank" : undefined}
          rel={whatsapp.openInNewTab ? "noopener noreferrer" : undefined}
          aria-label={whatsapp.ariaLabel}
          className={cn(baseButtonClasses(whatsapp.position), visibilityClass)}
          style={{ transitionDuration: `${transitionDuration}ms` }}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      ) : null}
    </>
  );
}
