import { signOut } from "@/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit" className="whitespace-nowrap px-3 py-2">
        Kirjaudu ulos
      </button>
    </form>
  );
}
