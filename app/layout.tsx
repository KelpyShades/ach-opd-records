import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
    title: 'ACH OPD Records',
    description: 'ACH OPD Records',
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    // const {
    //     data: { user },
    // } = await supabase.auth.getUser()
    // if (!user) {
    //     redirect('/')
    // }
    return (
        <html lang="en">
            <body className={`${poppins.variable} antialiased`}>
                {children}
                <Toaster position="top-right" richColors closeButton />
            </body>
        </html>
    )
}
