import Image from "next/image"

export default function WaitingRoom() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
      <div className="flex-grow flex items-center justify-center">
        <Image src="/logo.svg" alt="Logo" width={100} height={100} />
      </div>
      <div className="pb-8 text-sm text-gray-500">Powered by TechArt</div>
    </div>
  )
}

