'use client'
import { useState, useMemo, useCallback } from "react";
import CheckModal from "./components/CheckModal";
import CheckTable from "./components/CheckTable";
import ConfirmModal from "./components/ConfirmModal";
import StatsBar from "./components/StatCard";
import { toast } from "sonner";
import { Commit } from "@/lib/utils";
import { useAlertStore } from "@/store/alertStore";
import { ChequeDetailModal } from "./components/AprCheque";

export interface Cheque {
  id?: string;
  date?: string;
  banque?: string;
  numero?: string;
  destinataire?: string;
  montant: number;
  description?: string;
  valide?: boolean;
}

export default function SuiviCheques({ initials }: { initials: Cheque[] }) {
  const [cheques, setCheques] = useState<Cheque[]>([...initials]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<string | undefined>();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<string | undefined>();
  const [viewCheque, setViewCheque] = useState<Cheque | undefined>()
  const openAlert = useAlertStore(s => s.open)

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

    const method = editIndex ? "PUT" : "POST"
    const payload = editIndex ? { ...data, editId: editIndex } : data
    const rs = await Commit("/api/suivi-cheque", payload, method)
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
    toast.success("✅ Chèque validé avec succès !");
    closeModal();
  }, [editIndex, closeModal]);

  const handleDelete = useCallback(async (c: Cheque) => {
    const rs = await openAlert({ message: `Supprimer ce chèque N° ${c.numero}? ` })
    if (!rs) return

    await Commit("/api/suivi-cheque", { deletedId: c.id }, 'DELETE')
    setCheques((prev) => prev.filter((p) => p.id !== c.id));
    toast.success("✅ Chèque supprime avec succès !")
  }, []);

  const handleOpenConfirm = useCallback((cheque: Cheque, index: number) => {
    setSelectedCheque(cheque);
    setSelectedIndex(cheque.id);
    setConfirmModalOpen(true);
  }, []);

  const handleValidate = useCallback(async () => {
    if (!selectedIndex) return

    console.log(selectedIndex)
    await Commit("/api/suivi-cheque", { editId: selectedIndex, valide: true }, 'PUT')
    setCheques((prev) => prev.map(p => p.id === selectedIndex ? { ...p, valide: true } : p));
    toast.success("✅ Chèque validé avec succès !");
    closeConfirmModal();

  }, [selectedIndex, closeConfirmModal]);

  const stats = useMemo(() => {
    const total = cheques.length;
    const montantTotal = cheques.reduce((s, c) => s + Number(c.montant), 0);
    const montantValide = cheques
      .filter(c => c.valide)
      .reduce((s, c) => s + Number(c.montant), 0);
    const montantEnAttente = cheques
      .filter(c => !c.valide)
      .reduce((s, c) => s + Number(c.montant), 0);
    const tauxValidation = total > 0 ? (montantValide / montantTotal) * 100 : 0;

    return {
      total,
      montant: montantTotal,
      valides: cheques.filter(c => c.valide).length,
      enAttente: cheques.filter(c => !c.valide).length,
      montantValide,
      montantEnAttente,
      tauxValidation: Math.round(tauxValidation),
    };
  }, [cheques]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
              Suivi des chèques
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Registre de vos chèques émis et validés
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 font- bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm hover:shadow-md"
          >
            <span className="text-lg leading-none">+</span>
            Nouveau chèque
          </button>
        </div>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Table */}
        <CheckTable
          cheques={cheques}
          onEdit={openEdit}
          onDelete={handleDelete}
          onOpenConfirm={handleOpenConfirm}
          onView={(cheque) => setViewCheque(cheque)}
        />
      </div>

      {/* Modal d'édition */}
      {modalOpen && (
        <CheckModal
          initial={editIndex ? cheques.find(c => c.id === editIndex) : null}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
      
      {viewCheque && <ChequeDetailModal cheque={viewCheque} onClose={() => setViewCheque(undefined)}/>}

      {/* Modal de confirmation de validation */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        cheque={selectedCheque}
        onConfirm={handleValidate}
        onClose={closeConfirmModal}
      />
    </div>
  );
}