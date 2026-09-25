"use client";

import { COURSE } from "@/lib/routes";
import { tt } from "@/lib/lang";


export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-paper print:hidden">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6 md:px-6">
        <p className="max-w-prose text-caption text-ash">
          {tt(
            `${COURSE.title} — ${COURSE.module}. Every company in the cases is fictional, for training use. Your work is saved in this browser only; nothing leaves your device.`,
            "Kundenbindung und Kaufverhalten im B2B-IT-Vertrieb — Modul 1, Tag 2 von 2. Alle Unternehmen in den Fällen sind fiktiv und dienen nur dem Training. Ihre Arbeit wird nur in diesem Browser gespeichert; nichts verlässt Ihr Gerät.",
          )}
        </p>
      </div>
    </footer>
  );
}
