'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import lbg from '@/app/assets/bg.webp'

export default function PrivateInsuranceView() {
    return (
        <div
            className="flex min-h-full items-center justify-center bg-gray-50/50 bg-cover bg-center bg-no-repeat p-8 bg-blend-overlay"
            style={{ backgroundImage: `url(${lbg.src})` }}
        >
            <Card className="w-full max-w-md border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-6 rounded-full bg-gray-100 p-6">
                        <Clock className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-2xl font-semibold text-gray-900">
                        Coming Soon
                    </h3>
                    <p className="text-gray-500">
                        Private Insurance records functionality will be
                        available soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
