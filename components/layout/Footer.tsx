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
      <a
        href="https://x.com/0xMrWzrd"
        target="_blank"
        rel="noopener noreferrer"
        className="uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-green-500 transition-all flex items-center gap-1.5"
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Mr.WZRD
      </a>
    </footer>
  )
}
