import { adminDb } from "@/lib/firebase-admin";
import TableUsers from "./data-table";


export default async function SettingsPage() {

    const users = await adminDb.collection("users")
    .orderBy("createdAt", "desc")
    .get()
    .then((snapshot) => {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as 
        { id: string; name: string; role: string; email: string });
    });

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6">
                <TableUsers users={users} />
            </div>
        </div>
    );
}