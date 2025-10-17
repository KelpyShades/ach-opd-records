import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import logo from '@/app/assets/logo.png'
import lbg from '@/app/assets/bg.webp'
import FormClient from './clients/FormClient'
import { cookies } from 'next/headers'

export default async function Home() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    return (
        <div className="flex min-h-screen">
            {/* left */}
            <div className="flex flex-1 items-center justify-center">
                <Image
                    className="absolute top-4 left-4"
                    src={logo}
                    alt="logo"
                    width={100}
                    height={100}
                    priority
                />
                <FormClient />
            </div>
            <div
                className="bg-primary flex-1 bg-cover bg-center bg-no-repeat bg-blend-overlay"
                style={{ backgroundImage: `url(${lbg.src})` }}
            ></div>
            {/* right */}
        </div>
    )
}
