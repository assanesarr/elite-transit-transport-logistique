import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { AppSidebar } from "@/app/dashboard/components/app-sidebar"
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from './components/site-header';
import { db, getCollection } from '@/lib/firebase-admin';
import FinanceProvider from './FinanceProvider';
import { User } from './clients/components/card-user';
import { Dossier, EMPLOYE } from '../type';
import FooterVersionApp from '@/components/footer-version-app';

// interface Dossier {
//     id: string;
//     clientId: string;
//     createdAt: Date;
//     [key: string]: any;
// }

interface Client extends User {
    dossiers: Dossier[];
}

// 1. Récupérer tous les dossiers
async function fetchAllDossiers() {
    const snapshot = await db.dossiers()
        .orderBy("createdAt", "desc")
        .get();
    
    return snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    })) as Dossier[];
}

// 2. Récupérer tous les clients
async function fetchAllClients() {
    const snapshot = await db.clients()
        .orderBy("createdAt", "desc")
        .get();
    
    return snapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
    }));
}

// 3. UNE SEULE REQUÊTE pour tous les utilisateurs avec séparation par rôle
async function fetchUsersByRoles() {
    // Option 1: Récupérer tous les utilisateurs
    const snapshot = await db.users().get();
    
    // Option 2 (recommandée): Filtrer uniquement les rôles nécessaires
    // const snapshot = await adminDb.collection("users")
    //     .where("role", "in", ["AGENT", "admin"])
    //     .get();
    
    const agents: any[] = [];
    const employes: EMPLOYE[] = [];
    
    snapshot.docs.forEach(doc => {
        const userData = { id: doc.id, ...doc.data() } as EMPLOYE; // ou une interface User plus générique
        
        if (userData.role === "AGENT") {
            agents.push(userData);
        } else if (userData.role === "admin") {
            employes.push(userData as EMPLOYE);
        }
    });
    
    return { agents, employes };
}

// 4. Mapper les dossiers aux clients
function mapDossiersToClients(clients: any[], dossiers: Dossier[]): Client[] {
    const dossiersByClient = new Map<string, Dossier[]>();
    
    // Grouper les dossiers par clientId
    dossiers.forEach(dossier => {
        if (dossier.clientId) {
            if (!dossiersByClient.has(dossier.clientId)) {
                dossiersByClient.set(dossier.clientId, []);
            }
            dossiersByClient.get(dossier.clientId)!.push(dossier);
        }
    });
    
    // Ajouter les dossiers à chaque client
    return clients.map(client => ({
        ...client,
        dossiers: dossiersByClient.get(client.id)?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [],
    }));
}

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Authentification
    const session = await auth();
    const user = session?.user;
    
    if (!user) {
        redirect('/login');
    }
    
    // Exécuter TOUTES les requêtes en PARALLÈLE (3 requêtes au total au lieu de 5)
    const [dossiers, clientsData, { agents, employes }, cheques] = await Promise.all([
        fetchAllDossiers(),           // Requête 1
        fetchAllClients(),             // Requête 2
        fetchUsersByRoles(),           // Requête 3 (au lieu de 2)
        getCollection('suiviCheques')  // Requête 4
    ]);
    
    // Mapping client-dossier (opération locale, très rapide)
    const clients = mapDossiersToClients(clientsData, dossiers);
    
    // Cookies
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    
    return (
        <SidebarProvider
            defaultOpen={defaultOpen}
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
            } as React.CSSProperties}
        >
            <FinanceProvider
                user={user as User}
                clients={clients}
                agents={agents}
                employes={employes}
                dossiers={dossiers}
                cheques={cheques}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        {children}
                    </div>
                    <FooterVersionApp />
                </SidebarInset>
            </FinanceProvider>
        </SidebarProvider>
    );
}