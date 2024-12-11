import { signIn } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("tunnistamo");
      }}
    >
      <button className="whitespace-nowrap px-3 py-2" type="submit">
        Kirjaudu sisään
      </button>
    </form>
  );
}
