import { adminDb } from "@/lib/firebase-admin";
import { DataTable } from "../components/data-table";
import data from "@/app/dashboard/data.json"
import { loadClient, loadMouvement } from "@/lib/actions";



export default async function TablesPage() {



    const fetchData = await loadMouvement().then(data => data) as any[];

    // const clients = await loadClient().then(data => data);

    // Sort data by createdAt in descending order
    fetchData.sort((a, b) => b.createdAt - a.createdAt);

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <DataTable initialData={fetchData} />
            </div>
        </div>
    );
}