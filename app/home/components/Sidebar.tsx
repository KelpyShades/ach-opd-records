'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    FileText,
    Plus,
    LogOut,
    User,
    ClipboardList,
    Briefcase,
} from 'lucide-react'
import logo from '@/app/assets/logo.png'

interface SidebarProps {
    activeSection: 'nhis' | 'private'
    activeView: 'table' | 'insert'
    onNavigate: (section: 'nhis' | 'private', view: 'table' | 'insert') => void
    user: { email: string } | null
    onLogout: () => void
}

export default function Sidebar({
    activeSection,
    activeView,
    onNavigate,
    user,
    onLogout,
}: SidebarProps) {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white">
            {/* Logo Section */}
            <div className="border-b p-6">
                <div className="flex items-center gap-3">
                    <Image
                        src={logo}
                        alt="Hospital Logo"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 space-y-1 p-4">
                {/* NHIS Section */}
                <div className="space-y-1">
                    <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        <ClipboardList className="h-4 w-4" />
                        <span>NHIS Records</span>
                    </div>
                    <Button
                        variant={
                            activeSection === 'nhis' && activeView === 'table'
                                ? 'default'
                                : 'ghost'
                        }
                        className="w-full justify-start gap-2"
                        onClick={() => onNavigate('nhis', 'table')}
                    >
                        <FileText className="h-4 w-4" />
                        View Records
                    </Button>
                    <Button
                        variant={
                            activeSection === 'nhis' && activeView === 'insert'
                                ? 'default'
                                : 'ghost'
                        }
                        className="w-full justify-start gap-2"
                        onClick={() => onNavigate('nhis', 'insert')}
                    >
                        <Plus className="h-4 w-4" />
                        Add Record
                    </Button>
                </div>

                <Separator className="my-4" />

                {/* Private Insurance Section */}
                <div className="space-y-1">
                    <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                        <Briefcase className="h-4 w-4" />
                        <span>Private Insurance</span>
                    </div>
                    <Button
                        variant={
                            activeSection === 'private' &&
                            activeView === 'table'
                                ? 'default'
                                : 'ghost'
                        }
                        className="w-full justify-start gap-2"
                        onClick={() => onNavigate('private', 'table')}
                    >
                        <FileText className="h-4 w-4" />
                        View Records
                    </Button>
                    <Button
                        variant={
                            activeSection === 'private' &&
                            activeView === 'insert'
                                ? 'default'
                                : 'ghost'
                        }
                        className="w-full justify-start gap-2"
                        onClick={() => onNavigate('private', 'insert')}
                    >
                        <Plus className="h-4 w-4" />
                        Add Record
                    </Button>
                </div>
            </nav>

            {/* User Section */}
            <div className="border-t p-4">
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="truncate text-sm text-gray-700">
                        {user?.email}
                    </span>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={onLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
