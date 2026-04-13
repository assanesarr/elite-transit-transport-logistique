import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import { AppSidebar } from "@/app/dashboard/components/app-sidebar"
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from './components/site-header';
import { adminDb } from '@/lib/firebase-admin';
import FinanceProvider from './FinanceProvider';
import { User } from './clients/components/card-user';
import { EMPLOYE } from '../type';

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = (await auth())?.user;
    // const clinets = await adminDb.collection("clients").orderBy("createdAt").get()
    //     .then((snapshot) => {
    //         return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //     }) as any[];

    const clinets = await adminDb.collection("clients").orderBy("createdAt", "desc").get()
        .then(async (snapshot) => {
            const dossiers = await adminDb.collection("dossiers").get()
            const rsp = dossiers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            return snapshot.docs.map((doc) => ({
                id: doc.id, ...doc.data(),
                dossiers: rsp.filter((d: any) => d.clientId === doc.id).sort((a: any, b: any) => b.createdAt - a.createdAt),
            }));
        }) as User[];

    const agents = await adminDb.collection("users").where("role", "==", "AGENT").get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }) as any[];
        
    const employes = await adminDb.collection("users").where("role", "==", "EMPLOYE").get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }) as EMPLOYE[];

    const mouvements = await adminDb.collection("mouvement").orderBy("createdAt", "desc").get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        });


    if (!user) {
        redirect('/login');
    }

    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"



    return (
        <SidebarProvider
            defaultOpen={defaultOpen}
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties
            }
        >
            <FinanceProvider
                initialData={mouvements}
                user={user as User}
                clients={clinets}
                agents={agents}
                employes={employes}
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">{children}</div>
                </SidebarInset>
            </FinanceProvider>
        </SidebarProvider>
    );
}
