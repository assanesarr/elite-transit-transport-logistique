import { Label } from "./ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// Composant pour la sélection du dossier
export const DossierSelect = ({ dossiers, setDossier }: { dossiers: any[], setDossier: any  }) => (
    <div className="flex flex-col gap-3 w-full">
        <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Dossiers</Label>
        <Select name="dossier_name" onValueChange={setDossier}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un dossier" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {dossiers.map((dossier) => (
                        <SelectItem key={dossier.id} value={dossier.id}>
                            {dossier.dossierName}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
)