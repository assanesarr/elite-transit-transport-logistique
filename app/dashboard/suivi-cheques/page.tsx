import { getCollection } from '@/lib/firebase-admin'
import SuiviCheques from './frontsuivicheque'

export default async function SuiviChequPage() {
  const cheques = await getCollection('suiviCheques')
  return (
    <SuiviCheques initials={cheques as any}/>
  )
}
