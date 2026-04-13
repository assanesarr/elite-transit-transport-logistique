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
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

// const login = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   const form = new FormData(e.currentTarget as HTMLFormElement);
//   await handleSubmit(form)
//   .catch((error) => {
//     toast.error("Login failed. Please check your credentials and try again.");
//   })
// }

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
    <form className={cn("flex flex-col gap-6", className)} {...props} action={formAction} >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            <InstallButton />
          </p>
          {state?.error && (
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>
                {state?.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email or phone</FieldLabel>
          <Input id="email" name="email" type="text" placeholder="m@example.com or 123-456-7890" autoComplete="email" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <InputGroup>
            <InputGroupInput
              id="inline-end-input"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              required
            />
            <InputGroupAddon
              align="inline-end"
              className="cursor-pointer"
              onClick={() => setShow(show => !show)}>
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupAddon>
          </InputGroup>
          {/* <Input id="password" type={show ? "text" : "password"} name="password" required /> */}
        </Field>
        <Field>
          <BtnLogin />
        </Field>
      </FieldGroup>
    </form>
  )
}

const BtnLogin = () => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="outline" className="w-full cursor-pointer disabled:opacity-50" disabled={pending}>
      {pending ? <Spinner /> : "Login"}
    </Button>
  )
}