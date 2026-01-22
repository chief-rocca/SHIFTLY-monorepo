"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { useState } from "react"
import { X, Upload, FileText, Image as ImageIcon } from "lucide-react"

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_DOCUMENTS = 5
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

const formSchema = z.object({
    job_title: z.string().min(2, "Job title must be at least 2 characters"),
    industry: z.string().min(1, "Please select an industry"),
    occupation: z.string().min(1, "Please select an occupation"),
    job_description: z.string().min(10, "Job description must be at least 10 characters"),
    benefits: z.array(z.string()).default([]),
    bring_with_items: z.array(z.string()).default([]),
    eligibility_criteria: z.array(z.string()).default([]),
    location_work_environment: z.string().min(5, "Please describe the location and work environment"),
    emergency_contact: z.string().min(5, "Please provide emergency contact information"),
    auto_message: z.string().optional(),
})

const BENEFIT_OPTIONS = [
    { value: "no_experience", label: "No Experience Required" },
    { value: "no_uniform", label: "No Uniform" },
    { value: "food_provided", label: "Food Provided" },
    { value: "parking", label: "Parking Available" },
    { value: "discount", label: "Employee Discount" },
]

const INDUSTRIES = [
    "Food & Drink",
    "Retail",
    "Hospitality",
    "Healthcare",
    "Technology",
    "Other",
]

const OCCUPATIONS = [
    "Restaurant Staff",
    "Kitchen Staff",
    "Cashier",
    "Sales Associate",
    "Security",
    "Cleaner",
    "Other",
]

