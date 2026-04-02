import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { RotateCcw, Save } from "lucide-react";


export default function CancelBtn({ className, ...props }: React.ComponentProps<"button">) {
    const { pending } = useFormStatus()

    return (
        <Button variant="outline" disabled={pending} className={className} {...props}>
            {pending ? <><Spinner /> Enregistrement...</> : <> <RotateCcw className="w-4 h-4" /> Annuler</>}
        </Button>
    );
}