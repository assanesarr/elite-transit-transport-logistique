import { useAgentsStore } from "@/store/agentStore"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"

// Composant pour la sélection de l'agent
export const AgentSelect = ({ isOther, onAddAgent }: { isOther?: boolean, onAddAgent: () => void }) => {
    const agents = useAgentsStore(state => state.agents)
    
    return (
        <div className="flex flex-col gap-3">
            <Label>Agent</Label>
            <Select name="agent">
                <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {agents && agents.length > 0 ? (
                            agents.map((agent) => (
                                <SelectItem key={agent.id} value={agent.name}>{agent.name}</SelectItem>
                            ))
                        ) : (
                            <SelectItem value="none" disabled>Aucun agent disponible</SelectItem>
                        )}
                        {isOther && <SelectItem value="OTHER">AUTRE</SelectItem>}
                        <Button variant="outline" size="sm" className="w-full mt-2" onClick={onAddAgent}>
                            Ajouter un nouvel agent
                        </Button>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}