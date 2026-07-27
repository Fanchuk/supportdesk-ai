import { useState } from 'react'
import TicketsHeader from '../components/tickets/TicketsHeader'
import TicketsTable from '../components/tickets/TicketsTable'
import AddTicketModal from '../components/header/AddTicketModal'

export default function TicketsPage() {
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest')
    const [showModal, setShowModal] = useState(false)

    return (
        <div className="flex flex-col gap-4">
            <TicketsHeader sort={sort} onSortChange={setSort} />
            <TicketsTable sort={sort} onCreateClick={() => setShowModal(true)} />

                <AddTicketModal open={showModal} onClose={() => setShowModal(false)}/>
        </div>
    )
}