export function JobPostingTemplateForm() {
    const [workplaceImages, setWorkplaceImages] = useState<{ type: string; file: File }[]>([])
    const [workDocuments, setWorkDocuments] = useState<File[]>([])
    const [newBringWithItem, setNewBringWithItem] = useState("")
    const [newEligibilityCriterion, setNewEligibilityCriterion] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageType: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error("Invalid file type", { description: "Please upload a valid image file" })
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("File too large", { description: "Maximum file size is 5MB" })
            return
        }

        setWorkplaceImages(prev => {
            const filtered = prev.filter(img => img.type !== imageType)
            return [...filtered, { type: imageType, file }]
        })
    }

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        if (workDocuments.length + files.length > MAX_DOCUMENTS) {
            toast.error("Too many documents", { description: `Maximum ${MAX_DOCUMENTS} documents allowed` })
            return
        }

        for (const file of files) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File too large", { description: `${file.name} exceeds 5MB limit` })
                return
            }
        }

        setWorkDocuments(prev => [...prev, ...files])
    }

    const removeDocument = (index: number) => {
        setWorkDocuments(prev => prev.filter((_, i) => i !== index))
    }

    const addBringWithItem = () => {
        if (!newBringWithItem.trim()) return
        const currentItems = form.getValues("bring_with_items")
        form.setValue("bring_with_items", [...currentItems, newBringWithItem.trim()])
        setNewBringWithItem("")
    }

    const removeBringWithItem = (index: number) => {
        const currentItems = form.getValues("bring_with_items")
        form.setValue("bring_with_items", currentItems.filter((_, i) => i !== index))
    }

    const addEligibilityCriterion = () => {
        if (!newEligibilityCriterion.trim()) return
        const currentCriteria = form.getValues("eligibility_criteria")
        form.setValue("eligibility_criteria", [...currentCriteria, newEligibilityCriterion.trim()])
        setNewEligibilityCriterion("")
    }

    const removeEligibilityCriterion = (index: number) => {
        const currentCriteria = form.getValues("eligibility_criteria")
        form.setValue("eligibility_criteria", currentCriteria.filter((_, i) => i !== index))
    }

    async function uploadFile(file: File, bucket: string, path: string) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: true })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

        return publicUrl
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            // 1. Insert main template
            const { data: template, error: templateError } = await supabase
                .from("job_posting_templates")
                .insert({
                    job_title: values.job_title,
                    industry: values.industry,
                    occupation: values.occupation,
                    job_description: values.job_description,
                    location_work_environment: values.location_work_environment,
                    emergency_contact: values.emergency_contact,
                    auto_message: values.auto_message || "",
                })
                .select()
                .single()

            if (templateError) throw templateError

            // 2. Insert benefits
            if (values.benefits.length > 0) {
                const benefitsData = values.benefits.map(benefit => ({
                    template_id: template.id,
                    benefit_type: benefit,
                }))
                const { error: benefitsError } = await supabase
                    .from("template_benefits")
                    .insert(benefitsData)
                if (benefitsError) throw benefitsError
            }

            // 3. Insert bring with items
            if (values.bring_with_items.length > 0) {
                const bringWithData = values.bring_with_items.map((item, index) => ({
                    template_id: template.id,
                    item,
                    order_index: index,
                }))
                const { error: bringWithError } = await supabase
                    .from("template_bring_with_items")
                    .insert(bringWithData)
                if (bringWithError) throw bringWithError
            }

            // 4. Insert eligibility criteria
            if (values.eligibility_criteria.length > 0) {
                const criteriaData = values.eligibility_criteria.map((criterion, index) => ({
                    template_id: template.id,
                    criterion,
                    order_index: index,
                }))
                const { error: criteriaError } = await supabase
                    .from("template_eligibility_criteria")
                    .insert(criteriaData)
                if (criteriaError) throw criteriaError
            }

            // 5. Upload and insert workplace images
            if (workplaceImages.length > 0) {
                const imageUploads = await Promise.all(
                    workplaceImages.map(async ({ type, file }) => {
                        const path = `${template.id}/${type}_${Date.now()}.${file.name.split('.').pop()}`
                        const url = await uploadFile(file, "workplace-images", path)
                        return {
                            template_id: template.id,
                            image_type: type,
                            image_url: url,
                        }
                    })
                )
                const { error: imagesError } = await supabase
                    .from("template_workplace_images")
                    .insert(imageUploads)
                if (imagesError) throw imagesError
            }

            // 6. Upload and insert work documents
            if (workDocuments.length > 0) {
                const documentUploads = await Promise.all(
                    workDocuments.map(async (file) => {
                        const path = `${template.id}/${Date.now()}_${file.name}`
                        const url = await uploadFile(file, "work-documents", path)
                        return {
                            template_id: template.id,
                            document_name: file.name,
                            document_url: url,
                        }
                    })
                )
                const { error: docsError } = await supabase
                    .from("template_work_documents")
                    .insert(documentUploads)
                if (docsError) throw docsError
            }

            toast.success("Template created successfully", {
                description: `${values.job_title} template is ready to use`,
            })

            // Reset form
            form.reset()
            setWorkplaceImages([])
            setWorkDocuments([])
        } catch (error) {
            console.error(error)
            toast.error("Failed to create template", {
                description: "Please try again later.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Job Title */}
                    <FormField
                        control={form.control}
                        name="job_title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Restaurant Manager" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Industry */}
                    <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Industry</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 ring-offset-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select industry</option>
                                        {INDUSTRIES.map(industry => (
                                            <option key={industry} value={industry.toLowerCase()}>
                                                {industry}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Occupation */}
                    <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Occupation</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 ring-offset-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select occupation</option>
                                        {OCCUPATIONS.map(occupation => (
                                            <option key={occupation} value={occupation.toLowerCase()}>
                                                {occupation}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Job Description */}
                    <FormField
                        control={form.control}
                        name="job_description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the role and responsibilities..."
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Benefits */}
                    <FormField
                        control={form.control}
                        name="benefits"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Benefits</FormLabel>
                                <div className="space-y-2">
                                    {BENEFIT_OPTIONS.map(benefit => (
                                        <div key={benefit.value} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={benefit.value}
                                                checked={field.value?.includes(benefit.value)}
                                                onChange={(e) => {
                                                    const current = field.value || []
                                                    if (e.target.checked) {
                                                        field.onChange([...current, benefit.value])
                                                    } else {
                                                        field.onChange(current.filter(v => v !== benefit.value))
                                                    }
                                                }}
                                                className="h-4 w-4 rounded border-gray-300"
                                            />
                                            <label htmlFor={benefit.value} className="text-sm">
                                                {benefit.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Bring With Items */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Items to Bring</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add item..."
                                value={newBringWithItem}
                                onChange={(e) => setNewBringWithItem(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        addBringWithItem()
                                    }
                                }}
                            />
                            <Button type="button" onClick={addBringWithItem} variant="outline">
                                Add
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {form.watch("bring_with_items").map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                                >
                                    <span className="text-sm">{item}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeBringWithItem(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Eligibility Criteria */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Eligibility Criteria / Prerequisites</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g. ≥90% rating"
                                value={newEligibilityCriterion}
                                onChange={(e) => setNewEligibilityCriterion(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        addEligibilityCriterion()
                                    }
                                }}
                            />
                            <Button type="button" onClick={addEligibilityCriterion} variant="outline">
                                Add
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {form.watch("eligibility_criteria").map((criterion, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
                                >
                                    <span className="text-sm">{criterion}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeEligibilityCriterion(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Workplace Images */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Workplace Images</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {["setting", "exterior", "interior"].map(imageType => (
                                <div key={imageType} className="border rounded-lg p-4 space-y-2">
                                    <label className="text-sm font-medium capitalize">{imageType}</label>
                                    <input
                                        type="file"
                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                        onChange={(e) => handleImageUpload(e, imageType)}
                                        className="text-sm"
                                    />
                                    {workplaceImages.find(img => img.type === imageType) && (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <ImageIcon className="h-4 w-4" />
                                            Image uploaded
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Work Documents */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Work Related Documents (Max {MAX_DOCUMENTS})</label>
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                            <input
                                type="file"
                                multiple
                                accept={ACCEPTED_DOCUMENT_TYPES.join(",")}
                                onChange={handleDocumentUpload}
                                className="hidden"
                                id="document-upload"
                                disabled={workDocuments.length >= MAX_DOCUMENTS}
                            />
                            <label
                                htmlFor="document-upload"
                                className={`cursor-pointer flex flex-col items-center gap-2 ${workDocuments.length >= MAX_DOCUMENTS ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Click to upload documents
                                </span>
                            </label>
                        </div>
                        {workDocuments.length > 0 && (
                            <div className="space-y-2">
                                {workDocuments.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <span className="text-sm">{doc.name}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeDocument(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Location & Work Environment */}
                    <FormField
                        control={form.control}
                        name="location_work_environment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location & Work Environment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe the location and work environment..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Emergency Contact */}
                    <FormField
                        control={form.control}
                        name="emergency_contact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emergency Contact</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Manager: +1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Auto Message */}
                    <FormField
                        control={form.control}
                        name="auto_message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Auto Message (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Preset message to send to all employees..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating Template..." : "Continue to Create Job Posting"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

