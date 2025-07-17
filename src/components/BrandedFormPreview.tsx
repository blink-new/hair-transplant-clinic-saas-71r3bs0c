import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle,
  Building2
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
}

interface BrandedFormPreviewProps {
  template: FormTemplate
  isPreview?: boolean
  onSubmit?: (data: Record<string, any>) => void
  onClose?: () => void
}

export default function BrandedFormPreview({ 
  template, 
  isPreview = false, 
  onSubmit,
  onClose 
}: BrandedFormPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Group fields into steps (max 5 fields per step)
  const fieldsPerStep = 5
  const steps = []
  for (let i = 0; i < template.fields.length; i += fieldsPerStep) {
    steps.push(template.fields.slice(i, i + fieldsPerStep))
  }

  const totalSteps = steps.length
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 100

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData)
    }
    setIsSubmitted(true)
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ''

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value || false}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>
        )

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          </div>
        )

      default:
        return null
    }
  }

  if (isSubmitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: template.branding.backgroundColor }}
      >
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: template.branding.primaryColor }}
            >
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            <p className="text-gray-600 mb-6">
              {template.branding.thankYouMessage}
            </p>
            <div className="text-sm text-gray-500">
              <p>Form ID: {template.id}</p>
              <p>Submitted: {new Date().toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{ backgroundColor: template.branding.backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {template.branding.logo && (
            <div className="mb-4">
              <img 
                src={template.branding.logo} 
                alt="Logo" 
                className="h-12 mx-auto"
              />
            </div>
          )}
          
          <div className="flex items-center justify-center mb-2">
            <Building2 className="h-6 w-6 mr-2" style={{ color: template.branding.primaryColor }} />
            <h1 className="text-3xl font-bold text-gray-900">
              {template.name}
            </h1>
          </div>
          
          {template.description && (
            <p className="text-gray-600 mb-4">{template.description}</p>
          )}
          
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 bg-white/50 rounded-lg p-4">
              {template.branding.welcomeMessage}
            </p>
          </div>

          {isPreview && (
            <div className="mt-4">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Preview Mode
              </Badge>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {totalSteps > 1 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              style={{ 
                backgroundColor: '#e5e7eb',
              }}
            />
          </div>
        )}

        {/* Form Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {totalSteps > 1 ? `Step ${currentStep + 1}` : 'Form Details'}
            </CardTitle>
            <CardDescription>
              Please fill out all required fields to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {steps[currentStep]?.map(renderField)}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            {isPreview && onClose && (
              <Button variant="outline" onClick={onClose}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}

            {currentStep < totalSteps - 1 ? (
              <Button 
                onClick={handleNext}
                style={{ backgroundColor: template.branding.primaryColor }}
                className="text-white hover:opacity-90"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                style={{ backgroundColor: template.branding.primaryColor }}
                className="text-white hover:opacity-90"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Form
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by HairFlow - Professional Hair Transplant Management</p>
          {template.branding.contactInfo && (
            <p className="mt-1">{template.branding.contactInfo}</p>
          )}
        </div>
      </div>
    </div>
  )
}