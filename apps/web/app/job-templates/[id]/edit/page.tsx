"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { supabase } from '@/lib/supabase'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { X, ArrowLeft, FilePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    job_title: z.string().min(2, "Job title must be at least 2 characters"),
    industry: z.string().min(1, "Please select an industry"),
    occupation: z.string().min(1, "Please select an occupation"),
    job_description: z.string().min(10, "Job description must be at least 10 characters"),
    benefits: z.array(z.string()).default([]),
    bring_with_items: z.array(z.string()).default([]),
    eligibility_criteria: z.array(z.string()).default([]),
    location_work_environment: z.string().min(5, "Please describe the location"),
    emergency_contact: z.string().min(5, "Please provide emergency contact"),
    auto_message: z.string().optional(),
})

const BENEFIT_OPTIONS = [
    { value: "no_experience", label: "No Experience Required" },
    { value: "no_uniform", label: "No Uniform" },
    { value: "food_provided", label: "Food Provided" },
    { value: "parking", label: "Parking Available" },
    { value: "discount", label: "Employee Discount" },
]

const INDUSTRIES = ["Food & Drink", "Retail", "Hospitality", "Healthcare", "Technology", "Other"]
const OCCUPATIONS = ["Restaurant Staff", "Kitchen Staff", "Cashier", "Sales Associate", "Security", "Cleaner", "Other"]

