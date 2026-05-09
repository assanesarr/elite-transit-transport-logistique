import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

export const PaymentMethodSelect = ({ onValueChange, defaultValue = "ESPECE" }: { onValueChange?: (value: string) => void, defaultValue?: string }) => (
    <Select name="payment_method" defaultValue={defaultValue} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner le mode de paiement" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>Mode de paiement</SelectLabel>
                <SelectItem value="ESPECE">ESPÈCE</SelectItem>
                <SelectItem value="ORANGE MONEY">ORANGE MONEY</SelectItem>
                <SelectItem value="WAVE">WAVE</SelectItem>
                <SelectItem value="CHEQUE">CHÈQUE</SelectItem>
                <SelectItem value="VIREMENT">VIREMENT</SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
)