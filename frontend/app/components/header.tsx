import Image from "next/image"


export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="lg:w-[60rem] mx-auto flex items-center justify-between h-16">
          <div className="flex items-center">
          <Image
            src="/turku_logo.svg"
            alt="Turku Logo"
            width={150}
            height={50}
            priority
          />
        </div>
        </div>
      </div>
    </header>
  )
}
