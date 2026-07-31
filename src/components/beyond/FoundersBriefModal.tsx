"use client";

import { useEffect } from "react";
import { FoundersBriefForm } from "./FoundersBriefForm";
import { beyondContent } from "@/content/beyond-content";

interface Props {
  open: boolean;
  onClose: () => void;
  source?: string;
}

export function FoundersBriefModal({ open, onClose, source = "landing_modal" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="bts-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="bts-modal bts-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bts-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="bts-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="bts-form-wrap">
          <div className="bts-form-heading">
            <h2 id="bts-modal-title">{beyondContent.formTitle}</h2>
            <span className="bts-free-badge">{beyondContent.formBadge}</span>
          </div>
        </div>
        <FoundersBriefForm source={source} showHeading={false} />
      </div>
    </div>
  );
}
