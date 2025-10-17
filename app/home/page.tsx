'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Sidebar from '@/app/home/components/Sidebar'
import NHISTableView from '@/app/home/components/NHISTableView'
import NHISInsertView from '@/app/home/components/NHISInsertView'
import PvtTableView from './components/PvtTableView'
import PvtInsertView from './components/PvtInsertView'

interface User {
    id: string
    email: string
}

export default function HomePage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState<'nhis' | 'private'>(
        'nhis'
    )
    const [activeView, setActiveView] = useState<'table' | 'insert'>('table')

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession()

            if (error || !session) {
                router.replace('/')
                return
            }

            setUser(session.user as User)
        } catch (error) {
            console.error('Error checking user:', error)
            router.replace('/')
        } finally {
            setLoading(false)
        }
    }

    const handleNavigate = (
        section: 'nhis' | 'private',
        view: 'table' | 'insert'
    ) => {
        setActiveSection(section)
        setActiveView(view)
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            toast.success('Logged out successfully')
            router.replace('/')
        } catch (error) {
            console.error('Error logging out:', error)
            toast.error('Error logging out')
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar
                activeSection={activeSection}
                activeView={activeView}
                onNavigate={handleNavigate}
                user={user}
                onLogout={handleLogout}
            />
            <main className="flex-1 overflow-auto">
                {activeSection === 'nhis' && activeView === 'table' && (
                    <NHISTableView />
                )}
                {activeSection === 'nhis' && activeView === 'insert' && (
                    <NHISInsertView />
                )}
                {activeSection === 'private' && activeView === 'table' && (
                    <PvtTableView />
                )}
                {activeSection === 'private' && activeView === 'insert' && (
                    <PvtInsertView />
                )}
            </main>
        </div>
    )
}
