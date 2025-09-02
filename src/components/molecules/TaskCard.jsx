import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { differenceInDays, format, isAfter, isToday, isTomorrow } from "date-fns";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Checkbox from "@/components/atoms/Checkbox";
import Badge from "@/components/atoms/Badge";

const TaskCard = forwardRef(({ task, onToggleComplete, onEdit, onDelete, className = "" }, ref) => {

  // Enhanced urgency calculation logic
  const isTaskUrgent = (task) => {
    const priority = task.priority_c || task.priority || "Medium"
    const dueDate = task.due_date_c || task.dueDate
    
    if (priority === "High") {
      if (dueDate) {
        const daysDiff = differenceInDays(new Date(dueDate), new Date())
        return daysDiff <= 2 // High priority tasks due within 2 days are urgent
      }
      return true // All high priority tasks are urgent
    }
    
    if (dueDate) {
      const daysDiff = differenceInDays(new Date(dueDate), new Date())
      return daysDiff <= 0 // Any overdue task is urgent
    }
    
    return false
  }

  const getUrgencyVariant = (task) => {
    const priority = task.priority_c || task.priority || "Medium"
    const dueDate = task.due_date_c || task.dueDate
    
    if (isOverdue) return "overdue"
    if (isTaskUrgent(task)) return "critical"
    if (priority === "High") return "high-priority"
    if (dueDate && differenceInDays(new Date(dueDate), new Date()) <= 3) return "due-soon"
    
    return getPriorityColor(priority)
  }

  const getUrgencyIcon = (task) => {
    const priority = task.priority_c || task.priority || "Medium"
    
    if (isOverdue) return "AlertCircle"
    if (isTaskUrgent(task)) return "AlertTriangle"
    if (priority === "High") return "ChevronUp"
    if (priority === "Low") return "ChevronDown"
    
    return null
  }
  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(task.Id)
      toast.success(
        task.completed ? "Task marked as incomplete" : "Task completed! 🎉",
        { autoClose: 2000 }
      )
    } catch (error) {
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await onDelete(task.Id)
        toast.success("Task deleted successfully")
      } catch (error) {
        toast.error("Failed to delete task")
      }
    }
  }

  const formatDueDate = (dueDate) => {
    const date = new Date(dueDate)
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d")
  }

  const isDueSoon = () => {
const now = new Date()
    const dueDate = task.due_date_c || task.dueDate
    const due = new Date(dueDate)
    const hoursDiff = (due - now) / (1000 * 60 * 60)
    return hoursDiff > 0 && hoursDiff <= 24
  }

const isOverdue = () => {
    const dueDate = task.due_date_c || task.dueDate
    if (!dueDate) return false
    const now = new Date()
    const due = new Date(dueDate)
    const completed = task.completed_c || task.completed || false
    return isAfter(now, due) && !completed
  }

const getPriorityColor = (priority) => {
    const taskPriority = priority || task.priority_c || task.priority || "medium"
    switch (taskPriority.toLowerCase()) {
      case "high": return "danger"
      case "medium": return "warning"
      case "low": return "success"
      default: return "default"
    }
}

const getStatusColor = (status) => {
    const taskStatus = status || task.status_c || task.status || "pending"
    switch (taskStatus.toLowerCase()) {
      case "completed": return "success"
      case "in-progress": return "warning"
      case "pending": return "default"
      case "on-hold": return "secondary"
      default: return "default"
    }
  }

const getStatusLabel = (status) => {
    const taskStatus = status || task.status_c || task.status || "pending"
    switch (taskStatus.toLowerCase()) {
      case "completed": return "Completed"
      case "in-progress": return "In Progress"
      case "pending": return "Pending"
      case "on-hold": return "On Hold"
      default: return "Unknown"
    }
  }

const getCategoryVariant = (category) => {
    const taskCategory = category || task.category_c || task.category || "work"
    switch (taskCategory.toLowerCase()) {
      case "work": return "work"
      case "personal": return "personal"
      case "urgent": return "urgent"
      default: return "default"
    }
  }
  return (
<motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
"bg-white rounded-xl p-5 task-shadow hover:task-shadow-hover transition-all duration-200 group",
        (task.completed_c || task.completed) && "opacity-75",
        isOverdue() && "ring-2 ring-red-200",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="pt-0.5">
          <Checkbox
checked={task.completed_c || task.completed || false}
            onChange={handleToggleComplete}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h3 className={cn(
              "text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200",
(task.completed_c || task.completed) && "line-through text-gray-500"
            )}>
              {task.title_c || task.title || task.Name}
            </h3>
<div className="flex items-center space-x-2 ml-4">
              <Badge variant={getStatusColor((task.completed_c || task.completed) ? "completed" : (task.status_c || task.status))}>
                {getStatusLabel((task.completed_c || task.completed) ? "completed" : (task.status_c || task.status))}
              </Badge>
              <Badge variant={getUrgencyVariant(task)}>
                <div className="flex items-center space-x-1">
                  {getUrgencyIcon(task) && (
                    <ApperIcon name={getUrgencyIcon(task)} size={12} />
                  )}
                  <span>{task.priority_c || task.priority || "Medium"}</span>
                </div>
              </Badge>
              {isTaskUrgent(task) && (
                <Badge variant="critical">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="AlertTriangle" size={12} />
                    <span>URGENT</span>
                  </div>
                </Badge>
              )}
            </div>
          </div>
          
{(task.description_c || task.description) && (
            <p className={cn(
              "text-sm text-gray-600 mb-3 leading-relaxed",
              (task.completed_c || task.completed) && "line-through text-gray-400"
            )}>
              {task.description_c || task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
<Badge variant={getCategoryVariant()}>
                {task.category_c || task.category}
              </Badge>
              
{(task.due_date_c || task.dueDate) && (
                <div className={cn(
                  "flex items-center space-x-1 text-sm",
                  isOverdue() && !(task.completed_c || task.completed) ? "text-red-500" : 
                  isDueSoon() && !(task.completed_c || task.completed) ? "text-amber-600" : 
                  "text-gray-500"
                )}>
                  <ApperIcon 
                    name="Calendar" 
                    size={14}
                    className={cn(
                      isOverdue() && !(task.completed_c || task.completed) && "animate-pulse-gentle"
                    )}
                  />
                  <span>{formatDueDate(task.due_date_c || task.dueDate)}</span>
                  {isOverdue() && !(task.completed_c || task.completed) && (
                    <Badge variant="danger" className="ml-1">
                      Overdue
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="Edit3" size={14} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
</motion.div>
  )
})

TaskCard.displayName = "TaskCard"

export default TaskCard