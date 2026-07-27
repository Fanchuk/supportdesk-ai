import AutomationHeader from '../components/automation/AutomationHeader'
import AutomationStats from '../components/automation/AutomationStats'
import AutomationRules from '../components/automation/AutomationRules'

export default function AutomationPage() {
    return (
        <div className="flex flex-col gap-6">
            <AutomationHeader />
            <AutomationStats />
            <AutomationRules />
        </div>
    )
}
