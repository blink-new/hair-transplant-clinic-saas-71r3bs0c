import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageSquare, 
  QrCode,
  ExternalLink,
  Send,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface FormTemplate {
  id: string
  name: string
  description: string
  shareUrl: string
  qrCode?: string
}

interface SentForm {
  id: string
  patientName: string
  patientEmail: string
  formTemplate: FormTemplate
  status: 'sent' | 'opened' | 'completed' | 'expired'
  sentAt: string
  completedAt?: string
  expiresAt: string
}

interface FormSharingProps {
  template: FormTemplate
  onSendForm: (emails: string[], message: string) => void
}

export default function FormSharing({ template, onSendForm }: FormSharingProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false)
  const [recipientEmails, setRecipientEmails] = useState('')
  const [customMessage, setCustomMessage] = useState(`Hi there!

I'd like to invite you to complete our patient intake form. This will help us better understand your needs and provide you with the best possible care.

Please click the link below to get started:

The form should take about 10-15 minutes to complete.

If you have any questions, please don't hesitate to reach out.

Best regards`)

  // Mock data for demonstration
  const sentForms: SentForm[] = [
    {
      id: '1',
      patientName: 'John Smith',
      patientEmail: 'john@example.com',
      formTemplate: template,
      status: 'completed',
      sentAt: '2024-01-15T10:00:00Z',
      completedAt: '2024-01-15T14:30:00Z',
      expiresAt: '2024-01-22T10:00:00Z'
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      patientEmail: 'sarah@example.com',
      formTemplate: template,
      status: 'opened',
      sentAt: '2024-01-14T15:30:00Z',
      expiresAt: '2024-01-21T15:30:00Z'
    },
    {
      id: '3',
      patientName: 'Mike Chen',
      patientEmail: 'mike@example.com',
      formTemplate: template,
      status: 'sent',
      sentAt: '2024-01-13T09:15:00Z',
      expiresAt: '2024-01-20T09:15:00Z'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The form link has been copied to your clipboard.",
    })
  }

  const handleSendForm = () => {
    const emails = recipientEmails.split(',').map(email => email.trim()).filter(Boolean)
    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one email address.",
        variant: "destructive"
      })
      return
    }

    onSendForm(emails, customMessage)
    setIsSendDialogOpen(false)
    setRecipientEmails('')
    toast({
      title: "Forms sent successfully",
      description: `Intake forms have been sent to ${emails.length} recipient(s).`,
    })
  }

  const getStatusBadge = (status: SentForm['status']) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-blue-100 text-blue-800"><Mail className="h-3 w-3 mr-1" />Sent</Badge>
      case 'opened':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Opened</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><Clock className="h-3 w-3 mr-1" />Expired</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share Form: {template.name}
          </CardTitle>
          <CardDescription>
            Send this intake form to patients or share the link directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send to Patients
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Send Form to Patients</DialogTitle>
                  <DialogDescription>
                    Send personalized intake forms directly to your patients' email addresses
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Patient Email Addresses</Label>
                    <Textarea
                      value={recipientEmails}
                      onChange={(e) => setRecipientEmails(e.target.value)}
                      placeholder="Enter email addresses separated by commas&#10;john@example.com, sarah@example.com, mike@example.com"
                      rows={3}
                    />
                    <p className="text-sm text-gray-500">
                      Separate multiple email addresses with commas
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Message</Label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendForm}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Forms
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Form Link</DialogTitle>
                  <DialogDescription>
                    Share this link with patients to access the intake form
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="link" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="link">Link</TabsTrigger>
                    <TabsTrigger value="qr">QR Code</TabsTrigger>
                    <TabsTrigger value="embed">Embed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="link" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Form URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={template.shareUrl}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(template.shareUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => window.open(template.shareUrl, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Form in New Tab
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="qr" className="space-y-4">
                    <div className="text-center">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">
                        Patients can scan this QR code to access the form
                      </p>
                      <Button variant="outline" className="mt-2">
                        Download QR Code
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="embed" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Embed Code</Label>
                      <Textarea
                        value={`<iframe src="${template.shareUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                        readOnly
                        rows={3}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(`<iframe src="${template.shareUrl}" width="100%" height="600" frameborder="0"></iframe>`)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Embed Code
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{sentForms.length}</p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sentForms.filter(f => f.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((sentForms.filter(f => f.status === 'completed').length / sentForms.length) * 100)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">12m</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sent Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sent Forms</CardTitle>
          <CardDescription>
            Track the status of forms sent to patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sent</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Completed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Expires</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sentForms.map((form) => (
                  <tr key={form.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{form.patientName}</p>
                        <p className="text-sm text-gray-500">{form.patientEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(form.status)}
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">
                      {formatDate(form.sentAt)}
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">
                      {form.completedAt ? formatDate(form.completedAt) : '-'}
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">
                      {formatDate(form.expiresAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {form.status !== 'completed' && (
                          <Button variant="ghost" size="sm">
                            Resend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}