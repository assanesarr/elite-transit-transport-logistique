"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IconPlus, IconUser, IconMail, IconPhone, IconMapPin, IconPhoto } from "@tabler/icons-react";
import { toast } from "sonner"
import { addClient } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import SaveBtn from "@/components/save-btn";
import { useSearchParams } from "next/navigation";
import CancelBtn from "@/components/cancel-btn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Composant pour le champ avec icône
const FormField = ({ 
    label, 
    name, 
    placeholder, 
    type = "text", 
    icon: Icon,
    required = false,
    error 
}: { 
    label: string; 
    name: string; 
    placeholder: string; 
    type?: string; 
    icon: any;
    required?: boolean;
    error?: string;
}) => (
    <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Icon className="h-4 w-4 text-gray-400" />
            </div>
            <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className={cn(
                    "pl-10 transition-all duration-200",
                    error && "border-red-500 focus-visible:ring-red-500"
                )}
                required={required}
            />
        </div>
        {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
    </div>
);

export default function AddClientBtn() {
    const [open, setOpen] = useState(false);
    const [state, formAction] = useFormState(addClient, null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();
    const req = searchParams.get("r");
    
    // Validation locale
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (formData: FormData) => {
        const newErrors: Record<string, string> = {};
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        
        if (!name || name.trim().length < 2) {
            newErrors.name = "Le nom doit contenir au moins 2 caractères";
        }
        
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Email invalide";
        }
        
        if (phone && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(phone)) {
            newErrors.phone = "Numéro de téléphone invalide";
        }
        
        return newErrors;
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        const validationErrors = validateForm(formData);
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            toast.error("Veuillez corriger les erreurs dans le formulaire");
            return;
        }
        
        setErrors({});
        formAction(formData);
    };

    useEffect(() => {
        if (state?.success) {
            toast.success("Client ajouté avec succès !", {
                description: "Le client a été créé dans votre base de données.",
                duration: 3000,
            });
            setOpen(false);
            setIsSubmitting(false);
            setErrors({});
        } else if (state?.error) {
            toast.error("Erreur lors de l'ajout", {
                description: state.error,
                duration: 4000,
            });
            setIsSubmitting(false);
        }
    }, [state]);

    useEffect(() => {
        if (req === "new") {
            setOpen(true);
        }
    }, [req]);

    // Réinitialiser les erreurs quand le dialogue se ferme
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setErrors({});
            setIsSubmitting(false);
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="default" 
                    size="default"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                >
                    <IconPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Ajouter un client</span>
                    <span className="sm:hidden">Ajouter</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                {state && state.error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
                    </div>
                )}
                
                <form action={handleSubmit}>
                    <DialogHeader className="pb-4 border-b">
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            Ajouter un nouveau client
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Remplissez les informations ci-dessous pour créer un nouveau client
                        </p>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-6">
                        <FormField
                            label="Nom complet"
                            name="name"
                            placeholder="Jean Dupont"
                            icon={IconUser}
                            required
                            error={errors.name}
                        />
                        
                        <FormField
                            label="Adresse"
                            name="address"
                            placeholder="19, Boulevard Djily Mbaye, Dakar"
                            icon={IconMapPin}
                            error={errors.address}
                        />
                        
                        <FormField
                            label="Téléphone"
                            name="phone"
                            placeholder="+221 78 123 45 67"
                            icon={IconPhone}
                            error={errors.phone}
                        />
                        
                        <FormField
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="client@exemple.com"
                            icon={IconMail}
                            error={errors.email}
                        />
                        
                        {/* Champ avatar amélioré */}
                        <div className="space-y-2">
                            <Label htmlFor="avatar" className="text-sm font-medium flex items-center gap-1">
                                Photo de profil
                                <span className="text-xs text-gray-400">(optionnel)</span>
                            </Label>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Avatar className="h-12 w-12 ring-2 ring-gray-200 dark:ring-gray-700">
                                        <AvatarImage src="" alt="Preview" />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                            <IconUser className="h-6 w-6" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <IconPhoto className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        id="avatar"
                                        name="avatar"
                                        type="url"
                                        placeholder="https://exemple.com/photo.jpg"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                URL de l'image de profil (format JPG, PNG ou GIF)
                            </p>
                        </div>
                    </div>
                    
                    <DialogFooter className="gap-2 pt-4 border-t">
                        <DialogClose asChild>
                            <CancelBtn disabled={isSubmitting} />
                        </DialogClose>
                        <SaveBtn disabled={isSubmitting} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}