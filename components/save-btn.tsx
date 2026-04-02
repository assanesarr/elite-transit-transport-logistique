import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Save } from "lucide-react";


export default function SaveBtn({className, ...props}: React.ComponentProps<"button">) {
    const {pending} = useFormStatus()

    return (
        <Button type="submit" disabled={pending} className={className} {...props}>
            {pending ? <><Spinner /> Enregistrement...</> : <><Save className="w-4 h-4" />Enregistrer</>}
        </Button>
    );
}