"use client"
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner"
import { addClient } from "@/lib/actions";
import { use, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import SaveBtn from "@/components/save-btn";
import { useSearchParams } from "next/navigation";
import CancelBtn from "@/components/cancel-btn";


export default function AddClientBtn() {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(addClient, null)
    const searchParams = useSearchParams();
    const req = searchParams.get("r");

    useEffect(() => {
        if (state?.success) {
            toast.success("Client added successfully!");
            setOpen(false);
        } else if (state?.error) {
            toast.error("Failed to add client: " + state?.error);
        }
    }, [state]);


    useEffect(() => {
        if (req === "new") {
            setOpen(true);
        }
    }, [req])

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Ajouter Client</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                {state && state.error && <div className="text-red-500 mb-4">{state.error}</div>}
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle>Ajouter un client</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Name</Label>
                        <Input name="name" placeholder="John Doe" />
                    </div>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Adresse</Label>
                        <Input name="address" placeholder="Chatakpur-3, Dhangadhi Kailali" />
                    </div>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Phone</Label>
                        <Input name="phone" placeholder="+221 781535413" />
                    </div>
                    <div className="grid w-full items-center gap-4 py-4">
                        <Label>Email</Label>
                        <Input name="email" placeholder="m@gmail.com" />
                    </div>
                    {/* <div className="grid w-full items-center gap-4 py-4">
                        <Label>Photo URL</Label>
                        <Input name="avatar" placeholder="https://www.gravatar.com/avatar/4acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp" />
                    </div> */}
                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelBtn />
                        </DialogClose>
                        <SaveBtn />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    );
}