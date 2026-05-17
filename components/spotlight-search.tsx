"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Search,
    FolderOpen,
    Clock,
    AlertCircle,
    CheckCircle,
    User,
    ArrowRight,
    Sparkles,
    Briefcase,
    PlusCircle,
    Landmark,
} from "lucide-react";
import { useChequesStore } from "@/store/useChequesStore";
import { useDossiersStore } from "@/store/useDossiersStore";
import { useClientsStore } from "@/store/clientStore";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";



interface SearchItem {
    id: string;
    title: string;
    description: string;
    icon: ReactNode;
    category: string;
    path?: string;
    data?: any;
    badge?: string;
    badgeColor?: string;
}

// Fonction utilitaire pour gérer les statuts
const getStatutInfo = (statut?: string) => {
    const config: Record<string, { icon: ReactNode; color: string; bgColor: string; label: string }> = {
        nouveau: {
            icon: <Clock className="h-4 w-4" />,
            color: "text-yellow-500",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            label: "Nouveau"
        },
        attente_doc: {
            icon: <AlertCircle className="h-4 w-4" />,
            color: "text-orange-500",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            label: "Attente doc"
        },
        en_cours: {
            icon: <Briefcase className="h-4 w-4" />,
            color: "text-blue-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            label: "En cours"
        },
        cloture: {
            icon: <CheckCircle className="h-4 w-4" />,
            color: "text-green-500",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            label: "Clôturé"
        },
        solde: {
            icon: <Landmark className="h-4 w-4" />,
            color: "text-purple-500",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            label: "Soldé"
        },
    };

    // Valeur par défaut si le statut n'existe pas
    if (!statut || !config[statut]) {
        return {
            icon: <AlertCircle className="h-4 w-4" />,
            color: "text-gray-500",
            bgColor: "bg-gray-100 dark:bg-gray-800",
            label: statut || "Inconnu"
        };
    }

    return config[statut];
};

