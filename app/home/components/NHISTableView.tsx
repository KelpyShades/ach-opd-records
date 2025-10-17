'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Search,
    Trash2,
    Edit,
    CalendarIcon,
    Filter,
    RefreshCw,
} from 'lucide-react'
import { format } from 'date-fns'
import lbg from '@/app/assets/bg.webp'

interface NHISRecord {
    id: string
    opd_number: string
    nhis_number: string
    ccc: string
    created_at: string
}

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(handler)
    }, [value, delay])

    return debouncedValue
}

export default function NHISTableView() {
    const [records, setRecords] = useState<NHISRecord[]>([])
    const [filteredRecords, setFilteredRecords] = useState<NHISRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
    const [isSearching, setIsSearching] = useState(false)

    // Search states
    const [searchOPD, setSearchOPD] = useState('')
    const [searchNHIS, setSearchNHIS] = useState('')
    const [searchCCC, setSearchCCC] = useState('')

    // Date filter states
    const [filterYear, setFilterYear] = useState<string>('all')
    const [filterMonth, setFilterMonth] = useState<string>('all')
    const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

    // Edit dialog
    const [editDialog, setEditDialog] = useState(false)
    const [editingRecord, setEditingRecord] = useState<NHISRecord | null>(null)
    const [editForm, setEditForm] = useState({
        opd_number: '',
        nhis_number: '',
        ccc: '',
    })

    // Delete dialog
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deletingIds, setDeletingIds] = useState<string[]>([])

    const supabase = createClient()

    // Debounced search values (600ms delay for text inputs)
    const debouncedOPD = useDebounce(searchOPD, 600)
    const debouncedNHIS = useDebounce(searchNHIS, 600)
    const debouncedCCC = useDebounce(searchCCC, 600)

    useEffect(() => {
        fetchRecords()
    }, [])

    // Auto-trigger search when debounced values or date filters change
    useEffect(() => {
        const hasSearchCriteria =
            debouncedOPD ||
            debouncedNHIS ||
            debouncedCCC ||
            filterYear !== 'all' ||
            filterMonth !== 'all' ||
            filterDate

        if (hasSearchCriteria) {
            // Server-side search across all records
            fetchRecords(true)
        } else if (isSearching) {
            // Reset to last 100 when all filters are cleared
            fetchRecords(false)
        }
    }, [
        debouncedOPD,
        debouncedNHIS,
        debouncedCCC,
        filterYear,
        filterMonth,
        filterDate,
    ])

    const fetchRecords = useCallback(
        async (serverSearch = false) => {
            try {
                setLoading(true)
                let query = supabase
                    .from('records_nhis')
                    .select('*')
                    .order('created_at', { ascending: false })

                // Server-side search when filters are applied
                if (serverSearch) {
                    if (debouncedOPD) {
                        query = query.ilike('opd_number', `%${debouncedOPD}%`)
                    }
                    if (debouncedNHIS) {
                        query = query.ilike('nhis_number', `%${debouncedNHIS}%`)
                    }
                    if (debouncedCCC) {
                        query = query.ilike('ccc', `%${debouncedCCC}%`)
                    }
                    if (filterYear !== 'all') {
                        const yearStart = `${filterYear}-01-01`
                        const yearEnd = `${filterYear}-12-31`
                        query = query
                            .gte('created_at', yearStart)
                            .lte('created_at', yearEnd)
                    }
                    if (filterMonth !== 'all' && filterYear !== 'all') {
                        const year = filterYear
                        const month = filterMonth.padStart(2, '0')
                        const monthStart = `${year}-${month}-01`
                        const nextMonth =
                            filterMonth === '12'
                                ? `${parseInt(year) + 1}-01-01`
                                : `${year}-${(parseInt(month) + 1).toString().padStart(2, '0')}-01`
                        query = query
                            .gte('created_at', monthStart)
                            .lt('created_at', nextMonth)
                    }
                    if (filterDate) {
                        const dateStr = format(filterDate, 'yyyy-MM-dd')
                        query = query
                            .gte('created_at', dateStr)
                            .lt('created_at', dateStr + 'T23:59:59')
                    }
                    // Don't limit when searching
                    setIsSearching(true)
                } else {
                    // Only limit to 100 when NOT searching
                    query = query.limit(100)
                    setIsSearching(false)
                }

                const { data, error } = await query

                if (error) {
                    toast.error('Failed to fetch records: ' + error.message)
                    return
                }

                setRecords(data || [])
                setFilteredRecords(data || [])
            } catch (error) {
                console.error('Error fetching records:', error)
                toast.error('An unexpected error occurred')
            } finally {
                setLoading(false)
            }
        },
        [
            debouncedOPD,
            debouncedNHIS,
            debouncedCCC,
            filterYear,
            filterMonth,
            filterDate,
        ]
    )

    const handleClearFilters = () => {
        setSearchOPD('')
        setSearchNHIS('')
        setSearchCCC('')
        setFilterYear('all')
        setFilterMonth('all')
        setFilterDate(undefined)
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(filteredRecords.map((r) => r.id)))
        } else {
            setSelectedRows(new Set())
        }
    }

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSelected = new Set(selectedRows)
        if (checked) {
            newSelected.add(id)
        } else {
            newSelected.delete(id)
        }
        setSelectedRows(newSelected)
    }

    const openEditDialog = (record: NHISRecord) => {
        setEditingRecord(record)
        setEditForm({
            opd_number: record.opd_number,
            nhis_number: record.nhis_number,
            ccc: record.ccc,
        })
        setEditDialog(true)
    }

    const handleEdit = async () => {
        if (!editingRecord) return

        try {
            const { error } = await supabase
                .from('records_nhis')
                .update(editForm)
                .eq('id', editingRecord.id)

            if (error) {
                toast.error('Failed to update record: ' + error.message)
                return
            }

            toast.success('Record updated successfully!')
            setEditDialog(false)
            fetchRecords()
        } catch (error) {
            console.error('Error updating record:', error)
            toast.error('An unexpected error occurred')
        }
    }

    const openDeleteDialog = (ids: string[]) => {
        setDeletingIds(ids)
        setDeleteDialog(true)
    }

    const handleDelete = async () => {
        try {
            const { error } = await supabase
                .from('records_nhis')
                .delete()
                .in('id', deletingIds)

            if (error) {
                toast.error('Failed to delete record(s): ' + error.message)
                return
            }

            toast.success(
                `${deletingIds.length} record(s) deleted successfully!`
            )
            setDeleteDialog(false)
            setSelectedRows(new Set())
            fetchRecords()
        } catch (error) {
            console.error('Error deleting records:', error)
            toast.error('An unexpected error occurred')
        }
    }

    const years = Array.from(
        new Set(records.map((r) => new Date(r.created_at).getFullYear()))
    ).sort((a, b) => b - a)

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ]

    return (
        <div
            className="flex h-full flex-col bg-gray-50/50 bg-cover bg-center bg-no-repeat p-8 bg-blend-overlay"
            style={{ backgroundImage: `url(${lbg.src})` }}
        >
            <Card
                className="flex flex-col overflow-hidden"
                style={{ height: 'calc(100vh - 4rem)' }}
            >
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">
                            NHIS Records
                            {isSearching && (
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    (Filtered)
                                </span>
                            )}
                            {loading && (
                                <span className="ml-2 text-sm font-normal text-gray-400">
                                    (Searching...)
                                </span>
                            )}
                        </CardTitle>
                        <div className="flex gap-2">
                            {(isSearching ||
                                searchOPD ||
                                searchNHIS ||
                                searchCCC ||
                                filterYear !== 'all' ||
                                filterMonth !== 'all' ||
                                filterDate) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearFilters}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            )}
                            {selectedRows.size > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                        openDeleteDialog(
                                            Array.from(selectedRows) as string[]
                                        )
                                    }
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Selected ({selectedRows.size})
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Search Filters */}
                    <div className="flex flex-col flex-wrap justify-evenly gap-4 md:flex-row">
                        <div className="flex-1">
                            <Label htmlFor="search-opd" className="mb-2 block">
                                Search OPD Number
                            </Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search-opd"
                                    placeholder="Search..."
                                    value={searchOPD}
                                    onChange={(e) =>
                                        setSearchOPD(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="search-nhis" className="mb-2 block">
                                Search NHIS Number
                            </Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search-nhis"
                                    placeholder="Search..."
                                    value={searchNHIS}
                                    onChange={(e) =>
                                        setSearchNHIS(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="search-ccc" className="mb-2 block">
                                Search CCC
                            </Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search-ccc"
                                    placeholder="Search..."
                                    value={searchCCC}
                                    onChange={(e) =>
                                        setSearchCCC(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">
                                Filter by Date:
                            </span>
                        </div>
                        <Select
                            value={filterYear}
                            onValueChange={setFilterYear}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {years.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filterMonth}
                            onValueChange={setFilterMonth}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Months</SelectItem>
                                {months.map((month) => (
                                    <SelectItem
                                        key={month.value}
                                        value={month.value}
                                    >
                                        {month.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-60 justify-start"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filterDate
                                        ? format(filterDate, 'PPP')
                                        : 'Pick a specific day'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={filterDate}
                                    onSelect={setFilterDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Table */}
                    <div
                        className="flex flex-col overflow-hidden rounded-lg border"
                        style={{ height: 'calc(100vh - 380px)' }}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                                    <p className="text-gray-500">
                                        Loading records...
                                    </p>
                                </div>
                            </div>
                        ) : filteredRecords.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                No records found
                            </div>
                        ) : (
                            // <div className="overflow-auto ">
                            <Table>
                                <TableHeader className="sticky z-10 top-0 bg-white shadow-sm">
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={
                                                    selectedRows.size ===
                                                        filteredRecords.length &&
                                                    filteredRecords.length > 0
                                                }
                                                onCheckedChange={
                                                    handleSelectAll
                                                }
                                            />
                                        </TableHead>
                                        <TableHead>OPD Number</TableHead>
                                        <TableHead>NHIS Number</TableHead>
                                        <TableHead>CCC</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedRows.has(
                                                        record.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleSelectRow(
                                                            record.id,
                                                            checked as boolean
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {record.opd_number}
                                            </TableCell>
                                            <TableCell>
                                                {record.nhis_number}
                                            </TableCell>
                                            <TableCell>{record.ccc}</TableCell>
                                            <TableCell>
                                                {format(
                                                    new Date(record.created_at),
                                                    'PP'
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEditDialog(
                                                                record
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            openDeleteDialog([
                                                                record.id,
                                                            ])
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            // </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-500">
                        {isSearching ? (
                            <>
                                Found <strong>{filteredRecords.length}</strong>{' '}
                                matching record
                                {filteredRecords.length !== 1 ? 's' : ''}
                            </>
                        ) : (
                            <>
                                Showing last <strong>{records.length}</strong>{' '}
                                records
                                <span className="ml-1 text-gray-400">
                                    (type to search across all records)
                                </span>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Record</DialogTitle>
                        <DialogDescription>
                            Make changes to the record below
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="edit-opd">OPD Number</Label>
                            <Input
                                id="edit-opd"
                                value={editForm.opd_number}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        opd_number: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-nhis">NHIS Number</Label>
                            <Input
                                id="edit-nhis"
                                value={editForm.nhis_number}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        nhis_number: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="edit-ccc">CCC</Label>
                            <Input
                                id="edit-ccc"
                                value={editForm.ccc}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        ccc: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deletingIds.length}{' '}
                            record
                            {deletingIds.length > 1 ? 's' : ''}? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
