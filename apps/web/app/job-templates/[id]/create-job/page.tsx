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
import {
    ArrowLeft,
    FilePlus,
    Calendar,
    Clock,
    Users,
    Eye,
    DollarSign,
    MessageSquare,
    CheckCircle2,
    Send
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const EXPERIENCE_GROUPS = {
    'Customer Service': [
        { value: 'customer_service', label: 'Customer Service Experience' },
        { value: 'retail', label: 'Retail Experience' },
        { value: 'sales', label: 'Sales Experience' },
        { value: 'front_desk', label: 'Front Desk Experience' },
        { value: 'hospitality', label: 'Hospitality Experience' },
    ],
    'Food & Beverage': [
        { value: 'food_service', label: 'Food Service Experience' },
        { value: 'hall_staff', label: 'Hall Staff Experience' },
        { value: 'kitchen_staff', label: 'Kitchen Staff Experience' },
        { value: 'barista', label: 'Barista Experience' },
        { value: 'dishwashing', label: 'Dishwashing Experience' },
    ],
    'Operations': [
        { value: 'cash_handling', label: 'Cash Handling Experience' },
        { value: 'inventory_management', label: 'Inventory Management Experience' },
        { value: 'opening_closing', label: 'Opening/Closing Experience' },
        { value: 'pos_system', label: 'POS System Experience' },
    ],
    'Light Labor': [
        { value: 'cleaning', label: 'Cleaning Experience' },
        { value: 'packing_sorting', label: 'Packing/Sorting Experience' },
        { value: 'warehouse', label: 'Warehouse Experience' },
        { value: 'moving_loading', label: 'Moving/Loading Experience' },
    ],
    'Office & Other': [
        { value: 'administrative', label: 'Administrative Experience' },
        { value: 'data_entry', label: 'Data Entry Experience' },
        { value: 'call_center', label: 'Call Center Experience' },
        { value: 'event_staff', label: 'Event Staff Experience' },
    ],
    'Special': [
        { value: 'previous_work_experience', label: 'Previous Work Experience (at this role)' },
        { value: 'favourite_recurring', label: 'Favourite / Recurring Workers' },
        { value: 'other', label: 'Other Experience' },
    ],
}

const formSchema = z.object({
    job_date: z.string().min(1, "Please select a date"),
    start_time: z.string().min(1, "Please select a start time"),
    end_time: z.string().min(1, "Please select an end time"),
    break_start_time: z.string().optional(),
    break_end_time: z.string().optional(),
    application_closing_option: z.enum(['2_days_before', '1_day_before', 'day_of']),
    head_count: z.coerce.number().min(1, "At least 1 person required"),
    visibility_type: z.enum(['general', 'certified', 'groups']),
    experience_groups: z.array(z.string()).default([]),
    wage_amount: z.coerce.number().min(0, "Wage must be positive"),
    travel_compensation: z.coerce.number().min(0).default(0),
    send_auto_message: z.boolean().default(false),
    auto_message_target: z.enum(['always', 'first_timers_only']).optional(),
})

interface Template {
    id: string
    job_title: string
    industry: string
    occupation: string
    job_description: string
    location_work_environment: string
    emergency_contact: string
    auto_message: string
}

export default function CreateJobPage() {
    const params = useParams()
    const router = useRouter()
    const [template, setTemplate] = useState<Template | null>(null)
    const [benefits, setBenefits] = useState<string[]>([])
    const [bringWithItems, setBringWithItems] = useState<string[]>([])
    const [eligibilityCriteria, setEligibilityCriteria] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            job_date: "",
            start_time: "",
            end_time: "",
            break_start_time: "",
            break_end_time: "",
            application_closing_option: "1_day_before",
            head_count: 1,
            visibility_type: "general",
            experience_groups: [],
            wage_amount: 0,
            travel_compensation: 0,
            send_auto_message: false,
            auto_message_target: "always",
        },
    })

    const visibilityType = form.watch("visibility_type")
    const sendAutoMessage = form.watch("send_auto_message")

    useEffect(() => {
        async function fetchTemplate() {
            const id = params.id as string

            const [templateRes, benefitsRes, bringWithRes, criteriaRes] = await Promise.all([
                supabase.from('job_posting_templates').select('*').eq('id', id).single(),
                supabase.from('template_benefits').select('benefit_type').eq('template_id', id),
                supabase.from('template_bring_with_items').select('item').eq('template_id', id).order('order_index'),
                supabase.from('template_eligibility_criteria').select('criterion').eq('template_id', id).order('order_index'),
            ])

            if (templateRes.data) setTemplate(templateRes.data)
            if (benefitsRes.data) setBenefits(benefitsRes.data.map(b => b.benefit_type))
            if (bringWithRes.data) setBringWithItems(bringWithRes.data.map(i => i.item))
            if (criteriaRes.data) setEligibilityCriteria(criteriaRes.data.map(c => c.criterion))

            setLoading(false)
        }

        fetchTemplate()
    }, [params.id])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!template) return

        if (!showConfirm) {
            setShowConfirm(true)
            return
        }

        setIsSubmitting(true)

        try {
            // Insert job posting
            const { data: jobPosting, error: jobError } = await supabase
                .from('job_postings')
                .insert({
                    template_id: template.id,
                    job_title: template.job_title,
                    industry: template.industry,
                    occupation: template.occupation,
                    job_description: template.job_description,
                    location_work_environment: template.location_work_environment,
                    emergency_contact: template.emergency_contact,
                    job_date: values.job_date,
                    start_time: values.start_time,
                    end_time: values.end_time,
                    break_start_time: values.break_start_time || null,
                    break_end_time: values.break_end_time || null,
                    application_closing_option: values.application_closing_option,
                    head_count: values.head_count,
                    visibility_type: values.visibility_type,
                    wage_amount: values.wage_amount,
                    travel_compensation: values.travel_compensation,
                    send_auto_message: values.send_auto_message,
                    auto_message_target: values.send_auto_message ? values.auto_message_target : null,
                    auto_message_text: values.send_auto_message ? template.auto_message : null,
                    status: 'published',
                })
                .select()
                .single()

            if (jobError) throw jobError

            // Insert experience groups if visibility is 'groups'
            if (values.visibility_type === 'groups' && values.experience_groups.length > 0) {
                const groupsData = values.experience_groups.map(exp => ({
                    job_posting_id: jobPosting.id,
                    experience_type: exp,
                }))
                await supabase.from('job_posting_experience_groups').insert(groupsData)
            }

            // Copy benefits from template
            if (benefits.length > 0) {
                const benefitsData = benefits.map(b => ({
                    job_posting_id: jobPosting.id,
                    benefit_type: b,
                }))
                await supabase.from('job_posting_benefits').insert(benefitsData)
            }

            // Copy bring with items from template
            if (bringWithItems.length > 0) {
                const itemsData = bringWithItems.map((item, index) => ({
                    job_posting_id: jobPosting.id,
                    item,
                    order_index: index,
                }))
                await supabase.from('job_posting_bring_with_items').insert(itemsData)
            }

            // Copy eligibility criteria from template
            if (eligibilityCriteria.length > 0) {
                const criteriaData = eligibilityCriteria.map((criterion, index) => ({
                    job_posting_id: jobPosting.id,
                    criterion,
                    order_index: index,
                }))
                await supabase.from('job_posting_eligibility_criteria').insert(criteriaData)
            }

            toast.success("Job posted successfully!", {
                description: `${template.job_title} has been published`,
            })

            router.push('/job-templates')
        } catch (error) {
            console.error(error)
            toast.error("Failed to create job posting")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden text-zinc-100 bg-zinc-900">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-zinc-500">Loading template...</div>
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
                <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <Link href={`/job-templates/${params.id}`} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <FilePlus className="w-5 h-5 text-orange-500" />
                        <h1 className="text-sm font-medium text-zinc-200">Create Job from Template</h1>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Template Header */}
                        <div className="mb-8 p-4 rounded-xl border border-zinc-800/60 bg-zinc-800/30">
                            <h2 className="text-lg font-semibold text-zinc-100">{template.job_title}</h2>
                            <p className="text-sm text-zinc-500 mt-1">{template.occupation} • {template.industry}</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                {/* Date & Time Section */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <Calendar className="w-4 h-4" />
                                        Schedule
                                    </h3>

                                    <FormField control={form.control} name="job_date" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="start_time" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="end_time" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="break_start_time" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Break Start (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="break_end_time" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Break End (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>

                                {/* Application Settings */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <Clock className="w-4 h-4" />
                                        Application Settings
                                    </h3>

                                    <FormField control={form.control} name="application_closing_option" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Application Closing Time</FormLabel>
                                            <FormControl>
                                                <select {...field} className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                                                    <option value="2_days_before">2 days before job date</option>
                                                    <option value="1_day_before">1 day before job date</option>
                                                    <option value="day_of">Day of job</option>
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="head_count" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                Head Count
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="number" min={1} placeholder="How many workers needed?" {...field} />
                                            </FormControl>
                                            <FormDescription>Number of workers you're recruiting for this job</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                {/* Visibility Settings */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <Eye className="w-4 h-4" />
                                        Posting Visibility
                                    </h3>

                                    <FormField control={form.control} name="visibility_type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Who can see this posting?</FormLabel>
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <input type="radio" id="general" value="general" checked={field.value === 'general'} onChange={() => field.onChange('general')} className="h-4 w-4" />
                                                    <label htmlFor="general" className="text-sm">General (Everyone)</label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input type="radio" id="certified" value="certified" checked={field.value === 'certified'} onChange={() => field.onChange('certified')} className="h-4 w-4" />
                                                    <label htmlFor="certified" className="text-sm">Certified Users Only</label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input type="radio" id="groups" value="groups" checked={field.value === 'groups'} onChange={() => field.onChange('groups')} className="h-4 w-4" />
                                                    <label htmlFor="groups" className="text-sm">Specific Experience Groups</label>
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {visibilityType === 'groups' && (
                                        <FormField control={form.control} name="experience_groups" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Experience Groups</FormLabel>
                                                <div className="space-y-4 p-4 rounded-lg border border-zinc-700 bg-zinc-800/30 max-h-80 overflow-y-auto">
                                                    {Object.entries(EXPERIENCE_GROUPS).map(([category, groups]) => (
                                                        <div key={category}>
                                                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">{category}</p>
                                                            <div className="space-y-1.5">
                                                                {groups.map(group => (
                                                                    <div key={group.value} className="flex items-center space-x-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            id={group.value}
                                                                            checked={field.value?.includes(group.value)}
                                                                            onChange={(e) => {
                                                                                const current = field.value || []
                                                                                field.onChange(
                                                                                    e.target.checked
                                                                                        ? [...current, group.value]
                                                                                        : current.filter(v => v !== group.value)
                                                                                )
                                                                            }}
                                                                            className="h-4 w-4 rounded border-gray-300"
                                                                        />
                                                                        <label htmlFor={group.value} className="text-sm text-zinc-300">{group.label}</label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}
                                </div>

                                {/* Compensation */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <DollarSign className="w-4 h-4" />
                                        Compensation
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="wage_amount" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Wage (R)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R</span>
                                                        <Input type="number" step="0.01" min={0} className="pl-7" placeholder="0.00" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField control={form.control} name="travel_compensation" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Travel Compensation (R)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">R</span>
                                                        <Input type="number" step="0.01" min={0} className="pl-7" placeholder="0.00" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>

                                {/* Auto Message */}
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                                        <MessageSquare className="w-4 h-4" />
                                        Auto Message
                                    </h3>

                                    <FormField control={form.control} name="send_auto_message" render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="send_auto_message"
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                <label htmlFor="send_auto_message" className="text-sm">
                                                    Distribute posting with auto-message
                                                </label>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    {sendAutoMessage && (
                                        <FormField control={form.control} name="auto_message_target" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Send to:</FormLabel>
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <input type="radio" id="always" value="always" checked={field.value === 'always'} onChange={() => field.onChange('always')} className="h-4 w-4" />
                                                        <label htmlFor="always" className="text-sm">Always send to all workers</label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <input type="radio" id="first_timers_only" value="first_timers_only" checked={field.value === 'first_timers_only'} onChange={() => field.onChange('first_timers_only')} className="h-4 w-4" />
                                                        <label htmlFor="first_timers_only" className="text-sm">First-time workers only</label>
                                                    </div>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}

                                    {sendAutoMessage && template.auto_message && (
                                        <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                                            <p className="text-xs text-zinc-500 mb-1">Message from template:</p>
                                            <p className="text-sm text-zinc-300">{template.auto_message}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Section */}
                                {showConfirm && (
                                    <div className="p-5 rounded-xl border-2 border-orange-500/50 bg-orange-500/10">
                                        <h3 className="flex items-center gap-2 text-sm font-medium text-orange-400 mb-4">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Confirm Job Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><span className="text-zinc-500">Date:</span> <span className="text-zinc-200">{form.getValues("job_date")}</span></div>
                                            <div><span className="text-zinc-500">Time:</span> <span className="text-zinc-200">{form.getValues("start_time")} - {form.getValues("end_time")}</span></div>
                                            <div><span className="text-zinc-500">Head Count:</span> <span className="text-zinc-200">{form.getValues("head_count")}</span></div>
                                            <div><span className="text-zinc-500">Wage:</span> <span className="text-zinc-200">R{form.getValues("wage_amount")}</span></div>
                                            <div><span className="text-zinc-500">Visibility:</span> <span className="text-zinc-200 capitalize">{form.getValues("visibility_type")}</span></div>
                                            <div><span className="text-zinc-500">Auto-message:</span> <span className="text-zinc-200">{form.getValues("send_auto_message") ? "Yes" : "No"}</span></div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {showConfirm && (
                                        <Button type="button" variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
                                            Edit Details
                                        </Button>
                                    )}
                                    <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            "Publishing..."
                                        ) : showConfirm ? (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Publish Job
                                            </>
                                        ) : (
                                            "Review & Publish"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </main>
        </div>
    )
}
