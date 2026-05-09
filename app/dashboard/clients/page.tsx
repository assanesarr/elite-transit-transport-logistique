'use client'
import CardUser from "./components/card-user";
import AddBtn from "./components/Add-btn";
import { Suspense, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileText, TrendingUp } from "lucide-react";
import { getCollection } from "@/lib/firebase-admin";
import { useClientsStore } from "@/store/clientStore";

// Composant de chargement
function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-lg" />
                ))}
            </div>
            <Skeleton className="h-12 w-full max-w-sm" />
            <Skeleton className="h-[600px] w-full rounded-lg" />
        </div>
    );
}

// Composant d'en-tête statistique (peut être rendu côté serveur)
async function StatsHeader() {
    // Vous pouvez décommenter et utiliser les données réelles ici
    const clients = useClientsStore(s => s.clients)
    // const clients = await getCollection('clients');
    // const totalClients = clients.length;
    // const totalDossiers = clients.reduce((sum, c) => sum + c.dossiers.length, 0);
    // const totalMontant = clients.reduce((sum, c) => sum + c.dossiers.reduce((s, d) => s + d.montant_total, 0), 0);

    // Données temporaires en attendant l'API
    const stats = useMemo(() => {
        const totalClients = clients.length;
        const totalDossiers = clients.reduce((sum, client) => sum + client.dossiers.length, 0);
        const totalMontant = clients.reduce((sum, client) =>
            sum + client.dossiers.reduce((s, d) => s + Number(d.montant_total || 0), 0), 0);

        return { totalClients, totalDossiers, totalMontant };
    }, [clients]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Clients</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                            {stats.totalClients}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        Actifs ce mois
                    </p>
                </div>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl p-5 border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Total Dossiers</p>
                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                            {stats.totalDossiers}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                        En cours de traitement
                    </p>
                </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl p-5 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Montant Total</p>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300 truncate">
                            {new Intl.NumberFormat("fr-FR").format(stats.totalMontant)} FCFA
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <div className="mt-2">
                    <p className="text-xs text-green-600 dark:text-green-400">
                        Chiffre d'affaires total
                    </p>
                </div>
            </div>
        </div>
    );
}

export default async function ClientsPage() {
    // Vos données commentées pour l'instant
    // const clients = await adminDb.collection("clients").orderBy("createdAt", "desc").get()
    // .then(async (snapshot) => {
    //     const dossiers = await adminDb.collection("dossiers").get()
    //     const rsp = dossiers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    //     return snapshot.docs.map((doc) => ({
    //          id: doc.id, ...doc.data(), 
    //          dossiers: rsp.filter((d: any) => d.clientId === doc.id).sort((a: any, b: any) => b.createdAt - a.createdAt), 
    //         }));
    // }) as User[];

    return (
        <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* En-tête avec titre et actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                        Suivi Clients
                    </h1>
                    <p className="text-muted-foreground">
                        Gérez vos clients et suivez leurs dossiers en temps réel
                    </p>
                </div>
                <div className="flex gap-3">
                    <AddBtn />
                </div>
            </div>

            {/* Section des statistiques avec Suspense pour le streaming */}
            <Suspense fallback={<LoadingSkeleton />}>
                <StatsHeader />
            </Suspense>

            {/* Composant principal de la table clients */}
            <div className="bg-white dark:bg-gray-950 rounded-xl border shadow-sm overflow-hidden">
                <Suspense fallback={
                    <div className="p-8">
                        <Skeleton className="h-[500px] w-full" />
                    </div>
                }>
                    <CardUser />
                </Suspense>
            </div>

            {/* Pied de page optionnel avec informations */}
            <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>Système en ligne</span>
                </div>
                <div className="flex gap-4">
                    <span>Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</span>
                    <span>Version 2.0.0</span>
                </div>
            </div>
        </div>
    );
}