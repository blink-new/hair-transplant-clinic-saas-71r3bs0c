import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { blink } from '@/blink/client'
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Users,
  UserCheck,
  Clock,
  TrendingUp,
  Building,
  User,
  FileText,
  LogOut
} from 'lucide-react'

export default function ClinicDashboard() {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
    { title: "Total Patients", value: "342", icon: <Users className="h-5 w-5" />, change: "+23%" },
    { title: "From Agents", value: "156", icon: <UserCheck className="h-5 w-5" />, change: "+31%" },
    { title: "Direct Patients", value: "186", icon: <Building className="h-5 w-5" />, change: "+15%" },
    { title: "This Month", value: "47", icon: <TrendingUp className="h-5 w-5" />, change: "+8%" }
  ]

  const agentPatients = [
    {
      id: 1,
      name: "David Wilson",
      email: "david@example.com",
      agent: "Sarah Agent",
      status: "New Referral",
      date: "2024-01-15",
      stage: "new"
    },
    {
      id: 2,
      name: "Lisa Brown",
      email: "lisa@example.com",
      agent: "Mike Agent",
      status: "Under Review",
      date: "2024-01-14",
      stage: "review"
    },
    {
      id: 3,
      name: "Tom Anderson",
      email: "tom@example.com",
      agent: "Sarah Agent",
      status: "Consultation Scheduled",
      date: "2024-01-13",
      stage: "scheduled"
    }
  ]

  const directPatients = [
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@example.com",
      status: "Initial Consultation",
      date: "2024-01-15",
      stage: "consultation"
    },
    {
      id: 5,
      name: "James Miller",
      email: "james@example.com",
      status: "Treatment Plan Ready",
      date: "2024-01-14",
      stage: "plan"
    }
  ]

  const getStatusBadge = (stage: string) => {
    switch (stage) {
      case 'new':
        return <Badge className="bg-blue-100 text-blue-800">New Referral</Badge>
      case 'review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      case 'scheduled':
        return <Badge className="bg-green-100 text-green-800">Scheduled</Badge>
      case 'consultation':
        return <Badge className="bg-purple-100 text-purple-800">Consultation</Badge>
      case 'plan':
        return <Badge className="bg-indigo-100 text-indigo-800">Plan Ready</Badge>
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
              <span className="ml-4 text-gray-500">Clinic Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/agent/dashboard')}>
                <User className="h-4 w-4 mr-2" />
                View Agent Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/forms')}>
                <FileText className="h-4 w-4 mr-2" />
                Manage Forms
              </Button>
              <Button variant="outline">Export Data</Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.email?.[0]?.toUpperCase() || 'C'}
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
                  <div className="text-green-600">
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

        {/* Patient Management Tabs */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Manage patients from agents and direct inquiries</CardDescription>
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
            <Tabs defaultValue="agent-referrals" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="agent-referrals">Agent Referrals ({agentPatients.length})</TabsTrigger>
                <TabsTrigger value="direct-patients">Direct Patients ({directPatients.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="agent-referrals" className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Agent</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentPatients.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-500">{patient.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-900">{patient.agent}</td>
                          <td className="py-4 px-4">
                            {getStatusBadge(patient.stage)}
                          </td>
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
              </TabsContent>
              
              <TabsContent value="direct-patients" className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {directPatients.map((patient) => (
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}