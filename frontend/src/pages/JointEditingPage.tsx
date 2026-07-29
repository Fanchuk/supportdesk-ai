import JointEditingHeader from '../components/jointEditing/JointEditingHeader'
import JointEditingStats from '../components/jointEditing/JointEditingStats'
import JointEditingList from '../components/jointEditing/JointEditingList'

export default function JointEditingPage() {
    return (
        <div className="flex flex-col gap-6">
            <JointEditingHeader />
            <JointEditingStats />
            <JointEditingList />
        </div>
    )
}