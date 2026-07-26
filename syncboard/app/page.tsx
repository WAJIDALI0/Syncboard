import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, PenTool, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <header className="px-6 h-16 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">S</div>
          <span className="font-bold text-xl text-white tracking-tight">SyncBoard</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-300 hover:text-white">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-white text-black hover:bg-zinc-200">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 pb-2">
            The Ultimate Tool for Synchronized Teams
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Manage tasks flawlessly and collaborate on infinite canvases in real-time. SyncBoard brings your entire workflow into one beautiful, lightning-fast application.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 bg-white text-black hover:bg-zinc-200 text-base font-semibold gap-2 w-full sm:w-auto rounded-full">
                Start for free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 border-zinc-700 text-white bg-zinc-900/50 hover:bg-zinc-800 text-base font-semibold w-full sm:w-auto rounded-full">
                Sign in to workspace
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full text-left">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <LayoutDashboard size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Real-time Tasks</h3>
            <p className="text-zinc-400 leading-relaxed">
              Create, organize, and track tasks with real-time syncing. Your team stays updated instantly without ever refreshing the page.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-4">
              <PenTool size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Canvas Whiteboard</h3>
            <p className="text-zinc-400 leading-relaxed">
              Brainstorm and wireframe with our intuitive HTML5 canvas. Complete with undo/redo logic, drawing tools, and PNG exporting.
            </p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-colors">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">Enterprise Ready</h3>
            <p className="text-zinc-400 leading-relaxed">
              Built on a solid Next.js App Router foundation, secure Supabase authentication, and highly polished UI components.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-zinc-500 text-sm z-10 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur mt-auto">
        © {new Date().getFullYear()} SyncBoard. All rights reserved.
      </footer>
    </div>
  );
}
