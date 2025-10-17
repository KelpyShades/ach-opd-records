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

const nhisSchema = z.object({
    opd_number: z.string().min(1, 'OPD Number is required'),
    nhis_number: z.string().min(1, 'NHIS Number is required'),
    ccc: z.string().min(1, 'CCC is required'),
})

type NHISFormData = z.infer<typeof nhisSchema>

export default function NHISInsertView() {
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    const form = useForm<NHISFormData>({
        resolver: zodResolver(nhisSchema),
        defaultValues: {
            opd_number: '',
            nhis_number: '',
            ccc: '',
        },
        mode: 'onChange',
    })

    const onSubmit = async (data: NHISFormData) => {
        setSubmitting(true)

        try {
            const { error } = await supabase.from('records_nhis').insert({
                opd_number: data.opd_number,
                nhis_number: data.nhis_number,
                ccc: data.ccc,
            })

            if (error) {
                toast.error('Failed to save record: ' + error.message)
                return
            }

            toast.success('NHIS record saved successfully!')
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
                        Add NHIS Record
                    </CardTitle>
                    <CardDescription>
                        Enter the patient's OPD and NHIS information
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
                                name="nhis_number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>NHIS Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter NHIS Number"
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
                                name="ccc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CCC</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter CCC"
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
