import CustomStatusHeader from '../components/customStatus/CustomStatusHeader'
import DefaultStatuses from '../components/customStatus/DefaultStatuses'
import CustomStatuses from '../components/customStatus/CustomStatuses'

export default function CustomTicketStatusPage() {
    return (
        <div className="flex flex-col gap-6">
            <CustomStatusHeader />
            <DefaultStatuses />
            <CustomStatuses />
        </div>
    )
}
