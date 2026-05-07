import { cn } from "@/lib/utils";

type WhatsappFloatingButtonProps = {
  config: {
    enabled: boolean;
    phoneNumber: string;
    url: string;
    icon: string;
    position: "bottom-right" | "bottom-left";
    openInNewTab: boolean;
    ariaLabel: string;
  };
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

export function WhatsappFloatingButton({ config }: WhatsappFloatingButtonProps) {
  if (!config.enabled) {
    return null;
  }

  const url = config.url || `https://wa.me/${config.phoneNumber.replace(/[^\d]/g, "")}`;
  const positionClass =
    config.position === "bottom-left" ? "left-5" : "right-5";

  return (
    <a
      href={url}
      target={config.openInNewTab ? "_blank" : undefined}
      rel={config.openInNewTab ? "noopener noreferrer" : undefined}
      aria-label={config.ariaLabel}
      className={cn(
        "fixed bottom-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#276864]/40 bg-[#0f1418]/90 text-[#66fcf1] backdrop-blur-sm shadow-[0_0_30px_-14px_rgba(102,252,241,0.85)] transition duration-300 hover:scale-105 hover:border-[#66fcf1]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66fcf1]",
        positionClass,
      )}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}

