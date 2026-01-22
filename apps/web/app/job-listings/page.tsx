import { Construction } from 'lucide-react'
import { Sidebar } from '@/components/dashboard/Sidebar'

export default function JobListingsPage() {
    return (
        <div className="flex h-screen overflow-hidden selection:bg-orange-500/30 text-zinc-100 bg-zinc-900">
            <Sidebar />
            <main className="flex-1 bg-zinc-900 relative overflow-hidden flex flex-col">
                <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-sm z-10">
                    <h1 className="text-sm font-medium text-zinc-200">Job Listings</h1>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-800/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-mono text-zinc-400 tracking-tight">STORE ID: <span className="text-zinc-200">88-3921</span></span>
                    </div>
                </header>

                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto">
                            <Construction className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-100">Coming Soon</h2>
                        <p className="text-sm text-zinc-500 max-w-sm">
                            Job Listings feature is under development.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
