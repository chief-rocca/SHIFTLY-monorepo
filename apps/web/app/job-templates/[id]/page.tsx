"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { supabase } from '@/lib/supabase'
import {
    FilePlus,
    ArrowLeft,
    MapPin,
    Briefcase,
    Pencil,
    CheckCircle2,
    AlertCircle,
    FileText,
    Users,
    MessageSquare
} from 'lucide-react'

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
    updated_at: string
}

interface Benefit {
    id: string
    benefit_type: string
}

interface BringWithItem {
    id: string
    item: string
    order_index: number
}

interface EligibilityCriterion {
    id: string
    criterion: string
    order_index: number
}

export default function TemplateDetailPage() {
    const params = useParams()
    const [template, setTemplate] = useState<Template | null>(null)
    const [benefits, setBenefits] = useState<Benefit[]>([])
    const [bringWithItems, setBringWithItems] = useState<BringWithItem[]>([])
    const [eligibilityCriteria, setEligibilityCriteria] = useState<EligibilityCriterion[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTemplate() {
            const id = params.id as string

            const [templateRes, benefitsRes, bringWithRes, criteriaRes] = await Promise.all([
                supabase.from('job_posting_templates').select('*').eq('id', id).single(),
                supabase.from('template_benefits').select('*').eq('template_id', id),
                supabase.from('template_bring_with_items').select('*').eq('template_id', id).order('order_index'),
                supabase.from('template_eligibility_criteria').select('*').eq('template_id', id).order('order_index'),
            ])

            if (templateRes.data) setTemplate(templateRes.data)
            if (benefitsRes.data) setBenefits(benefitsRes.data)
            if (bringWithRes.data) setBringWithItems(bringWithRes.data)
            if (criteriaRes.data) setEligibilityCriteria(criteriaRes.data)

            setLoading(false)
        }

        fetchTemplate()
    }, [params.id])

    const benefitLabels: Record<string, string> = {
        'no_experience': 'No Experience Required',
        'no_uniform': 'No Uniform',
        'food_provided': 'Food Provided',
        'parking': 'Parking Available',
        'discount': 'Employee Discount'
    }

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden text-zinc-100 bg-zinc-900">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-zinc-500">Loading...</div>
                </main>
            </div>
        )
    }

    if (!template) {
        return (
            <div className="flex h-screen overflow-hidden text-zinc-100 bg-zinc-900">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                        <h2 className="text-lg font-medium text-zinc-200">Template not found</h2>
                        <Link href="/job-templates" className="text-orange-400 hover:underline mt-2 inline-block">
                            Back to templates
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex h-screen overflow-hidden selection:bg-orange-500/30 text-zinc-100 bg-zinc-900">
            <Sidebar />

            <main className="flex-1 bg-zinc-900 relative overflow-hidden flex flex-col">
                {/* Header */}
                <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <Link href="/job-templates" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <FilePlus className="w-5 h-5 text-orange-500" />
                        <h1 className="text-sm font-medium text-zinc-200">Template Details</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/job-templates/${template.id}/edit`}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-zinc-700 rounded-md hover:bg-zinc-800/50 transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Link>
                        <Link
                            href={`/job-templates/${template.id}/create-job`}
                            className="flex items-center gap-2 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors"
                        >
                            <Briefcase className="w-4 h-4" />
                            Create Job
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Hero Section */}
                        <div className="flex gap-6 mb-8">
                            <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-zinc-700/50">
                                <Image
                                    src="/logo.png"
                                    alt="Template"
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-zinc-100">{template.job_title}</h2>
                                <div className="flex items-center gap-1.5 mt-2 text-sm text-zinc-400">
                                    <MapPin className="w-4 h-4" />
                                    <span>{template.location_work_environment || 'No location specified'}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="px-3 py-1 text-xs rounded-full bg-zinc-700/50 text-zinc-300 capitalize">
                                        {template.industry}
                                    </span>
                                    <span className="px-3 py-1 text-xs rounded-full bg-zinc-700/50 text-zinc-300 capitalize">
                                        {template.occupation}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Description */}
                            <div className="col-span-2 p-5 rounded-xl border border-zinc-800/60 bg-zinc-800/30">
                                <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Job Description
                                </h3>
                                <p className="text-sm text-zinc-200 whitespace-pre-wrap">{template.job_description}</p>
                            </div>

                            {/* Benefits */}
                            <div className="p-5 rounded-xl border border-zinc-800/60 bg-zinc-800/30">
                                <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Benefits
                                </h3>
                                {benefits.length > 0 ? (
                                    <ul className="space-y-2">
                                        {benefits.map(b => (
                                            <li key={b.id} className="text-sm text-zinc-200 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                {benefitLabels[b.benefit_type] || b.benefit_type}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-zinc-500">No benefits specified</p>
                                )}
                            </div>

                            {/* Bring With Items */}
                            <div className="p-5 rounded-xl border border-zinc-800/60 bg-zinc-800/30">
                                <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Items to Bring
                                </h3>
                                {bringWithItems.length > 0 ? (
                                    <ul className="space-y-2">
                                        {bringWithItems.map(item => (
                                            <li key={item.id} className="text-sm text-zinc-200 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                {item.item}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-zinc-500">No items specified</p>
                                )}
                            </div>

                            {/* Eligibility Criteria */}
                            <div className="p-5 rounded-xl border border-zinc-800/60 bg-zinc-800/30">
                                <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Eligibility Criteria
                                </h3>
                                {eligibilityCriteria.length > 0 ? (
                                    <ul className="space-y-2">
                                        {eligibilityCriteria.map(c => (
                                            <li key={c.id} className="text-sm text-zinc-200 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                {c.criterion}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-zinc-500">No criteria specified</p>
                                )}
                            </div>

                            {/* Emergency Contact */}
                            <div className="p-5 rounded-xl border border-zinc-800/60 bg-zinc-800/30">
                                <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Emergency Contact
                                </h3>
                                <p className="text-sm text-zinc-200">{template.emergency_contact || 'Not specified'}</p>
                            </div>

                            {/* Auto Message */}
                            {template.auto_message && (
                                <div className="col-span-2 p-5 rounded-xl border border-zinc-800/60 bg-zinc-800/30">
                                    <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Auto Message to Employees
                                    </h3>
                                    <p className="text-sm text-zinc-200 whitespace-pre-wrap">{template.auto_message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
