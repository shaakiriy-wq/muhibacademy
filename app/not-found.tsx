import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="text-xl text-slate-400">Sahifa topilmadi</p>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Bosh sahifaga qaytish
          </Link>
        </Button>
      </div>
    </div>
  )
}
