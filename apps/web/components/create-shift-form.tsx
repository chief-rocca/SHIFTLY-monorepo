"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    location: z.string().min(2, {
        message: "Location must be at least 2 characters.",
    }),
    pay_rate: z.coerce.number().min(1, {
        message: "Pay rate must be at least $1.",
    }),
})

export function CreateShiftForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            location: "",
            pay_rate: 0,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const { error } = await supabase.from("shifts").insert([
                {
                    title: values.title,
                    location: values.location,
                    pay_rate: values.pay_rate,
                },
            ])

            if (error) {
                throw error
            }

            toast.success("Shift posted successfully", {
                description: `${values.title} at ${values.location}`,
            })
            form.reset()
        } catch (error) {
            console.error(error)
            toast.error("Failed to post shift", {
                description: "Please try again later.",
            })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create New Shift</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shift Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Event Security" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Downtown Arena" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pay_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hourly Rate ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="45" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">Post Shift</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
