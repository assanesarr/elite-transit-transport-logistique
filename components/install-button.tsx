"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";

export default function InstallButton() {
  const { canInstall, install } = usePWAInstall();

   if (!canInstall) return null;

  return (
    <button
      onClick={install}
      className="px-4 py-2 rounded bg-black text-white"
    >
      Installer l’application
    </button>
  );
}
