import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"
import { categoryService } from "@/services/api/categoryService"
import { aiService } from "@/services/api/aiService"
const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null,
  categories = []
}) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    category_c: "Work",
    subcategory_c: "",
    priority_c: "Medium",
    status_c: "pending",
    due_date_c: ""
  })
const [isLoading, setIsLoading] = useState(false)
  const [subcategories, setSubcategories] = useState([])
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)

useEffect(() => {
    if (task) {
      const dueDate = task.due_date_c || task.dueDate
      setFormData({
        title_c: task.title_c || task.title || task.Name || "",
        description_c: task.description_c || task.description || "",
        category_c: task.category_c || task.category || "Work",
        subcategory_c: task.subcategory_c || task.subcategory || "",
        priority_c: task.priority_c || task.priority || "Medium",
        status_c: task.status_c || task.status || "pending",
        due_date_c: dueDate ? new Date(dueDate).toISOString().slice(0, 16) : ""
      })
    } else {
      setFormData({
        title_c: "",
        description_c: "",
        category_c: "Work",
        subcategory_c: "",
        priority_c: "Medium",
        status_c: "pending",
        due_date_c: ""
      })
    }
  }, [task, isOpen])

  // Load subcategories when category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      if (!formData.category_c) {
        setSubcategories([])
        return
      }

      const selectedCategory = categories.find(cat => 
        (cat.Name || cat.name) === formData.category_c
      )
      
      if (!selectedCategory || selectedCategory.Id === "all") {
        setSubcategories([])
        return
      }

      setLoadingSubcategories(true)
      try {
        const subs = await categoryService.getSubcategories(selectedCategory.Id)
        setSubcategories(subs)
        
        // Reset subcategory if current selection is not valid for new category
        if (formData.subcategory_c && !subs.find(sub => sub.name === formData.subcategory_c)) {
          setFormData(prev => ({ ...prev, subcategory_c: "" }))
        }
      } catch (error) {
        console.error("Failed to load subcategories:", error)
        setSubcategories([])
      } finally {
        setLoadingSubcategories(false)
      }
    }

    loadSubcategories()
  }, [formData.category_c, categories])
const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title_c.trim()) {
      toast.error("Please enter a task title")
      return
    }

    setIsLoading(true)
    try {
      const taskData = {
        ...formData,
        due_date_c: formData.due_date_c ? new Date(formData.due_date_c).toISOString() : null
      }
      
      await onSave(taskData)
      toast.success(task ? "Task updated successfully" : "Task created successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to save task")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerateDescription = async () => {
    if (!formData.title_c.trim()) {
      toast.error("Please enter a task title first")
      return
    }

    setGeneratingDescription(true)
    try {
      const generatedDescription = await aiService.generateTaskDescription(formData.title_c)
      handleChange("description_c", generatedDescription)
      toast.success("Description generated successfully!")
    } catch (error) {
      // Error handling is done in the service
      console.error("Failed to generate description:", error)
    } finally {
      setGeneratingDescription(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? "Edit Task" : "Add New Task"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <ApperIcon name="X" size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
<Input
              type="text"
              value={formData.title_c}
              onChange={(e) => handleChange("title_c", e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

<div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={!formData.title_c.trim() || generatingDescription}
                className="text-xs px-3 py-1 h-7"
              >
                {generatingDescription ? (
                  <>
                    <ApperIcon name="Loader2" size={12} className="animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Sparkles" size={12} className="mr-1" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={formData.description_c}
              onChange={(e) => handleChange("description_c", e.target.value)}
              placeholder="Enter task description (optional) or use AI to generate"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
<Select
                value={formData.category_c}
                onChange={(e) => handleChange("category_c", e.target.value)}
              >
                {categories.filter(cat => cat.Id !== "all").map(category => (
                  <option key={category.Id} value={category.Name || category.name}>
                    {category.Name || category.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <Select
                value={formData.subcategory_c}
                onChange={(e) => handleChange("subcategory_c", e.target.value)}
                disabled={loadingSubcategories || subcategories.length === 0}
              >
                <option value="">
                  {loadingSubcategories 
                    ? "Loading subcategories..." 
                    : subcategories.length === 0 
                      ? "No subcategories available" 
                      : "Select subcategory (optional)"}
                </option>
                {subcategories.map(subcategory => (
                  <option key={subcategory.Id} value={subcategory.name}>
                    {subcategory.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select
                value={formData.priority_c}
                onChange={(e) => handleChange("priority_c", e.target.value)}
              >
                <option value="Low">🔵 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority - Urgent</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <Select 
                value={formData.status_c}
                onChange={(e) => handleChange("status_c", e.target.value)}
              >
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="on-hold">⏸️ On Hold</option>
                <option value="completed">✅ Completed</option>
              </Select>
            </div>
          </div>
          
<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <Input
              type="datetime-local"
              value={formData.due_date_c}
              onChange={(e) => handleChange("due_date_c", e.target.value)}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                task ? "Update Task" : "Create Task"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default TaskModal