export function SpotlightSearch() {
    const clients = useClientsStore(s => s.clients);
    const { dossiers, setIsOpenDos } = useDossiersStore();
    const cheques = useChequesStore(s => s.cheques);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    // Référence pour l'input
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus sur l'input quand le modal s'ouvre
   useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [open]);

    // Transformer les données en items de recherche
    const searchItems = useMemo<SearchItem[]>(() => {
        const items: SearchItem[] = [];

        // 1. Ajouter les clients
        clients.forEach((client) => {
            items.push({
                id: `client-${client.id}`,
                title: client.name,
                description: `${client.email || "Email non renseigné"} • ${client.phone || "Téléphone non renseigné"} • ${client.dossiers?.length || 0} dossier(s)`,
                icon: <User className="h-5 w-5 text-blue-500" />,
                category: "Clients",
                path: `/dashboard/clients?client=${client.id}`,
                data: client,
                badge: `${client.dossiers?.length || 0} dossiers`,
                badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
            });
        });

        // 2. Ajouter les dossiers avec gestion sécurisée des statuts
        dossiers.forEach((dossier) => {
            const client = clients.find(c => c.id === dossier.clientId);
            const statutInfo = getStatutInfo(dossier.statut);
            const resteAPayer = (dossier.montant_total || 0) - (dossier.montant_paye || 0);

            items.push({
                id: `dossier-${dossier.id}`,
                title: dossier.dossierName || dossier.reference || "Sans titre",
                description: `${client?.name || "Client inconnu"} • ${dossier.type || "Type non spécifié"} • ${dossier.dateOuverture ? new Date(dossier.dateOuverture).toLocaleDateString() : "Date inconnue"}`,
                icon: <FolderOpen className="h-5 w-5 text-indigo-500" />,
                category: "Dossiers",
                path: `/dashboard/clients?client=${dossier.clientId}&dossier=${dossier.id}`,
                data: dossier,
                badge: `${statutInfo.label} • ${resteAPayer.toLocaleString()} F CFA restant`,
                badgeColor: `${statutInfo.bgColor} text-gray-700 dark:text-gray-300`,
            });
        });

        // 3. Ajouter les chèques
        cheques.forEach((cheque) => {
            const isValide = cheque.valide === true;

            items.push({
                id: `cheque-${cheque.id || Math.random()}`,
                title: `Chèque ${cheque.numero || "N° inconnu"}`,
                description: `${cheque.banque || "Banque inconnue"} • ${cheque.destinataire || "Destinataire inconnu"} • ${cheque.date ? new Date(cheque.date).toLocaleDateString() : "Date inconnue"}`,
                icon: isValide ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-yellow-500" />,
                category: "Chèques",
                path: `/dashboard/suivi-cheques?chequeId=${cheque.id}`,
                data: cheque,
                badge: `${cheque.montant?.toLocaleString() || 0} F CFA ${isValide ? "• Validé" : "• En attente"}`,
                badgeColor: isValide
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
            });
        });

        return items;
    }, [dossiers, clients, cheques]);
    
    // Filtrer les résultats
    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) {
            // Grouper les items par catégorie
            const grouped = searchItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
            }, {} as Record<string, SearchItem[]>);

            // Prendre seulement 2 éléments par catégorie
            const limitedItems: SearchItem[] = [];
            Object.keys(grouped).forEach(category => {
                const itemsToTake = grouped[category].slice(0, 2);
                limitedItems.push(...itemsToTake);
            });

            return limitedItems;
        }

        const query = searchQuery.toLowerCase();
        return searchItems.filter(
            (item) =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.badge?.toLowerCase().includes(query)
        );
    }, [searchQuery, searchItems]);

    // Vérifier s'il y a des résultats
    const hasResults = filteredItems.length > 0;

    // Grouper par catégorie
    const groupedItems = filteredItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, SearchItem[]>);

    const handleSelect = (item: SearchItem) => {
        if (item.path) {
            router.push(item.path);
        }
        setOpen(false);
        setSearchQuery("");
    };

    // Fonction pour ajouter un nouveau dossier
    const handleAddDossier = () => {
        setOpen(false);
        setSearchQuery("");
        setIsOpenDos(true);
    };

    // Raccourcis clavier
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === " " && e.metaKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }

            if (e.key === "Escape" && open) {
                e.preventDefault();
                setOpen(false);
                setSearchQuery("");
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [open]);

    return (
        <>
            {/* Bouton de recherche */}
            <button
                onClick={() => setOpen(true)}
                className="group relative inline-flex items-center gap-2 rounded-md bg-linear-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-md px-5 py-1 text-sm text-gray-700 dark:text-gray-200 border border-white/20 transition-all duration-200"
            >
                <Search className="h-4 w-4 text-indigo-500" />
                <span className="font-medium">Rechercher </span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 ml-2 px-2 py-0.5 rounded-md bg-white/20 text-xs font-mono">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            {/* Modal Spotlight sans animations */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
                    {/* Overlay sans animation */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => {
                            setOpen(false);
                            setSearchQuery("");
                        }}
                    />

                    {/* Modal sans animation */}
                    <div className="relative w-[90%] max-w-3xl rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                        <Command className="rounded-lg" shouldFilter={false}>
                            <div className="flex items-center border-b border-gray-200/50 dark:border-gray-700/50 px-3">
                                <CommandInput
                                    ref={inputRef}
                                    placeholder="Rechercher par nom, référence, montant, statut..."
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                    className="border-0 focus:ring-0 focus:outline-none h-14 text-base bg-transparent"
                                />
                            </div>

                            <CommandList className="max-h-[450px] overflow-y-auto">
                                {!hasResults && searchQuery.trim() && (
                                    <div className="py-12 text-center">
                                        <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50 text-gray-400" />
                                        <p className="text-sm text-gray-500 mb-2">
                                            Aucun résultat pour "{searchQuery}"
                                        </p>
                                        <p className="text-xs text-gray-400 mb-4">
                                            Essayez avec d'autres termes ou créez un nouveau dossier
                                        </p>
                                        <button
                                            onClick={handleAddDossier}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Ajouter un nouveau dossier
                                        </button>
                                    </div>
                                )}

                                {!hasResults && !searchQuery.trim() && (
                                    <CommandEmpty className="py-12 text-center text-gray-500">
                                        <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">Aucun élément trouvé</p>
                                        <button
                                            onClick={handleAddDossier}
                                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Créer un nouveau dossier
                                        </button>
                                    </CommandEmpty>
                                )}

                                {Object.entries(groupedItems).map(([category, items]) => (
                                    <CommandGroup key={category} heading={category} className="px-2 py-2">
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                onSelect={() => handleSelect(item)}
                                                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors group"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                                    {item.icon}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">{item.title}</span>
                                                        {item.badge && (
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.badgeColor}`}>
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate">{item.description}</p>
                                                </div>

                                                <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))}

                                {/* Message pour inviter à rechercher plus */}
                                {!searchQuery.trim() && hasResults && (
                                    <div className="px-4 py-3 text-center text-xs text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50">
                                        💡 Tapez pour voir plus de résultats
                                    </div>
                                )}
                            </CommandList>

                            <div className="border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/30">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700">⌘K</kbd>
                                            <span>Ouvrir</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700">ESC</kbd>
                                            <span>Fermer</span>
                                        </div>
                                    </div>
                                    {searchQuery.trim() && !hasResults && (
                                        <div className="text-indigo-500">
                                            Pas de résultats ?
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Command>
                    </div>
                </div>
            )}
        </>
    );
}