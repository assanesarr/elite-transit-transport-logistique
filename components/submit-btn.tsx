
import { useFormStatus } from "react-dom"
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            disabled={pending}
            className="disabled:opacity-50"
        >
            {pending ? <Spinner /> : "Enregistrer"}
        </Button>
    )
}