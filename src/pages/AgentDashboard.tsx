import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { blink } from '@/blink/client'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Building,
  LogOut
} from 'lucide-react'

export default function AgentDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser(state.user)
      } else if (!state.isLoading) {
        navigate('/auth')
      }
      setIsLoading(state.isLoading)
    })

    return unsubscribe
  }, [navigate])

  const handleLogout = () => {
    blink.auth.logout('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Mock data
  const stats = [
    { title: "Total Patients", value: "127", icon: <Users className="h-5 w-5" />, change: "+12%" },
    { title: "Active Forms", value: "23", icon: <FileText className="h-5 w-5" />, change: "+5%" },
    { title: "Pending Reviews", value: "8", icon: <Clock className="h-5 w-5" />, change: "-2%" },
    { title: "Completed", value: "96", icon: <CheckCircle className="h-5 w-5" />, change: "+18%" }
  ]

  const patients = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      status: "Form Completed",
      clinic: "Elite Hair Clinic",
      date: "2024-01-15",
      stage: "completed"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      status: "Pending Review",
      clinic: "Premium Hair Center",
      date: "2024-01-14",
      stage: "pending"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@example.com",
      status: "Form Sent",
      clinic: "Advanced Hair Solutions",
      date: "2024-01-13",
      stage: "sent"
    }
  ]

  const getStatusBadge = (stage: string) => {
    switch (stage) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800">Form Sent</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">HairFlow</h1>
              <span className="ml-4 text-gray-500">Agent Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/clinic/dashboard')}>
                <Building className="h-4 w-4 mr-2" />
                View Clinic Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/forms')}>
                <FileText className="h-4 w-4 mr-2" />
                Manage Forms
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Patient
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Manage your patients and track their progress</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Clinic</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(patient.stage)}
                      </td>
                      <td className="py-4 px-4 text-gray-900">{patient.clinic}</td>
                      <td className="py-4 px-4 text-gray-500">{patient.date}</td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}