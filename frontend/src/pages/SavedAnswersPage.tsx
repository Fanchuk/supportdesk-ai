import SavedAnswersHeader from '../components/savedAnswers/SavedAnswersHeader'
import SavedAnswersList from '../components/savedAnswers/SavedAnswersList'

export default function SavedAnswersPage() {
    return (
        <div className="flex flex-col gap-6">
            <SavedAnswersHeader />
            <SavedAnswersList />
        </div>
    )
}