import { getCollection } from '@/lib/firebase-admin';
import ChargesBureau from './components/chargeBureau';



export default async function PageChargeBureau() {
    // const employes = await db.users()
    //     .where("role", "==", "EMPLOYE")
    //     .get()
    //     .then((snapshot) => {
    //         return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as EMPLOYE);
    //     });
    // const currentMonth = new Date().toISOString().slice(0, 7);
    const chargeBureau = await getCollection("charge_bureau")
    
    return (
         <ChargesBureau data={chargeBureau} />
    )
}

