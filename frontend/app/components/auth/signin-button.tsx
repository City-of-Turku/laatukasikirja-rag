import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("tunnistamo")
      }}
    >
      <button type="submit">Kirjaudu sisään</button>
    </form>
  )
}