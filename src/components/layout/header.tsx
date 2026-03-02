"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Bell, Search, LogIn } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between glass border-b border-white/10 px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative hidden md:block w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
          <input
            type="text"
            placeholder="Cari analisa data..."
            className="h-9 w-full rounded-xl border border-slate-200/50 bg-slate-50/50 pl-11 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-violet-600 transition-all active:scale-90">
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500 border-2 border-white animate-pulse"></span>
        </button>
        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
        
        <SignedIn>
          <div className="flex items-center gap-3 pl-2">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 rounded-xl ring-2 ring-violet-500/10 hover:ring-violet-500/30 transition-all shadow-sm"
                }
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-black hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95">
              <LogIn className="h-4 w-4" />
              Masuk
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </header>
  );
}
