import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormBuilder from '@/components/FormBuilder'
import FormSharing from '@/components/FormSharing'
import BrandedFormPreview from '@/components/BrandedFormPreview'
import { toast } from '@/hooks/use-toast'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Share2,
  Copy,
  Trash2,
  Eye,
  FileText,
  Users,
  TrendingUp,
  Clock,
  ArrowLeft
} from 'lucide-react'

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'file' | 'date'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

interface FormTemplate {
  id: string
  name: string
  description: string
  fields: FormField[]
  branding: {
    logo?: string
    primaryColor: string
    backgroundColor: string
    welcomeMessage: string
    thankYouMessage: string
    organizationName?: string
    contactInfo?: string
  }
  shareUrl: string
  createdAt: string
  updatedAt: string
  stats: {
    sent: number
    completed: number
    completionRate: number
  }
}

export default function FormManagement() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeView, setActiveView] = useState<'list' | 'builder' | 'sharing' | 'preview'>('list')
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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

  // Mock data - in real app, this would come from API
  const [templates, setTemplates] = useState<FormTemplate[]>([
    {
      id: '1',
      name: 'Hair Transplant Consultation Form',
      description: 'Comprehensive intake form for new hair transplant patients',
      fields: [
        { id: '1', type: 'text', label: 'First Name', required: true },
        { id: '2', type: 'text', label: 'Last Name', required: true },
        { id: '3', type: 'email', label: 'Email Address', required: true },
        { id: '4', type: 'phone', label: 'Phone Number', required: true },
        { id: '5', type: 'select', label: 'Hair Loss Pattern', required: true, options: ['Male Pattern', 'Female Pattern', 'Alopecia Areata'] },
        { id: '6', type: 'textarea', label: 'Medical History', required: false },
        { id: '7', type: 'file', label: 'Hair Photos', required: true },
        { id: '8', type: 'select', label: 'Budget Range', required: true, options: ['Under $5,000', '$5,000-$10,000', '$10,000-$15,000', 'Over $15,000'] }
      ],
      branding: {
        primaryColor: '#2563EB',
        backgroundColor: '#F8FAFC',
        welcomeMessage: 'Welcome to our hair transplant consultation. Please fill out this form to help us understand your needs and provide the best possible care.',
        thankYouMessage: 'Thank you for completing the consultation form. Our team will review your information and contact you within 24 hours.',
        organizationName: 'Elite Hair Clinic',
        contactInfo: 'support@elitehair.com | (555) 123-4567'
      },
      shareUrl: 'https://forms.hairflow.com/intake/hair-transplant-consultation-1',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      stats: {
        sent: 45,
        completed: 32,
        completionRate: 71
      }
    },
    {
      id: '2',
      name: 'Follow-up Assessment Form',
      description: 'Post-procedure follow-up form for existing patients',
      fields: [
        { id: '1', type: 'text', label: 'Patient ID', required: true },
        { id: '2', type: 'date', label: 'Procedure Date', required: true },
        { id: '3', type: 'select', label: 'Overall Satisfaction', required: true, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
        { id: '4', type: 'textarea', label: 'Recovery Progress', required: false },
        { id: '5', type: 'file', label: 'Progress Photos', required: false }
      ],
      branding: {
        primaryColor: '#10B981',
        backgroundColor: '#F0FDF4',
        welcomeMessage: 'We hope your recovery is going well! Please help us track your progress with this follow-up form.',
        thankYouMessage: 'Thank you for your feedback. We will review your progress and reach out if needed.',
        organizationName: 'Elite Hair Clinic',
        contactInfo: 'followup@elitehair.com | (555) 123-4567'
      },
      shareUrl: 'https://forms.hairflow.com/intake/follow-up-assessment-2',
      createdAt: '2024-01-12T15:00:00Z',
      updatedAt: '2024-01-14T09:15:00Z',
      stats: {
        sent: 23,
        completed: 19,
        completionRate: 83
      }
    }
  ])

  const stats = {
    totalForms: templates.length,
    totalSent: templates.reduce((sum, t) => sum + t.stats.sent, 0),
    totalCompleted: templates.reduce((sum, t) => sum + t.stats.completed, 0),
    avgCompletionRate: Math.round(templates.reduce((sum, t) => sum + t.stats.completionRate, 0) / templates.length)
  }

  const handleCreateNew = () => {
    setSelectedTemplate(null)
    setActiveView('builder')
  }

  const handleEditTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setActiveView('builder')
  }

  const handleShareTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setActiveView('sharing')
  }

  const handlePreviewTemplate = (template: FormTemplate) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleSaveTemplate = (template: FormTemplate) => {
    if (template.id) {
      // Update existing template
      setTemplates(prev => prev.map(t => t.id === template.id ? {
        ...template,
        updatedAt: new Date().toISOString()
      } : t))
      toast({
        title: "Template updated",
        description: "Your form template has been updated successfully.",
      })
    } else {
      // Create new template
      const newTemplate: FormTemplate = {
        ...template,
        id: Date.now().toString(),
        shareUrl: `https://forms.hairflow.com/intake/${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: { sent: 0, completed: 0, completionRate: 0 }
      }
      setTemplates(prev => [...prev, newTemplate])
      toast({
        title: "Template created",
        description: "Your new form template has been created successfully.",
      })
    }
    setActiveView('list')
  }

  const handleSendForm = (emails: string[], message: string) => {
    // In real app, this would send emails via API
    console.log('Sending form to:', emails, 'with message:', message)
    toast({
      title: "Forms sent",
      description: `Intake forms have been sent to ${emails.length} recipient(s).`,
    })
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
    toast({
      title: "Template deleted",
      description: "The form template has been deleted successfully.",
    })
  }

  const copyShareUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "The form link has been copied to your clipboard.",
    })
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (activeView === 'builder') {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button
                variant="ghost"
                onClick={() => setActiveView('list')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forms
              </Button>
              <h1 className="text-xl font-semibold">
                {selectedTemplate ? 'Edit Form Template' : 'Create New Form Template'}
              </h1>
            </div>
          </div>
        </div>
        <FormBuilder
          template={selectedTemplate || undefined}
          onSave={handleSaveTemplate}
          onPreview={handlePreviewTemplate}
        />
      </div>
    )
  }

  if (activeView === 'sharing' && selectedTemplate) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button
                variant="ghost"
                onClick={() => setActiveView('list')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Forms
              </Button>
              <h1 className="text-xl font-semibold">Share Form Template</h1>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FormSharing
            template={selectedTemplate}
            onSendForm={handleSendForm}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">HairFlow</h1>
              <span className="ml-4 text-gray-500">Form Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/agent/dashboard')}>
                Back to Dashboard
              </Button>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Forms</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalForms}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Forms Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSent}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCompleted}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgCompletionRate}%</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Templates */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Form Templates</CardTitle>
                <CardDescription>Manage your branded intake forms</CardDescription>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search forms..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareTemplate(template)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Fields:</span>
                        <span className="font-medium">{template.fields.length}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Sent:</span>
                        <span className="font-medium">{template.stats.sent}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium">{template.stats.completed}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completion Rate:</span>
                        <Badge 
                          variant={template.stats.completionRate > 70 ? "default" : "secondary"}
                          className={template.stats.completionRate > 70 ? "bg-green-100 text-green-800" : ""}
                        >
                          {template.stats.completionRate}%
                        </Badge>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyShareUrl(template.shareUrl)}
                            className="flex-1"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy Link
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareTemplate(template)}
                            className="flex-1"
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No forms found' : 'No forms created yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Create your first branded intake form to get started'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Form
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Form Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
            {selectedTemplate && (
              <BrandedFormPreview
                template={selectedTemplate}
                isPreview={true}
                onClose={() => setIsPreviewOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}