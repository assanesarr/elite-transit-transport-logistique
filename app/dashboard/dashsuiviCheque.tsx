import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, CheckCircle, XCircle, Clock, Banknote, Eye } from 'lucide-react';
import { fmt, fmtDT } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { ChequeDetailModal } from './suivi-cheques/components/AprCheque';
import { Cheque, useChequesStore } from '@/store/useChequesStore';


// Composant principal de suivi des chèques
const ChequesSuivi = () => {
    const  {cheques, stats}  = useChequesStore();
    const [selectedCheque, setSelectedCheque] = useState<Cheque | null>(null);
    const [filter, setFilter] = useState<'all' | 'valide' | 'attente'>('all');
   

    // Filtrage des chèques
    const filteredCheques = useMemo(() => {
        if (filter === 'valide') return cheques.filter(c => c.valide);
        if (filter === 'attente') return cheques.filter(c => !c.valide);
        return cheques;
    }, [cheques, filter]);

    if (cheques.length === 0) {
        return (
            <Card className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Receipt size={16} />
                        Suivi des chèques
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Banknote className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-sm text-slate-500">Aucun chèque enregistré</p>
                        <p className="text-xs text-slate-400 mt-1">Les chèques apparaîtront ici une fois ajoutés</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="rounded-2xl border-slate-100 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Receipt size={16} />
                            Suivi des chèques
                        </CardTitle>
                        <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-2 py-1 text-xs rounded-md transition-all ${filter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Tous ({cheques.length})
                            </button>
                            <button
                                onClick={() => setFilter('valide')}
                                className={`px-2 py-1 text-xs rounded-md transition-all ${filter === 'valide' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Validés ({cheques.filter(c => c.valide).length})
                            </button>
                            <button
                                onClick={() => setFilter('attente')}
                                className={`px-2 py-1 text-xs rounded-md transition-all ${filter === 'attente' ? 'bg-white shadow-sm text-amber-700' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                En attente ({cheques.filter(c => !c.valide).length})
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Résumé des statistiques */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                            <p className="text-[10px] text-slate-500 uppercase font-semibold">Total</p>
                            <p className="text-sm font-bold text-slate-800">{fmt(stats.total)}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-2 text-center">
                            <p className="text-[10px] text-emerald-600 uppercase font-semibold">Validés</p>
                            <p className="text-sm font-bold text-emerald-700">{fmt(stats.valides)}</p>
                        </div>
                        <div className="bg-amber-50 rounded-lg p-2 text-center">
                            <p className="text-[10px] text-amber-600 uppercase font-semibold">En attente</p>
                            <p className="text-sm font-bold text-amber-700">{fmt(stats.enAttente)}</p>
                        </div>
                    </div>

                    {/* Barre de progression validation */}
                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Taux de validation</span>
                            <span className="font-semibold">{stats.tauxValidation.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${stats.tauxValidation}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Liste des derniers chèques */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {filteredCheques.slice(0, 5).map((cheque, idx) => (
                            <div
                                key={cheque.id || idx}
                                onClick={() => setSelectedCheque(cheque)}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors group ${
                                    cheque.valide 
                                        ? 'bg-slate-50 hover:bg-slate-100' 
                                        : 'bg-orange-50/50 hover:bg-orange-100/50 border border-orange-200'
                                }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xs font-medium truncate ${
                                            cheque.valide ? 'text-slate-700' : 'text-orange-800'
                                        }`}>
                                            {cheque.numero || 'Sans numéro'}
                                        </p>
                                        {cheque.valide ? (
                                            <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                                        ) : (
                                            <Clock size={12} className="text-orange-500 shrink-0" />
                                        )}
                                    </div>
                                    <div className={`flex gap-2 text-[10px] mt-0.5 ${
                                        cheque.valide ? 'text-slate-400' : 'text-orange-600'
                                    }`}>
                                        <span>{cheque.banque || 'Banque non spécifiée'}</span>
                                        {cheque.destinataire && (
                                            <>
                                                <span>•</span>
                                                <span className="truncate">{cheque.destinataire}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-2">
                                    <p className={`text-xs font-bold ${
                                        cheque.valide ? 'text-slate-800' : 'text-orange-800'
                                    }`}>
                                        {fmt(cheque.montant)}
                                    </p>
                                    <p className={`text-[10px] ${
                                        cheque.valide ? 'text-slate-400' : 'text-orange-600'
                                    }`}>
                                        {cheque.date ? new Date(cheque.date).toLocaleDateString('fr-FR') : '-'}
                                    </p>
                                </div>
                                <Eye size={14} className="text-slate-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>

                    {filteredCheques.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-sm text-slate-500">Aucun chèque dans cette catégorie</p>
                        </div>
                    )}

                    {/* Lien voir plus */}
                    {cheques.length > 5 && (
                        <button
                            onClick={() => setFilter('all')}
                            className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium pt-2"
                        >
                            Voir tous les {cheques.length} chèques →
                        </button>
                    )}
                </CardContent>
            </Card>

            {/* Modal de détail - condition d'affichage selon validation */}
            {selectedCheque && (
                <ChequeDetailModal
                    cheque={selectedCheque}
                    onClose={() => setSelectedCheque(null)}
                />
            )}
        </>
    );
};

export default ChequesSuivi;