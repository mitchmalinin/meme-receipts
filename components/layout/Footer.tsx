'use client'

export function Footer() {
  return (
    <footer className="bg-black text-white text-[10px] md:text-xs py-2 px-6 flex justify-between items-center font-mono border-t border-gray-800 shrink-0">
      <div className="flex gap-4">
        <span className="opacity-50">SYSTEM STATUS: ONLINE</span>
        <span className="text-green-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          CONNECTED
        </span>
      </div>
      <div className="uppercase tracking-widest opacity-50">Mr.WZRD</div>
    </footer>
  )
}
