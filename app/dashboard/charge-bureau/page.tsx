import { getCollection } from '@/lib/firebase-admin';
import ChargesBureau from './components/chargeBureau';



export default async function PageChargeBureau() {
    const chargeBureau = await getCollection("charge_bureau")
    
    return (
         <ChargesBureau data={chargeBureau} />
    )
}

