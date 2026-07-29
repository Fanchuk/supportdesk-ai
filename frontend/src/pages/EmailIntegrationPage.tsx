import EmailIntegrationHeader from '../components/emailIntegration/EmailIntegrationHeader'
import EmailIntegrationList from '../components/emailIntegration/EmailIntegrationList'

export default function EmailIntegrationPage() {
    return (
        <div className="flex flex-col gap-6">
            <EmailIntegrationHeader />
            <EmailIntegrationList />
        </div>
    )
}