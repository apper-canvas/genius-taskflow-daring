import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"

const Header = ({ 
  onAddTask, 
  onSearch,
  totalTasks = 0,
  completedTasks = 0 
}) => {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-6 py-5"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">
TaskFlow Pro
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Stay organized, get things done
          </p>
        </div>
        
        <Button
          variant="accent"
          onClick={onAddTask}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={18} />
          <span>Add Task</span>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search tasks..."
          />
        </div>
        
        {totalTasks > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="ml-6 flex items-center space-x-4 text-sm text-gray-600"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
              <span>{totalTasks} total</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
              <span>{completedTasks} completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold gradient-text">
                {completionPercentage}%
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}

export default Header