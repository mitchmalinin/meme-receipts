'use client'

interface HeaderProps {
  onToggleDarkMode?: () => void
}

export function Header({ onToggleDarkMode }: HeaderProps) {
  return (
    <header className="w-full  dark:border-gray-800 bg-white dark:bg-[#121212] px-6 py-4 flex justify-between items-center z-10 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-sm md:text-base font-bold tracking-widest uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-green-500">
            receipt_long
          </span>
          Meme Receipts{' '}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          <span className="relative flex h-2 w-2">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          LIVE FEED
        </div>
      </div>
    </header>
  )
}
