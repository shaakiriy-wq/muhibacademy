export default function TestAdmin() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Test Admin Panel</h1>
        <p className="text-green-600">✓ Sahifa ishlayapti!</p>
        <p className="mt-4">Agar bu sahifani ko'rayotgan bo'lsangiz, routing ishlayapti.</p>
        <a href="/talimci-admin" className="mt-4 inline-block text-blue-600 underline">
          Talimci Admin ga o'tish
        </a>
      </div>
    </div>
  )
}
