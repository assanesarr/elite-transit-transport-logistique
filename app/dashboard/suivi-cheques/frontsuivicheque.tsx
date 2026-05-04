// @ts-nocheck
'use client'
import { useState, useMemo } from "react";
import CheckModal from "./components/CheckModal";
import CheckTable from "./components/CheckTable";
import StatsBar from "./components/StatsBar";

export default function SuiviCheques() {
  const [cheques, setCheques] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const openNew = () => { setEditIndex(null); setModalOpen(true); };
  const openEdit = (i) => { setEditIndex(i); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  
  const handleSave = (data) => {
    setCheques((prev) => {
      if (editIndex !== null) {
        const next = [...prev];
        next[editIndex] = data;
        return next;
      }
      return [...prev, data];
    });
    closeModal();
  };

  const handleDelete = (i) => {
    if (window.confirm("Supprimer ce chèque ?")) {
      setCheques((prev) => prev.filter((_, idx) => idx !== i));
    }
  };

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return {
      total: cheques.length,
      montant: cheques.reduce((s, c) => s + Number(c.montant), 0),
      valides: cheques.filter(c => !c.validite || new Date(c.validite) >= today).length,
      expires: cheques.filter(c => c.validite && new Date(c.validite) < today).length,
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
              Registre de vos chèques émis
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-150"
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
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <CheckModal
          initial={editIndex !== null ? cheques[editIndex] : null}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
