import { CheckCircle, Clock } from "lucide-react";
import { fmt, fmtDate, fmtDT } from "@/lib/utils";
import { Cheque } from "@/store/useChequesStore";

export const ChequeDetailModal = ({ cheque, onClose }: { cheque: Cheque; onClose: () => void }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header avec couleur conditionnelle */}
            <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 ${
                cheque.valide 
                    ? 'bg-linear-to-r from-emerald-50 to-teal-50' 
                    : 'bg-linear-to-r from-orange-50 to-amber-50'
            }`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        cheque.valide ? 'bg-emerald-100' : 'bg-orange-100'
                    }`}>
                        {cheque.valide ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <Clock className="w-5 h-5 text-orange-600" />
                        )}
                    </div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        {cheque.valide ? 'Détail du chèque validé' : 'Détail du chèque non validé'}
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
                {/* Badge de statut */}
                <div className="mb-4 flex justify-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        cheque.valide 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-orange-100 text-orange-700'
                    }`}>
                        {cheque.valide ? (
                            <>
                                <CheckCircle size={12} />
                                <span>Chèque validé</span>
                            </>
                        ) : (
                            <>
                                <Clock size={12} />
                                <span>En attente de validation</span>
                            </>
                        )}
                    </div>
                </div>

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

                    <div className={`flex justify-between items-center p-3 rounded-lg border ${
                        cheque.valide 
                            ? 'bg-white border-emerald-100' 
                            : 'bg-white border-orange-100'
                    }`}>
                        <span className="text-sm font-semibold text-slate-700">Montant</span>
                        <span className={`text-xl font-bold ${
                            cheque.valide ? 'text-emerald-600' : 'text-orange-600'
                        }`}>
                            {fmt(cheque.montant)}
                        </span>
                    </div>

                    {cheque.description && (
                        <div className="flex flex-col gap-1 pt-2 border-t border-slate-200">
                            <span className="text-xs font-medium text-slate-500">Description</span>
                            <span className="text-sm text-slate-600">{cheque.description}</span>
                        </div>
                    )}
                </div>

                {/* Message spécifique pour chèque non validé */}
                {!cheque.valide && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-xs text-orange-700 flex items-center gap-2">
                            <Clock size={14} />
                            Ce chèque est en attente de validation. Veuillez vérifier les informations avant validation.
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
                >
                    Fermer
                </button>
            </div>
        </div>
    </div>
);