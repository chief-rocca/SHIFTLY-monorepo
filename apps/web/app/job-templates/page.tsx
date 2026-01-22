"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { supabase } from '@/lib/supabase'
import {
    FilePlus,
    Plus,
    MoreVertical,
    Pencil,
    Copy,
    Trash2,
    MapPin,
    ChevronLeft,
    ChevronRight,
    FileText,
    Briefcase
} from 'lucide-react'
import { toast } from 'sonner'

interface Template {
    id: string
    job_title: string
    location_work_environment: string
    industry: string
    occupation: string
    job_description: string
    emergency_contact: string
    auto_message: string
    created_at: string
}

const ITEMS_PER_PAGE = 10

export default function JobTemplatesGallery() {
    const [templates, setTemplates] = useState<Template[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const loaderRef = useRef<HTMLDivElement>(null)

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    const fetchTemplates = useCallback(async (page: number, append = false) => {
        setLoading(true)
        const from = (page - 1) * ITEMS_PER_PAGE
        const to = from + ITEMS_PER_PAGE - 1

        const { data, error, count } = await supabase
            .from('job_posting_templates')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        if (!error && data) {
            if (append) {
                setTemplates(prev => [...prev, ...data])
            } else {
                setTemplates(data)
            }
            if (count !== null) setTotalCount(count)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchTemplates(1)
    }, [fetchTemplates])

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !loading && currentPage < totalPages) {
                    const nextPage = currentPage + 1
                    setCurrentPage(nextPage)
                    fetchTemplates(nextPage, true)
                }
            },
            { threshold: 0.1 }
        )

        if (loaderRef.current) {
            observer.observe(loaderRef.current)
        }

        return () => observer.disconnect()
    }, [loading, currentPage, totalPages, fetchTemplates])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        fetchTemplates(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCopyText = async (template: Template) => {
        const text = `Job Title: ${template.job_title}
Industry: ${template.industry}
Occupation: ${template.occupation}
Location: ${template.location_work_environment}
Description: ${template.job_description}
Emergency Contact: ${template.emergency_contact}
Auto Message: ${template.auto_message || 'N/A'}`

        await navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard', { description: 'Template details copied' })
        setOpenDropdown(null)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            await supabase.from('job_posting_templates').delete().eq('id', id)
            toast.success('Template deleted')
            fetchTemplates(currentPage)
        }
        setOpenDropdown(null)
    }

    return (
        <div className="flex h-screen overflow-hidden selection:bg-orange-500/30 text-zinc-100 bg-zinc-900">
            <Sidebar />

            <main className="flex-1 bg-zinc-900 relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <FilePlus className="w-5 h-5 text-orange-500" />
                        <h1 className="text-sm font-medium text-zinc-200">Job Posting Templates</h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-800/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-mono text-zinc-400 tracking-tight">STORE ID: <span className="text-zinc-200">88-3921</span></span>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Top Bar: Create Button + Pagination */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                {/* Pagination - Left */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="p-1.5 rounded-md border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const page = i + 1
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-8 h-8 text-sm rounded-md border transition-colors ${currentPage === page
                                                        ? 'bg-orange-500 border-orange-500 text-white'
                                                        : 'border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/60'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        })}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="p-1.5 rounded-md border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/60 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {/* Pagination Meta - Right of pagination */}
                                {totalCount > 0 && (
                                    <span className="text-xs text-zinc-500">
                                        Page {currentPage} of {totalPages} • {ITEMS_PER_PAGE} per page
                                    </span>
                                )}
                            </div>

                            {/* Create New Template Button - Top Right */}
                            <Link
                                href="/job-templates/new"
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Template
                            </Link>
                        </div>

                        {/* Templates List */}
                        {templates.length === 0 && !loading ? (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-zinc-500" />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-200 mb-2">No templates yet</h3>
                                <p className="text-sm text-zinc-500 mb-4">Create your first job posting template to get started.</p>
                                <Link
                                    href="/job-templates/new"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Template
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="relative flex gap-4 p-4 rounded-xl border border-zinc-800/60 bg-zinc-800/30 hover:border-zinc-700 transition-colors"
                                    >
                                        {/* Placeholder Image */}
                                        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-zinc-700/50">
                                            <Image
                                                src="/logo.png"
                                                alt="Template"
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>

                                        {/* Template Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Link
                                                        href={`/job-templates/${template.id}`}
                                                        className="text-base font-medium text-zinc-100 hover:text-orange-400 transition-colors"
                                                    >
                                                        {template.job_title}
                                                    </Link>
                                                    <div className="flex items-center gap-1.5 mt-1 text-sm text-zinc-500">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="line-clamp-1">{template.location_work_environment || 'No location specified'}</span>
                                                    </div>
                                                </div>

                                                {/* Dropdown Menu */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenDropdown(openDropdown === template.id ? null : template.id)}
                                                        className="p-1.5 rounded-md hover:bg-zinc-700/50 transition-colors"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                                                    </button>
                                                    {openDropdown === template.id && (
                                                        <div className="absolute right-0 mt-1 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10">
                                                            <Link
                                                                href={`/job-templates/${template.id}/edit`}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50 transition-colors rounded-t-lg"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                                Edit Template
                                                            </Link>
                                                            <button
                                                                onClick={() => handleCopyText(template)}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700/50 transition-colors"
                                                            >
                                                                <Copy className="w-4 h-4" />
                                                                Copy Template Text
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(template.id)}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-zinc-700/50 transition-colors rounded-b-lg"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete Template
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-700/50 text-zinc-400 capitalize">
                                                    {template.industry}
                                                </span>
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-700/50 text-zinc-400 capitalize">
                                                    {template.occupation}
                                                </span>
                                            </div>

                                            {/* Create Job Button - Bottom Right */}
                                            <div className="flex justify-end mt-3">
                                                <Link
                                                    href={`/job-templates/${template.id}/create-job`}
                                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-orange-400 border border-orange-500/50 rounded-md hover:bg-orange-500/10 transition-colors"
                                                >
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    Create a Job from this template
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Infinite Scroll Loader */}
                        {templates.length > 0 && currentPage < totalPages && (
                            <div ref={loaderRef} className="py-8 text-center">
                                {loading && (
                                    <div className="text-sm text-zinc-500">Loading more templates...</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
