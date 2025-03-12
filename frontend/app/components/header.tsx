import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { SignIn } from "./auth/signin-button";
import { SignOut } from "./auth/signout-button";
import HeaderMenu from "./header-menu";

export default async function Header() {
  const session = await auth();
  const useTunnistamo = process.env.USE_TUNNISTAMO;
  const useChangeLog = process.env.USE_CHANGELOG;
  const useSourceFiles = process.env.USE_SOURCE_FILES;
  const authBtn = session ? <SignOut /> : <SignIn />;

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="lg:w-[60rem] mx-auto flex items-center justify-between h-16 relative">
          <div className="flex items-center">
            <Link href="/" aria-label="Kotisivu">
              <Image
                src="/TAI-logo.jpg"
                alt="TAI Logo"
                width={120}
                height={40}
                priority
              />
            </Link>
          </div>
          <HeaderMenu
            authBtn={authBtn}
            useTunnistamo={useTunnistamo}
            useChangeLog={useChangeLog}
            useSourceFiles={useSourceFiles}
          />
        </div>
      </div>
    </header>
  );
}
