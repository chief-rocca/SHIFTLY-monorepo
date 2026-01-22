import { JobPostingTemplateForm } from "@/components/job-posting-template-form"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { FilePlus } from "lucide-react"
import Link from "next/link"

export default function NewJobTemplatePage() {
    return (
        <div className="flex h-screen overflow-hidden selection:bg-orange-500/30 text-zinc-100 bg-zinc-900">
            <Sidebar />

            <main className="flex-1 bg-zinc-900 relative overflow-hidden flex flex-col">
                <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <Link href="/job-templates" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <FilePlus className="w-5 h-5" />
                        </Link>
                        <span className="text-zinc-600">/</span>
                        <h1 className="text-sm font-medium text-zinc-200">New Template</h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-800/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-mono text-zinc-400 tracking-tight">STORE ID: <span className="text-zinc-200">88-3921</span></span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Create New Template</h2>
                            <p className="text-sm text-zinc-500 mt-1">
                                Create a reusable template for your job postings.
                            </p>
                        </div>

                        <JobPostingTemplateForm />
                    </div>
                </div>
            </main>
        </div>
    )
}
