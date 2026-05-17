import { useState } from 'react';
import { fmtDT } from '@/lib/utils';
import { Eye, CheckCircle, Clock, Edit2, Trash2, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Cheque {
  date?: string;
  banque?: string;
  numero?: string;
  destinataire?: string;
  montant: number;
  description?: string;
  valide?: boolean; // Ajout du champ de validation
  createdAt?: string;
}

interface CheckTableProps {
  cheques: Cheque[];
  onEdit: (index: Cheque) => void;
  onDelete: (index: Cheque) => void;
  onValidate?: (index: number) => void;
  onOpenConfirm?: (cheque: Cheque, index: number) => void;
  onView?: (cheque: Cheque) => void; // Nouvelle prop pour la vue
}

const fmt = (n: number): string => new Intl.NumberFormat("fr-FR").format(Math.round(n));

const fmtDate = (s?: string): string => {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

function StatusBadge({ valide }: { valide?: boolean }) {
  if (valide === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
        <Clock size={10} className="mr-1" />
        En attente
      </span>
    );
  }

  if (valide) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
        <CheckCircle size={10} className="mr-1" />
        Validé
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
      <Clock size={10} className="mr-1" />
      En cours
    </span>
  );
}

export default function CheckTable({ cheques, onEdit, onDelete, onOpenConfirm, onView }: CheckTableProps) {
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Nombre d'éléments par page

  // Trier les chèques par date de création (du plus récent au plus ancien)
  const sortedCheques = [...cheques].sort((a, b) => 
    new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime()
  );

  // Calculer les indices de pagination
  const totalItems = sortedCheques.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCheques = sortedCheques.slice(startIndex, endIndex);

  // Fonctions de navigation
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (cheques.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="text-4xl mb-3">🗒️</div>
          <p className="text-sm">Aucun chèque enregistré.</p>
          <p className="text-xs mt-1">
            Cliquez sur « Nouveau chèque » pour commencer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 w-24 whitespace-nowrap">
                  Date d'émission
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 w-28">
                  Banque
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 w-28">
                  N° chèque
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Destinataire
                </th>
                <th className="px-4 py-3 text-xs font-medium text-slate-500 w-32 text-center">
                  Montant
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                  Description
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 w-28">
                  Statut
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 w-32">
                  Actions
                </th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentCheques.map((c, i) => {
                const originalIndex = sortedCheques.findIndex(
                  (cheque) => cheque === c
                );
                return (
                  <tr
                    key={originalIndex}
                    className={`hover:bg-slate-50 transition-colors duration-100 ${
                      c.valide ? 'bg-emerald-50/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs ">
                      {c.date}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                      {c.banque}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {c.numero}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{c.destinataire}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                      {fmt(c.montant)} FCFA
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate whitespace-nowrap">
                      {c.description || "—"}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <StatusBadge valide={c.valide} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* Bouton View (Eye) pour les chèques validés */}
                        {c.valide && onView && (
                          <button
                            onClick={() => onView(c)}
                            className="p-1.5 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors group relative"
                            title="Voir les détails"
                          >
                            <Eye size={16} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Voir détails
                            </span>
                          </button>
                        )}

                        {/* Bouton de validation pour les chèques non validés */}
                        {onOpenConfirm && !c.valide && (
                          <button
                            onClick={() => onOpenConfirm(c, originalIndex)}
                            className="p-1.5 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors group relative"
                            title="Valider le chèque"
                          >
                            <Check size={16} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Valider
                            </span>
                          </button>
                        )}

                        {/* Bouton de modification - uniquement pour chèques non validés */}
                        {!c.valide && (
                          <button
                            onClick={() => onEdit(c)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors group relative"
                            title="Modifier"
                          >
                            <Edit2 size={14} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              Modifier
                            </span>
                          </button>
                        )}

                        {/* Bouton de suppression - toujours visible */}
                        <button
                          onClick={() => onDelete(c)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors group relative"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Supprimer
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl">
          <div className="text-sm text-slate-500">
            Affichage de {startIndex + 1} à {Math.min(endIndex, totalItems)} sur {totalItems} chèques
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md transition-colors ${
                currentPage === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && goToPage(page)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : page === '...'
                      ? 'text-slate-400 cursor-default'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}