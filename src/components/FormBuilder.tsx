import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye, 
  Save,
  Palette,
  Upload,
  Settings
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
  }
}

interface FormBuilderProps {
  template?: FormTemplate
  onSave: (template: FormTemplate) => void
  onPreview: (template: FormTemplate) => void
}

export default function FormBuilder({ template, onSave, onPreview }: FormBuilderProps) {
  const [formTemplate, setFormTemplate] = useState<FormTemplate>(
    template || {
      id: '',
      name: '',
      description: '',
      fields: [
        {
          id: '1',
          type: 'text',
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true
        },
        {
          id: '2',
          type: 'text',
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true
        },
        {
          id: '3',
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true
        }
      ],
      branding: {
        primaryColor: '#2563EB',
        backgroundColor: '#F8FAFC',
        welcomeMessage: 'Welcome! Please fill out this intake form to help us better understand your needs.',
        thankYouMessage: 'Thank you for completing the form. We will review your information and get back to you soon.'
      }
    }
  )

  const [activeTab, setActiveTab] = useState<'fields' | 'branding'>('fields')

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false
    }
    setFormTemplate({
      ...formTemplate,
      fields: [...formTemplate.fields, newField]
    })
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormTemplate({
      ...formTemplate,
      fields: formTemplate.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    })
  }

  const removeField = (fieldId: string) => {
    setFormTemplate({
      ...formTemplate,
      fields: formTemplate.fields.filter(field => field.id !== fieldId)
    })
  }

  const getFieldTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝'
      case 'email': return '📧'
      case 'phone': return '📞'
      case 'textarea': return '📄'
      case 'select': return '📋'
      case 'checkbox': return '☑️'
      case 'file': return '📎'
      case 'date': return '📅'
      default: return '📝'
    }
  }

  const renderFieldEditor = (field: FormField) => (
    <Card key={field.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
            <span className="text-lg">{getFieldTypeIcon(field.type)}</span>
            <Badge variant="outline">{field.type}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeField(field.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Field Label</Label>
            <Input
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="Enter field label"
            />
          </div>

          <div className="space-y-2">
            <Label>Field Type</Label>
            <Select
              value={field.type}
              onValueChange={(value) => updateField(field.id, { type: value as FormField['type'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Input</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="textarea">Text Area</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {field.type !== 'checkbox' && field.type !== 'file' && (
            <div className="space-y-2">
              <Label>Placeholder Text</Label>
              <Input
                value={field.placeholder || ''}
                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
            />
            <Label>Required Field</Label>
          </div>
        </div>

        {field.type === 'select' && (
          <div className="mt-4 space-y-2">
            <Label>Options (one per line)</Label>
            <Textarea
              value={field.options?.join('\n') || ''}
              onChange={(e) => updateField(field.id, { options: e.target.value.split('\n').filter(Boolean) })}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={3}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderBrandingEditor = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Visual Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo Upload</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload your logo (PNG, JPG, SVG)</p>
              <Button variant="outline" size="sm" className="mt-2">
                Choose File
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={formTemplate.branding.primaryColor}
                  onChange={(e) => setFormTemplate({
                    ...formTemplate,
                    branding: { ...formTemplate.branding, primaryColor: e.target.value }
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={formTemplate.branding.primaryColor}
                  onChange={(e) => setFormTemplate({
                    ...formTemplate,
                    branding: { ...formTemplate.branding, primaryColor: e.target.value }
                  })}
                  placeholder="#2563EB"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={formTemplate.branding.backgroundColor}
                  onChange={(e) => setFormTemplate({
                    ...formTemplate,
                    branding: { ...formTemplate.branding, backgroundColor: e.target.value }
                  })}
                  className="w-16 h-10"
                />
                <Input
                  value={formTemplate.branding.backgroundColor}
                  onChange={(e) => setFormTemplate({
                    ...formTemplate,
                    branding: { ...formTemplate.branding, backgroundColor: e.target.value }
                  })}
                  placeholder="#F8FAFC"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Welcome Message</Label>
            <Textarea
              value={formTemplate.branding.welcomeMessage}
              onChange={(e) => setFormTemplate({
                ...formTemplate,
                branding: { ...formTemplate.branding, welcomeMessage: e.target.value }
              })}
              placeholder="Welcome message for patients"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Thank You Message</Label>
            <Textarea
              value={formTemplate.branding.thankYouMessage}
              onChange={(e) => setFormTemplate({
                ...formTemplate,
                branding: { ...formTemplate.branding, thankYouMessage: e.target.value }
              })}
              placeholder="Thank you message after form submission"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
          <p className="text-gray-600">Create and customize your patient intake forms</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onPreview(formTemplate)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => onSave(formTemplate)}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Form Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Form Name</Label>
                <Input
                  value={formTemplate.name}
                  onChange={(e) => setFormTemplate({ ...formTemplate, name: e.target.value })}
                  placeholder="e.g., Hair Transplant Intake Form"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formTemplate.description}
                  onChange={(e) => setFormTemplate({ ...formTemplate, description: e.target.value })}
                  placeholder="Brief description of this form"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Form Sections</Label>
                <div className="flex space-x-1">
                  <Button
                    variant={activeTab === 'fields' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('fields')}
                  >
                    Fields
                  </Button>
                  <Button
                    variant={activeTab === 'branding' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('branding')}
                  >
                    Branding
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Builder */}
        <div className="lg:col-span-2">
          {activeTab === 'fields' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Form Fields</h2>
                <Button onClick={addField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {formTemplate.fields.map(renderFieldEditor)}
              </div>

              {formTemplate.fields.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500 mb-4">No fields added yet</p>
                    <Button onClick={addField}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Field
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'branding' && renderBrandingEditor()}
        </div>
      </div>
    </div>
  )
}