export default function EditTemplatePage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newBringWithItem, setNewBringWithItem] = useState("")
    const [newEligibilityCriterion, setNewEligibilityCriterion] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            job_title: "",
            industry: "",
            occupation: "",
            job_description: "",
            benefits: [],
            bring_with_items: [],
            eligibility_criteria: [],
            location_work_environment: "",
            emergency_contact: "",
            auto_message: "",
        },
    })

    useEffect(() => {
        async function fetchTemplate() {
            const id = params.id as string

            const [templateRes, benefitsRes, bringWithRes, criteriaRes] = await Promise.all([
                supabase.from('job_posting_templates').select('*').eq('id', id).single(),
                supabase.from('template_benefits').select('*').eq('template_id', id),
                supabase.from('template_bring_with_items').select('*').eq('template_id', id).order('order_index'),
                supabase.from('template_eligibility_criteria').select('*').eq('template_id', id).order('order_index'),
            ])

            if (templateRes.data) {
                form.reset({
                    job_title: templateRes.data.job_title,
                    industry: templateRes.data.industry,
                    occupation: templateRes.data.occupation,
                    job_description: templateRes.data.job_description,
                    location_work_environment: templateRes.data.location_work_environment,
                    emergency_contact: templateRes.data.emergency_contact,
                    auto_message: templateRes.data.auto_message || "",
                    benefits: benefitsRes.data?.map(b => b.benefit_type) || [],
                    bring_with_items: bringWithRes.data?.map(i => i.item) || [],
                    eligibility_criteria: criteriaRes.data?.map(c => c.criterion) || [],
                })
            }

            setLoading(false)
        }

        fetchTemplate()
    }, [params.id, form])

    const addBringWithItem = () => {
        if (!newBringWithItem.trim()) return
        const current = form.getValues("bring_with_items")
        form.setValue("bring_with_items", [...current, newBringWithItem.trim()])
        setNewBringWithItem("")
    }

    const removeBringWithItem = (index: number) => {
        const current = form.getValues("bring_with_items")
        form.setValue("bring_with_items", current.filter((_, i) => i !== index))
    }

    const addEligibilityCriterion = () => {
        if (!newEligibilityCriterion.trim()) return
        const current = form.getValues("eligibility_criteria")
        form.setValue("eligibility_criteria", [...current, newEligibilityCriterion.trim()])
        setNewEligibilityCriterion("")
    }

    const removeEligibilityCriterion = (index: number) => {
        const current = form.getValues("eligibility_criteria")
        form.setValue("eligibility_criteria", current.filter((_, i) => i !== index))
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        const id = params.id as string

        try {
            // Update main template
            const { error: updateError } = await supabase
                .from('job_posting_templates')
                .update({
                    job_title: values.job_title,
                    industry: values.industry,
                    occupation: values.occupation,
                    job_description: values.job_description,
                    location_work_environment: values.location_work_environment,
                    emergency_contact: values.emergency_contact,
                    auto_message: values.auto_message || "",
                })
                .eq('id', id)

            if (updateError) throw updateError

            // Delete and re-insert benefits
            await supabase.from('template_benefits').delete().eq('template_id', id)
            if (values.benefits.length > 0) {
                await supabase.from('template_benefits').insert(
                    values.benefits.map(b => ({ template_id: id, benefit_type: b }))
                )
            }

            // Delete and re-insert bring with items
            await supabase.from('template_bring_with_items').delete().eq('template_id', id)
            if (values.bring_with_items.length > 0) {
                await supabase.from('template_bring_with_items').insert(
                    values.bring_with_items.map((item, index) => ({ template_id: id, item, order_index: index }))
                )
            }

            // Delete and re-insert eligibility criteria
            await supabase.from('template_eligibility_criteria').delete().eq('template_id', id)
            if (values.eligibility_criteria.length > 0) {
                await supabase.from('template_eligibility_criteria').insert(
                    values.eligibility_criteria.map((criterion, index) => ({ template_id: id, criterion, order_index: index }))
                )
            }

            toast.success("Template updated successfully")
            router.push(`/job-templates/${id}`)
        } catch (error) {
            console.error(error)
            toast.error("Failed to update template")
        } finally {
            setIsSubmitting(false)
        }
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

    return (
        <div className="flex h-screen overflow-hidden selection:bg-orange-500/30 text-zinc-100 bg-zinc-900">
            <Sidebar />

            <main className="flex-1 bg-zinc-900 relative overflow-hidden flex flex-col">
                <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <Link href={`/job-templates/${params.id}`} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <FilePlus className="w-5 h-5 text-orange-500" />
                        <h1 className="text-sm font-medium text-zinc-200">Edit Template</h1>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="job_title" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="industry" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry</FormLabel>
                                        <FormControl>
                                            <select {...field} className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                                <option value="">Select industry</option>
                                                {INDUSTRIES.map(i => <option key={i} value={i.toLowerCase()}>{i}</option>)}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="occupation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Occupation</FormLabel>
                                        <FormControl>
                                            <select {...field} className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                                <option value="">Select occupation</option>
                                                {OCCUPATIONS.map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="job_description" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Description</FormLabel>
                                        <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="benefits" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Benefits</FormLabel>
                                        <div className="space-y-2">
                                            {BENEFIT_OPTIONS.map(b => (
                                                <div key={b.value} className="flex items-center space-x-2">
                                                    <input type="checkbox" id={b.value} checked={field.value?.includes(b.value)}
                                                        onChange={(e) => {
                                                            const current = field.value || []
                                                            field.onChange(e.target.checked ? [...current, b.value] : current.filter(v => v !== b.value))
                                                        }}
                                                        className="h-4 w-4 rounded border-gray-300" />
                                                    <label htmlFor={b.value} className="text-sm">{b.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Items to Bring</label>
                                    <div className="flex gap-2">
                                        <Input placeholder="Add item..." value={newBringWithItem} onChange={(e) => setNewBringWithItem(e.target.value)}
                                            onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBringWithItem() } }} />
                                        <Button type="button" onClick={addBringWithItem} variant="outline">Add</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {form.watch("bring_with_items").map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg bg-zinc-800/30">
                                                <span className="text-sm">{item}</span>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeBringWithItem(index)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Eligibility Criteria</label>
                                    <div className="flex gap-2">
                                        <Input placeholder="e.g. ≥90% rating" value={newEligibilityCriterion} onChange={(e) => setNewEligibilityCriterion(e.target.value)}
                                            onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEligibilityCriterion() } }} />
                                        <Button type="button" onClick={addEligibilityCriterion} variant="outline">Add</Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {form.watch("eligibility_criteria").map((c, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border border-zinc-700 rounded-lg bg-zinc-800/30">
                                                <span className="text-sm">{c}</span>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeEligibilityCriterion(index)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <FormField control={form.control} name="location_work_environment" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location & Work Environment</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="emergency_contact" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Emergency Contact</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="auto_message" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Auto Message (Optional)</FormLabel>
                                        <FormControl><Textarea {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </main>
        </div>
    )
}
