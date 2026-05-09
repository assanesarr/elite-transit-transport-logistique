import { Input } from "./ui/input";
import { Label } from "./ui/label";

 // Composant pour les détails de chèque
export const ChequeDetails = () => (
    <div className="flex flex-col gap-3 w-full">
        <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Numéro de chèque</Label>
        <Input name="numero_cheque" placeholder="Entrez le numéro du chèque" />
    </div>
)