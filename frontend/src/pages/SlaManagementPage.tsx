import SlaHeader from '../components/sla/SlaHeader'
import SlaStats from '../components/sla/SlaStats'
import SlaPolicies from '../components/sla/SlaPolicies'
import SlaBreaches from '../components/sla/SlaBreaches'

export default function SlaManagementPage() {
    return (
        <div className="flex flex-col gap-6">
            <SlaHeader />
            <SlaStats />
            <SlaPolicies />
            <SlaBreaches />
        </div>
    )
}
