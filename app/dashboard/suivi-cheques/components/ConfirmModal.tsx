'use client'

import { fmtDate } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  cheque: Cheque | null;
  onConfirm: () => void;
  onClose: () => void;
}

interface Cheque {
  date?: string;
  banque?: string;
  numero?: string;
  destinataire?: string;
  montant: number;
  description?: string;
  valide?: boolean;
}

const fmtMontant = (n: number): string => {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
};

export default function ConfirmModal({ isOpen, cheque, onConfirm, onClose }: ConfirmModalProps) {
  if (!isOpen || !cheque) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              Valider le chèque
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm text-slate-600 mb-4 text-center">
            Veuillez confirmer les informations du chèque avant validation
          </p>

          {/* Récapitulatif */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs font-medium text-slate-500">N° chèque</span>
              <span className="text-sm font-mono font-semibold text-slate-800">
                {cheque.numero || "—"}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Date d'émission</span>
              <span className="text-sm text-slate-700">{fmtDate(cheque.date)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Banque</span>
              <span className="text-sm font-medium text-slate-700">{cheque.banque || "—"}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Destinataire</span>
              <span className="text-sm text-slate-700">{cheque.destinataire || "—"}</span>
            </div>
            
            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-emerald-100">
              <span className="text-sm font-semibold text-slate-700">Montant</span>
              <span className="text-xl font-bold text-emerald-600">
                {fmtMontant(cheque.montant)} FCFA
              </span>
            </div>
            
            {cheque.description && (
              <div className="flex flex-col gap-1 pt-2 border-t border-slate-200">
                <span className="text-xs font-medium text-slate-500">Description</span>
                <span className="text-sm text-slate-600">{cheque.description}</span>
              </div>
            )}
          </div>

          {/* Message d'avertissement */}
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-700">
                Cette action est irréversible. Une fois validé, le chèque ne pourra plus être modifié.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmer la validation
          </button>
        </div>
      </div>
    </div>
  );
}