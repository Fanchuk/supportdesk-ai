import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import AssignmentPage from './pages/AssignmentPage'
import AutomationPage from './pages/AutomationPage'
import InboxPage from './pages/InboxPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import TicketDetailPage from './pages/TicketDetailPage'
import AssignmentRuleDetailPage from './pages/AssignmentRuleDetailPage'
import AutomationDetailPage from './pages/AutomationDetailPage'
import SlaManagementPage from './pages/SlaManagementPage'
import CustomTicketStatusPage from './pages/CustomTicketStatusPage'
import SavedAnswersPage from './pages/SavedAnswersPage'
import Layout from './components/layout/Layout'

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<Layout />}>
        <Route index element={<Navigate to='/dashboard' />} />
        <Route path='dashboard' element={<DashboardPage />} />
        <Route path='tickets' element={<TicketsPage />} />
        <Route path='tickets/:id' element={<TicketDetailPage />} />
        <Route path='profile' element={<ProfilePage />} />
        <Route path='assignment' element={<AssignmentPage />} />
        <Route path='assignment-rules/:id' element={<AssignmentRuleDetailPage />} />
        <Route path='automation' element={<AutomationPage />} />
        <Route path='automation/:id' element={<AutomationDetailPage />} />
        <Route path='sla' element={<SlaManagementPage />} />
        <Route path='inbox' element={<InboxPage />} />
        <Route path='custom-status' element={<CustomTicketStatusPage />} />
        <Route path='saved-answers' element={<SavedAnswersPage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App