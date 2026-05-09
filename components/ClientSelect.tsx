import { useClientsStore } from "@/store/clientStore"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"

// Composant pour la sélection du client
export const ClientSelect = ({ onValueChange, isDecaissement, onAddClient }: { onValueChange: (value: string) => void, isDecaissement: boolean, onAddClient: () => void }) => {
    const clients = useClientsStore(state => state.clients)
    
    return (
        <div className="flex flex-col gap-3 w-full">
            <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Clients</Label>
            <Select name="clients" onValueChange={onValueChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {clients && clients.length > 0 ? (
                            clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                            ))
                        ) : (
                            <SelectItem value="none" disabled>Aucun client disponible</SelectItem>
                        )}
                        {isDecaissement && <SelectItem value="OTHER">Charge Bureau</SelectItem>}
                        <Button variant="outline" size="sm" className="w-full mt-2" onClick={onAddClient}>
                            Ajouter un nouveau client
                        </Button>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}