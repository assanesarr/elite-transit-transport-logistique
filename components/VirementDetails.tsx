import { useState } from "react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"

// Composant pour les détails de virement
export const VirementDetails = () => {
    const [dateVirement, setDateVirement] = useState<Date>()

    return (
        <>
            <div className="flex flex-col gap-3 w-full">
                <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Banque</Label>
                <Select name="banque">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner la banque" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Banque</SelectLabel>
                            <SelectItem value="Banque Islamique du Senegal">Banque Islamique du Sénégal</SelectItem>
                            <SelectItem value="CBAO">CBAO</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className=" flex flex-col gap-3">
                <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Date de virement</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            data-empty={!dateVirement}
                            className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateVirement ? dateVirement.toLocaleDateString("fr-FR") : "Sélectionner une date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateVirement} onSelect={setDateVirement} />
                    </PopoverContent>
                </Popover>
                <input type="hidden" name="datevirement" value={dateVirement ? dateVirement.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""} />
            </div>
            <div className="flex flex-col gap-3">
                <Label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Numéro de virement</Label>
                <Input name="numero_virement" placeholder="Entrez le numéro du virement" />
            </div>
        </>
    )
}