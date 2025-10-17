'use client'
import {
    Form,
    FormItem,
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

// Validation schema
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function FormClient() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        reValidateMode: 'onChange',
        mode: 'onChange',
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)

        try {
            const { data: authData, error } =
                await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                })

            form.reset({
                email: '',
                password: '',
            })

            if (error) {
                // Handle specific Supabase auth errors
                let errorMessage = 'Login failed. Please try again.'

                if (error.message.includes('Invalid login credentials')) {
                    errorMessage =
                        'Invalid email or password. Please check your credentials.'
                } else if (error.message.includes('Email not confirmed')) {
                    errorMessage =
                        'Please confirm your email address before logging in.'
                } else if (error.message.includes('Too many requests')) {
                    errorMessage =
                        'Too many login attempts. Please wait a moment and try again.'
                } else {
                    errorMessage = error.message
                }

                toast.error(errorMessage)
                return
            }

            if (authData.user) {
                toast.success('Login successful! Redirecting...')
                // Redirect to main page or dashboard
                router.push('/home')
                router.refresh()
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="agent@hospital.local"
                                            disabled={isLoading}
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            placeholder="Enter your password"
                                            disabled={isLoading}
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
