"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

function AddMember() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    bgmiId: "",
    role: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    name: "",
    bgmiId: "",
    role: ""
  })

  const roles = [
    "Captain",
    "IGL (In-Game Leader)", 
    "Fragger",
    "Support",
    "Sniper",
    "Entry Fragger",
    "Lurker",
    "Anchor"
  ]

  const validateForm = () => {
    const newErrors = {
      name: "",
      bgmiId: "",
      role: ""
    }

    let isValid = true

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
      isValid = false
    }

    if (!formData.bgmiId.trim()) {
      newErrors.bgmiId = "BGMI ID is required"
      isValid = false
    } else if (formData.bgmiId.trim().length < 3) {
      newErrors.bgmiId = "BGMI ID must be at least 3 characters"
      isValid = false
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true)
    
    try {
      const res = await fetch("/api/team/member/add", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          member : { 
            name: formData.name.trim(),
            bgmiId: formData.bgmiId.trim(),
            role: formData.role.trim()
          }
        })
      })

      const data = await res.json()
      if (!res.ok) { 
          alert(data.error || "Failed to add member");
        }
      if (res.ok) {   
        router.push("/dashboard/team")
        
      } else {
        alert(data.error || "Failed to add member")
      }
    } catch (error: unknown) {
      alert("Failed to add member. Please try again." + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/dashboard/team")
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">Add New Member</h1>
          <p className="text-gray-400 mt-2">Add a new member to your team</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.name 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-700 focus:ring-red-500 focus:border-red-500"
                }`}
                placeholder="Enter member's name"
                maxLength={50}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* BGMI ID Field */}
            <div>
              <label htmlFor="bgmiId" className="block text-sm font-medium text-gray-300 mb-2">
                BGMI ID *
              </label>
              <input
                type="text"
                id="bgmiId"
                name="bgmiId"
                value={formData.bgmiId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.bgmiId 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-700 focus:ring-red-500 focus:border-red-500"
                }`}
                placeholder="Enter BGMI ID"
                maxLength={30}
                disabled={isLoading}
              />
              {errors.bgmiId && (
                <p className="mt-1 text-sm text-red-400">{errors.bgmiId}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Role *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.role 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-700 focus:ring-red-500 focus:border-red-500"
                }`}
                placeholder="Enter role (e.g., Fragger, Support, IGL, etc.)"
                maxLength={30}
                disabled={isLoading}
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-400">{errors.role}</p>
              )}
              <div className="mt-2">
                <p className="text-xs text-gray-400 mb-2">Common roles:</p>
                <div className="flex flex-wrap gap-1">
                  {roles.map((suggestedRole) => (
                    <button
                      key={suggestedRole}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, role: suggestedRole }))}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors cursor-pointer"
                      disabled={isLoading}
                    >
                      {suggestedRole}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
              <button
                type= "submit"
                disabled={isLoading}
                
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors cursor-pointer ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 active:bg-red-800"
                } text-white focus:outline-none focus:ring-2 focus:ring-red-500`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center  ">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Member...
                  </span>
                ) : (
                  "Add Member"
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-red-400 mb-2">Tips:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Make sure the BGMI ID is correct and active</li>
              <li>• Enter a role that fits the members playstyle</li>
              <li>• You can click on suggested roles or type your own</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMember