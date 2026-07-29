import TeamWorkHeader from '../components/teamWork/TeamWorkHeader'
import TeamWorkList from '../components/teamWork/TeamWorkList'

export default function TeamWorkPage() {
    return (
        <div className="flex flex-col gap-6">
            <TeamWorkHeader />
            <TeamWorkList />
        </div>
    )
}