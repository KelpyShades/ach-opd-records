'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import lbg from '@/app/assets/bg.webp'

const pvtSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    membership_number: z.string().min(1, 'Membership Number is required'),
    company: z.string().min(1, 'Company is required'),
    opd_number: z.string().min(1, 'OPD Number is required'),
    phone: z.string().min(1, 'Phone Number is required'),
})

type PvtFormData = z.infer<typeof pvtSchema>

export default function PvtInsertView() {
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    const form = useForm<PvtFormData>({
        resolver: zodResolver(pvtSchema),
        defaultValues: {
            opd_number: '',
            name: '',
            membership_number: '',
            company: '',
            phone: '',
        },
        mode: 'onChange',
    })

    const onSubmit = async (data: PvtFormData) => {
        setSubmitting(true)

        try {
            const { error } = await supabase.from('records_private').insert({
                opd_number: data.opd_number,
                name: data.name,
                membership_number: data.membership_number,
                company: data.company,
                phone: data.phone,
            })

            if (error) {
                toast.error('Failed to save record: ' + error.message)
                return
            }

            toast.success('Private record saved successfully!')
            form.reset()
        } catch (error) {
            console.error('Error saving record:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            className="flex min-h-full items-center justify-center bg-gray-50/50 bg-cover bg-center bg-no-repeat p-8 bg-blend-overlay"
            style={{ backgroundImage: `url(${lbg.src})` }}
        >
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Plus className="h-6 w-6" />
                        Add Private Record
                    </CardTitle>
                    <CardDescription>
                        Enter the patient's OPD and private information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Name"
                                                disabled={submitting}
                                                className="text-base"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="membership_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Membership Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Membership Number"
                                                disabled={submitting}
                                                className="text-base"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Company"
                                                disabled={submitting}
                                                className="text-base"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="opd_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>OPD Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter OPD Number"
                                                disabled={submitting}
                                                className="text-base"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter Phone"
                                                disabled={submitting}
                                                className="text-base"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Save Record'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
