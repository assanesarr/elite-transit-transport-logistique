'use client'

import { Spinner } from "@/components/ui/spinner"

export default function Header() {
    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
                <h1 className="text-xl font-bold text-slate-900">Configuration</h1>
                <p className="text-slate-400 text-sm">Paramètres de l'application TransitPro</p>
            </div>
            {/* <button
                disabled={activSave}
                onClick={saveConfig}
                className="bg-slate-400 hover:bg-slate-500 text-slate-50 text-sm font-bold px-5 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-2">
                {configSaved ? <Spinner /> : "💾 Sauvegarder"}
            </button> */}
        </div>
    )
}
