'use client'

import { useState } from "react";
import Header from "./components/header";
import Entreprises from "./components/entreprises";
import UsersConfig from "./components/usersConfig";
import Equipe from "./components/equipe";

export default function ConfigurationsFront() {
    const [configTab, setConfigTab] = useState("entreprise");
    return (
        <div>
            <Header />
            <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 flex-wrap">
                {[
                    { key: "entreprise", icon: "🏢", label: "Entreprise" },
                    { key: "utilisateur", icon: "👤", label: "Utilisateur" },
                    { key: "preferences", icon: "🎛️", label: "Préférences" },
                    { key: "equipe", icon: "👥", label: "Équipe" },
                    { key: "listes", icon: "📋", label: "Listes & codes" },
                    { key: "permissions", icon: "🔑", label: "Permissions" },
                ].map(t => (
                    <button key={t.key} onClick={() => setConfigTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${configTab === t.key ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}>
                        <span>{t.icon}</span>{t.label}
                    </button>
                ))}
            </div>

            {configTab === "entreprise" && <Entreprises />}
            {configTab === "utilisateur" && <UsersConfig />}
            {configTab === "equipe" && <Equipe />}
        </div>
    )
}
