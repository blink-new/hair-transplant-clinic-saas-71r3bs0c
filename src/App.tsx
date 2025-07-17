import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import LandingPage from '@/pages/LandingPage'
import AgentDashboard from '@/pages/AgentDashboard'
import ClinicDashboard from '@/pages/ClinicDashboard'
import PatientIntakeForm from '@/pages/PatientIntakeForm'
import AuthPage from '@/pages/AuthPage'
import FormManagement from '@/pages/FormManagement'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
          <Route path="/forms" element={<FormManagement />} />
          <Route path="/intake/:formId" element={<PatientIntakeForm />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App