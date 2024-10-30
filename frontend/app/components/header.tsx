import Image from "next/image"
import { SignIn } from "./auth/signin-button"
import { auth } from "@/auth"
import { SignOut } from "./auth/signout-button"


export default async function Header() {
  const session = await auth()

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="lg:w-[60rem] mx-auto flex items-center justify-between h-16">
          <div className="flex items-center">
            <Image
              src="/TAI-logo.jpg"
              alt="TAI Logo"
              width={120}
              height={40}
              priority
            />
          </div>
          {session ? <SignOut/> : <SignIn/>}
        </div>
      </div>
    </header>
  )
}
