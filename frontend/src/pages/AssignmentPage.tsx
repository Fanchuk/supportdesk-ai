import AssignmentHeader from '../components/assignment/AssignmentHeader'
import TeamCards from '../components/assignment/TeamCards'
import AssignmentRules from '../components/assignment/AssignmentRules'

export default function AssignmentPage() {
    return (
        <div className="flex flex-col gap-6">
            <AssignmentHeader />
            <TeamCards />
            <AssignmentRules />
        </div>
    )
}
