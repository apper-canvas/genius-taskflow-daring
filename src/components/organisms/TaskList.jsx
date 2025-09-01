import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"
import Empty from "@/components/ui/Empty"

const TaskList = ({ 
  tasks = [], 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  onAddTask,
  emptyTitle = "No tasks found",
  emptyDescription = "Create your first task to get started",
  className = ""
}) => {
  if (tasks.length === 0) {
    return (
      <Empty
        title={emptyTitle}
        description={emptyDescription}
        onAction={onAddTask}
        actionText="Add Task"
        icon="CheckSquare"
        className={className}
      />
    )
  }

const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks first
    const aCompleted = a.completed_c || a.completed || false
    const bCompleted = b.completed_c || b.completed || false
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1
    }
    
    // Then by priority (High, Medium, Low)
    const priorityOrder = { High: 3, Medium: 2, Low: 1 }
    const aPriority = priorityOrder[a.priority_c || a.priority] || 1
    const bPriority = priorityOrder[b.priority_c || b.priority] || 1
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    
    // Then by due date (earliest first)
    const aDueDate = a.due_date_c || a.dueDate
    const bDueDate = b.due_date_c || b.dueDate
    if (aDueDate && bDueDate) {
      return new Date(aDueDate) - new Date(bDueDate)
    }
    if (aDueDate) return -1
    if (bDueDate) return 1
    
    // Finally by creation date (newest first)
    const aCreated = a.created_at_c || a.createdAt || a.CreatedOn
    const bCreated = b.created_at_c || b.createdAt || b.CreatedOn
    if (aCreated && bCreated) {
      return new Date(bCreated) - new Date(aCreated)
    }
    
    return 0
  })

  return (
    <div className={`space-y-4 ${className}`}>
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList