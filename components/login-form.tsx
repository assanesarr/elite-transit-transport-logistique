"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { LoginSubmit } from "@/lib/actions"
import { toast } from "sonner";
import InstallButton from "./install-button"
import { useFormState, useFormStatus } from "react-dom"
import { useEffect, useState } from "react"
import { Spinner } from "./ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircleIcon, EyeIcon, EyeOffIcon, Ship, Anchor } from "lucide-react"
import { redirect } from "next/navigation"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [show, setShow] = useState(false)
  const [state, formAction] = useFormState(LoginSubmit, null)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      redirect("/dashboard");
    } else if (state?.error) {
      toast.error(state.message);
    }
  }, [state])

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} action={formAction}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Badge décoratif */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
            <Ship className="size-3 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Accès sécurisé transitaire</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white">Connexion à votre espace</h1>
          <p className="text-slate-400 text-sm text-balance">
            Accédez à votre plateforme de gestion conteneurs
          </p>
          <InstallButton />
        </div>
        
        <Field>
          <FieldLabel htmlFor="email" className="text-slate-300 text-sm font-medium">
            Email ou téléphone
          </FieldLabel>
          <Input 
            id="email" 
            name="email" 
            type="text" 
            placeholder="exemple@transitaire.com ou +33 6 12 34 56 78" 
            autoComplete="email" 
            required 
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </Field>
        
        <Field>
          <div className="flex items-center mb-1">
            <FieldLabel htmlFor="password" className="text-slate-300 text-sm font-medium">
              Mot de passe
            </FieldLabel>
            <a
              href="#"
              className="ml-auto text-xs text-blue-400 hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>
          <InputGroup>
            <InputGroupInput
              id="inline-end-input"
              type={show ? "text" : "password"}
              placeholder="Entrez votre mot de passe"
              name="password"
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white transition-colors"
              onClick={() => setShow(show => !show)}>
              {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </InputGroupAddon>
          </InputGroup>
        </Field>
        
        <Field className="mt-2">
          <BtnLogin />
        </Field>
        
        {/* Informations supplémentaires */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Ship className="size-3" /> FCL/LCL
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1">
              <Anchor className="size-3" /> Port to Port
            </span>
          </div>
          <p className="text-center text-xs text-slate-500 mt-3">
            Une assistance ? <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Contactez notre support 24/7</a>
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}

const BtnLogin = () => {
  const { pending } = useFormStatus()

  return (
    <Button 
      type="submit" 
      variant="outline" 
      className="w-full cursor-pointer disabled:opacity-50 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <Spinner className="text-white" />
          Connexion en cours...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Se connecter
          <Ship className="size-4" />
        </span>
      )}
    </Button>
  )
}