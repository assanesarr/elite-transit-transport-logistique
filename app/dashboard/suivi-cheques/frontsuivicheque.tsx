'use client'
import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter, Grid3x3, List, Banknote, CheckCircle, Clock } from "lucide-react";
import CheckModal from "./components/CheckModal";
import CheckTable from "./components/CheckTable";
import ConfirmModal from "./components/ConfirmModal";
import StatsBar from "./components/StatCard";
import { toast } from "sonner";
import { Commit } from "@/lib/utils";
import { useAlertStore } from "@/store/alertStore";
import { ChequeDetailModal } from "./components/AprCheque";
import { Cheque, ChequesStats, useChequesStore } from "@/store/useChequesStore";
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

// Constantes pour les statuts avec valeurs booléennes
const STATUTS_CHEQUE = {
  all: { label: "Tous statuts", color: "slate", value: null },
  non_valide: { label: "Non validés", color: "orange", value: false },
  valide: { label: "Validés", color: "green", value: true },
};

export default function SuiviCheques() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cheques, stats, setCheques } = useChequesStore();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [filtreBanque, setFiltreBanque] = useState("all");
  const [filtreStatut, setFiltreStatut] = useState<"all" | "valide" | "non_valide">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<string | undefined>();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>();
  const [viewCheque, setViewCheque] = useState<Cheque | undefined>();
  const openAlert = useAlertStore(s => s.open);

  const chequeId = searchParams.get("chequeId");

  // Récupérer le chequeId depuis l'URL
  useEffect(() => {

    if (chequeId && cheques.length > 0) {
      const targetCheque = cheques.find(c => c.id === chequeId);
      if (targetCheque) {
        setViewCheque(targetCheque);
        toast.info(`Affichage du chèque N° ${targetCheque.numero}`);
        // Optionnel: Mettre à jour les filtres pour ne montrer que ce chèque
        setSearchTerm(targetCheque.numero || "");
      }
    }
  }, [searchParams, chequeId]);

  // Filtrer les chèques
  const chequesFiltres = useMemo(() => {
    let result = [...cheques];

    // Filtre par recherche textuelle
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(cheque =>
        cheque.numero?.toLowerCase().includes(term) ||
        cheque.destinataire?.toLowerCase().includes(term) ||
        cheque.description?.toLowerCase().includes(term) ||
        cheque.montant?.toString().includes(term) ||
        cheque.banque?.toLowerCase().includes(term)
      );
    }


    // Filtre par banque
    if (filtreBanque !== "all") {
      result = result.filter(cheque =>
        cheque.banque?.toLowerCase() === filtreBanque.toLowerCase()
      );
    }

    // Filtre par statut (booléen true/false)
    if (filtreStatut === "valide") {
      result = result.filter(cheque => cheque.valide === true);
    } else if (filtreStatut === "non_valide") {
      result = result.filter(cheque => cheque.valide === false || cheque.valide === undefined);
    }

    return result;
  }, [cheques, searchTerm, filtreBanque, filtreStatut]);

  // Liste unique des banques pour le filtre
  const banquesUniques = useMemo(() => {
    const banques = new Set(cheques.map(c => c.banque).filter(Boolean));
    return Array.from(banques);
  }, [cheques]);

  const openNew = useCallback(() => {
    setEditIndex(undefined);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((c: Cheque) => {
    setEditIndex(c.id);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModalOpen(false);
    setSelectedCheque(null);
    setSelectedIndex(undefined);
  }, []);

  const handleSave = useCallback(async (data: Cheque) => {
    const method = editIndex ? "PUT" : "POST";
    const payload = editIndex ? { ...data, editId: editIndex } : data;
    const rs = await Commit("/api/suivi-cheque", payload, method);

    setCheques((prev) => {
      const exists = prev.some((p) => p.id === editIndex);
      if (exists) {
        return prev.map((p) =>
          p.id === editIndex
            ? { ...p, ...data, id: editIndex }
            : p
        );
      }
      return [...prev, { ...rs }];
    });

    toast.success(`✅ Chèque ${editIndex ? "modifié" : "ajouté"} avec succès !`);
    closeModal();
  }, [editIndex, closeModal, setCheques]);

  const handleDelete = useCallback(async (c: Cheque) => {
    const rs = await openAlert({ message: `Supprimer ce chèque N° ${c.numero}? ` });
    if (!rs) return;

    await Commit("/api/suivi-cheque", { deletedId: c.id }, 'DELETE');
    setCheques((prev) => prev.filter((p) => p.id !== c.id));
    toast.success("✅ Chèque supprimé avec succès !");
  }, [openAlert, setCheques]);

  const handleOpenConfirm = useCallback((cheque: Cheque, index: number) => {
    setSelectedCheque(cheque);
    setSelectedIndex(cheque.id);
    setConfirmModalOpen(true);
  }, []);

  const handleValidate = useCallback(async () => {
    if (!selectedIndex) return;

    await Commit("/api/suivi-cheque", { editId: selectedIndex, valide: true }, 'PUT');
    setCheques((prev) => prev.map(p => p.id === selectedIndex ? { ...p, valide: true } : p));
    toast.success("✅ Chèque validé avec succès !");
    closeConfirmModal();
  }, [selectedIndex, closeConfirmModal, setCheques]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setFiltreBanque("all");
    setFiltreStatut("all");
  }, []);

  const clearUrlParam = useCallback(() => {
    router.replace("/dashboard/suivi-cheques", { scroll: false });
    setViewCheque(undefined);
  }, [router]);

  const hasActiveFilters = searchTerm !== "" || filtreBanque !== "all" || filtreStatut !== "all";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-900 rounded-xl">
                <Banknote className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Suivi des chèques
              </h1>
            </div>
            <p className="text-sm text-slate-500 ml-12">
              Gérez et suivez l'ensemble de vos transactions bancaires
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span className="text-lg leading-none">+</span>
            Nouveau chèque
          </button>
        </div>

        {/* Stats Cards */}
        <StatsBar stats={stats} />

        {/* Barre de recherche et filtres */}
        <Card className="rounded-2xl border-slate-100 shadow-sm mb-6 backdrop-blur-sm bg-white/90">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-wrap gap-2 items-center">
              {/* Recherche */}
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Rechercher par numéro, bénéficiaire, banque..."
                  className="pl-9 h-9 text-sm rounded-xl border-slate-200 focus:border-slate-400 transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtre Banque */}
              <Select value={filtreBanque} onValueChange={setFiltreBanque}>
                <SelectTrigger className="w-40 h-9 text-xs rounded-xl border-slate-200">
                  <SelectValue placeholder="Toutes banques" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🏦 Toutes les banques</SelectItem>
                  {banquesUniques.map(banque => (
                    <SelectItem key={banque} value={banque as string}>
                      🏦 {banque}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtre Statut avec booléen */}
              <Select value={filtreStatut} onValueChange={(value: any) => setFiltreStatut(value)}>
                <SelectTrigger className="w-36 h-9 text-xs rounded-xl border-slate-200">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">📊 Tous statuts</SelectItem>
                  <SelectItem value="valide">✅ Validés</SelectItem>
                  <SelectItem value="non_valide">⏳ Non validés</SelectItem>
                </SelectContent>
              </Select>

              {/* Résultats */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {chequesFiltres.length} résultat{chequesFiltres.length > 1 ? 's' : ''}
                </span>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            {/* Badges filtres actifs */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs gap-1 px-2 py-1">
                    🔍 {searchTerm}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
                {filtreBanque !== "all" && (
                  <Badge variant="secondary" className="text-xs gap-1 px-2 py-1">
                    🏦 {filtreBanque}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                      onClick={() => setFiltreBanque("all")}
                    />
                  </Badge>
                )}
                {filtreStatut !== "all" && (
                  <Badge
                    variant="secondary"
                    className={`text-xs gap-1 px-2 py-1 ${filtreStatut === "valide" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                      }`}
                  >
                    {filtreStatut === "valide" ? "✅ Validés" : "⏳ Non validés"}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer hover:text-red-500"
                      onClick={() => setFiltreStatut("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tableau avec la vue sélectionnée */}
        <CheckTable
          cheques={chequesFiltres}
          onEdit={openEdit}
          onDelete={handleDelete}
          onOpenConfirm={handleOpenConfirm}
          onView={(cheque) => setViewCheque(cheque)}
        />
      </div>

      {/* Modaux */}
      {modalOpen && (
        <CheckModal
          initial={editIndex ? cheques.find(c => c.id === editIndex) : null}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {viewCheque && (
        <ChequeDetailModal cheque={viewCheque} onClose={() => setViewCheque(undefined)} />
      )}

      <ConfirmModal
        isOpen={confirmModalOpen}
        cheque={selectedCheque}
        onConfirm={handleValidate}
        onClose={closeConfirmModal}
      />
    </div>
  );
}