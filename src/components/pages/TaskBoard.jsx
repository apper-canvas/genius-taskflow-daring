import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"
import Header from "@/components/organisms/Header"
import TaskList from "@/components/organisms/TaskList"
import TaskModal from "@/components/molecules/TaskModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"

const TaskBoard = () => {
  const { categoryName } = useParams()
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Filter by category or subcategory from URL
    if (categoryName) {
      filtered = filtered.filter(task => {
        const taskCategory = task.category_c || task.category || ""
        const taskSubcategory = task.subcategory_c || task.subcategory || ""
        
        // Check if it matches category or subcategory
        return taskCategory.toLowerCase() === categoryName.toLowerCase() ||
               taskSubcategory.toLowerCase() === categoryName.toLowerCase()
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => {
        const title = task.title_c || task.title || task.Name || ""
        const description = task.description_c || task.description || ""
        const category = task.category_c || task.category || ""
        
        return title.toLowerCase().includes(query) ||
               description.toLowerCase().includes(query) ||
               category.toLowerCase().includes(query)
      })
    }

    return filtered
  }, [tasks, categoryName, searchQuery])

const taskStats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed_c || t.completed).length
    const today = tasks.filter(t => {
      const dueDate = t.due_date_c || t.dueDate
      if (!dueDate) return false
      const taskDate = new Date(dueDate)
      const todayDate = new Date()
      return taskDate.toDateString() === todayDate.toDateString()
    }).length
    const upcoming = tasks.filter(t => {
      const dueDate = t.due_date_c || t.dueDate
      if (!dueDate) return false
      const taskDate = new Date(dueDate)
      const todayDate = new Date()
      const isCompleted = t.completed_c || t.completed
      return taskDate > todayDate && !isCompleted
    }).length

    return { total, completed, today, upcoming }
  }, [tasks])

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId)
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.Id === taskId ? updatedTask : task
        )
      )
    } catch (err) {
      throw new Error("Failed to update task")
    }
  }

const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, {
          ...taskData,
          completed_c: taskData.status_c === "completed" || taskData.completed_c
        })
        if (updatedTask) {
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.Id === editingTask.Id ? updatedTask : task
            )
          )
        }
      } else {
        const newTask = await taskService.create(taskData)
        if (newTask) {
          setTasks(prevTasks => [newTask, ...prevTasks])
        }
      }
    } catch (err) {
      throw new Error("Failed to save task")
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId))
    } catch (err) {
      throw new Error("Failed to delete task")
    }
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="h-full">
        <Header 
          onAddTask={handleAddTask}
          onSearch={setSearchQuery}
          totalTasks={0}
          completedTasks={0}
        />
        <div className="p-6">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full">
        <Header 
          onAddTask={handleAddTask}
          onSearch={setSearchQuery}
          totalTasks={0}
          completedTasks={0}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <Header
        onAddTask={handleAddTask}
        onSearch={setSearchQuery}
        totalTasks={taskStats.total}
        completedTasks={taskStats.completed}
      />

<div className="flex-1 p-6">
        {categoryName && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 capitalize">
{categoryName} Tasks
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} found
                  {(() => {
                    const urgentCount = filteredTasks.filter(task => {
                      const priority = task.priority_c || task.priority || "Medium"
                      const dueDate = task.due_date_c || task.dueDate
                      return priority === "High" || (dueDate && new Date(dueDate) <= new Date())
                    }).length
                    return urgentCount > 0 ? ` • ${urgentCount} urgent` : ""
                  })()}
                </p>
              </div>
              {(() => {
                const urgentCount = filteredTasks.filter(task => {
                  const priority = task.priority_c || task.priority || "Medium"
                  const dueDate = task.due_date_c || task.dueDate
                  return priority === "High" || (dueDate && new Date(dueDate) <= new Date())
                }).length
                return urgentCount > 0 ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <span className="animate-pulse">🚨</span>
                    <span className="text-sm font-medium">{urgentCount} Urgent Task{urgentCount !== 1 ? "s" : ""}</span>
                  </div>
                ) : null
              })()}
            </div>
          </motion.div>
        )}

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
emptyTitle={searchQuery ? "No matching tasks found" : categoryName ? `No ${categoryName.toLowerCase()} tasks` : "No tasks yet"}
          emptyDescription={searchQuery ? "Try adjusting your search terms" : "Create your first task to get started"}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
      />
    </motion.div>
  )
}

export default TaskBoard