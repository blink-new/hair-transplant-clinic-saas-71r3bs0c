import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { blink } from '@/blink/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  Upload,
  Camera,
  FileText,
  User,
  Heart,
  DollarSign,
  Calendar
} from 'lucide-react'

export default function PatientIntakeForm() {
  const { formId } = useParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const photoInputRef = useRef(null)
  const videoInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    
    // Medical History
    medicalConditions: [],
    medications: '',
    allergies: '',
    previousSurgeries: '',
    
    // Hair Information
    hairLossPattern: '',
    hairLossStarted: '',
    familyHistory: '',
    
    // Budget & Timeline
    budget: '',
    timeline: '',
    
    // Files
    photos: [],
    videos: []
  })

  const handleFileUpload = async (files, type) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const uploadedUrls = []

    try {
      for (const file of files) {
        const { publicUrl } = await blink.storage.upload(
          file,
          `patient-files/${formId}/${type}/${file.name}`,
          { upsert: true }
        )
        uploadedUrls.push({
          name: file.name,
          url: publicUrl,
          type: type,
          size: file.size
        })
      }

      setUploadedFiles(prev => [...prev, ...uploadedUrls])
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], ...uploadedUrls]
      }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { number: 1, title: "Personal Info", icon: <User className="h-5 w-5" /> },
    { number: 2, title: "Medical History", icon: <Heart className="h-5 w-5" /> },
    { number: 3, title: "Hair Information", icon: <FileText className="h-5 w-5" /> },
    { number: 4, title: "Photos & Videos", icon: <Camera className="h-5 w-5" /> },
    { number: 5, title: "Budget & Timeline", icon: <DollarSign className="h-5 w-5" /> }
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // TODO: Submit form data
    console.log('Form submitted:', formData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Do you have any of the following medical conditions? (Check all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Diabetes', 'High Blood Pressure', 'Heart Disease', 'Thyroid Issues', 'Autoimmune Disorders', 'Blood Clotting Disorders'].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox id={condition} />
                    <Label htmlFor={condition} className="text-sm">{condition}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={formData.medications}
                onChange={(e) => setFormData({...formData, medications: e.target.value})}
                placeholder="List any medications you're currently taking..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                placeholder="List any known allergies..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousSurgeries">Previous Surgeries</Label>
              <Textarea
                id="previousSurgeries"
                value={formData.previousSurgeries}
                onChange={(e) => setFormData({...formData, previousSurgeries: e.target.value})}
                placeholder="List any previous surgeries..."
                rows={3}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hairLossPattern">Hair Loss Pattern</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your hair loss pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male-pattern">Male Pattern Baldness</SelectItem>
                  <SelectItem value="female-pattern">Female Pattern Hair Loss</SelectItem>
                  <SelectItem value="alopecia-areata">Alopecia Areata</SelectItem>
                  <SelectItem value="diffuse-thinning">Diffuse Thinning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairLossStarted">When did your hair loss start?</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-1-year">Less than 1 year ago</SelectItem>
                  <SelectItem value="1-2-years">1-2 years ago</SelectItem>
                  <SelectItem value="3-5-years">3-5 years ago</SelectItem>
                  <SelectItem value="5-10-years">5-10 years ago</SelectItem>
                  <SelectItem value="more-than-10-years">More than 10 years ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyHistory">Family History of Hair Loss</Label>
              <Textarea
                id="familyHistory"
                value={formData.familyHistory}
                onChange={(e) => setFormData({...formData, familyHistory: e.target.value})}
                placeholder="Describe any family history of hair loss (parents, siblings, grandparents)..."
                rows={4}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Upload Photos of Your Hair</Label>
              <p className="text-sm text-gray-600">
                Please upload clear photos from different angles (front, top, sides, back). This helps our specialists assess your condition.
              </p>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => photoInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {isUploading ? 'Uploading...' : 'Drag and drop photos here, or click to browse'}
                </p>
                <Button variant="outline" disabled={isUploading}>
                  <Camera className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose Photos'}
                </Button>
                <input
                  ref={photoInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files), 'photos')}
                />
              </div>
              
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo.url} 
                        alt={photo.name}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <p className="text-xs text-gray-500 mt-1 truncate">{photo.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <Label>Upload Videos (Optional)</Label>
              <p className="text-sm text-gray-600">
                Short videos can provide additional context about your hair condition.
              </p>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => videoInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {isUploading ? 'Uploading...' : 'Drag and drop videos here, or click to browse'}
                </p>
                <Button variant="outline" disabled={isUploading}>
                  <Camera className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Choose Videos'}
                </Button>
                <input
                  ref={videoInputRef}
                  type="file"
                  multiple
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files), 'videos')}
                />
              </div>
              
              {formData.videos.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Camera className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{video.name}</p>
                        <p className="text-xs text-gray-500">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5000">Under $5,000</SelectItem>
                  <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10000-15000">$10,000 - $15,000</SelectItem>
                  <SelectItem value="15000-20000">$15,000 - $20,000</SelectItem>
                  <SelectItem value="over-20000">Over $20,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Preferred Timeline</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="When would you like to proceed?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">As soon as possible</SelectItem>
                  <SelectItem value="1-3-months">Within 1-3 months</SelectItem>
                  <SelectItem value="3-6-months">Within 3-6 months</SelectItem>
                  <SelectItem value="6-12-months">Within 6-12 months</SelectItem>
                  <SelectItem value="just-researching">Just researching</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any additional information you'd like to share with the clinic..."
                rows={4}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Intake Form</h1>
          <p className="text-gray-600">Form ID: {formId}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8 overflow-x-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center min-w-0 flex-1 ${
                step.number <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step.number <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.icon}
              </div>
              <span className="text-xs font-medium text-center">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {steps[currentStep - 1].icon}
              <span className="ml-2">{steps[currentStep - 1].title}</span>
            </CardTitle>
            <CardDescription>
              Please fill out all required fields to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit Form
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}