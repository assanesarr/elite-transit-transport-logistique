"use client"
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AddUser } from "./add-user";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { deleteUser, updateUser } from "@/lib/actions";
import { useFormState, useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

export default function TableUsers(
    { users }:
        {
            users: Array<{
                id: string;
                name: string;
                role: string;
                email: string
            }>
        }) {
    const [state, formAction] = useFormState(deleteUser, null)
    const [edit, setEdit] = useState<string | null>(null)
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle input change for editing user name
        if (edit) {
            setName(e.target.value)
            // console.log(`Updating user ${edit} with new name: ${e.target.value}`);
        }
    }

    const handleClick = (userId: string) => {
        
        if (edit === userId) {
            if (!name && !email) return setEdit(null);
            // Update user name in database
            const formData = new FormData();
            formData.append("id", userId);
            formData.append("name", name);
            formData.append("email", email);
            updateUser(null, formData)
                .then((response) => {
                    if (response.success) {
                        toast.success("User updated successfully!");
                    } else {
                        toast.error("Failed to update user: " + response.message);
                    }
                })
                .catch((error) => {
                    toast.error("An error occurred while updating user: " + error.message);
                });
            setEdit(null); // Exit edit mode after saving
        } else {
            setEdit(userId); // Enter edit mode for the selected user
        }
    }


    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.error) {
            toast.error(state.message);
        }
    }, [state])

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">
                        Gérer les utilisateurs et leurs rôles.</p>
                </div>
                <AddUser />
            </div>
            <Table>
                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                <TableHeader>
                    <TableRow>
                        <TableHead >Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium capitalize">
                                {edit === user.id ? <Input defaultValue={user.name} name="name" onChange={handleChange} /> : user.name}
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{edit === user.id ? <Input defaultValue={user.email} name="email" onChange={(e) => setEmail(e.target.value)} /> : user.email}</TableCell>
                            <TableCell className="text-right flex gap-2 justify-end">
                                <Button variant="outline" size="icon" onClick={() => {
                                    // if (user.name === name && user.email === email) return setEdit(null);
                                    handleClick(user.id)
                                }}>
                                    {edit === user.id ? <Save className="w-4 h-4" /> : <IconEdit />}
                                </Button>
                                <form action={formAction}>
                                    <input type="hidden" name="id" value={user.id} />
                                    <DeleteButton />
                                </form>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

const DeleteButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button variant="outline" size="icon" >
            {pending ? <Spinner /> : (
                <>
                    <span className="sr-only">Delete</span>
                    <IconTrash className="text-red-500" />
                </>
            )}
        </Button>
    )
}