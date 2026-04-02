import CardUser from "./components/card-user";
import AddBtn from "./components/Add-btn";


export default async function ClientsPage() {

    // const clinets = await adminDb.collection("clients").orderBy("createdAt", "desc").get()
    // .then(async (snapshot) => {
    //     const dossiers = await adminDb.collection("dossiers").get()
    //     const rsp = dossiers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    //     return snapshot.docs.map((doc) => ({
    //          id: doc.id, ...doc.data(), 
    //          dossiers: rsp.filter((d: any) => d.clientId === doc.id).sort((a: any, b: any) => b.createdAt - a.createdAt), 
    //         }));
    // }) as User[];

    return (
        <div className="@container/main flex flex-1 flex-col gap-2 p-4 md:gap-6 md:py-6">
            <div className="flex justify-between  gap-4 py-4 md:gap-6 md:py-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Suivi Clients</h1>
                    <p className="text-muted-foreground">Gérez vos clients</p>
                </div>
                <div className="flex gap-2">
                    <AddBtn />
                </div>
            </div>
            <div className="flex justify-center flex-wrap gap-4">
                {<CardUser />}
            </div>
        </div>
    );
}