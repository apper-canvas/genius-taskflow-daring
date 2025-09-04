import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import CategoryFilter from "@/components/molecules/CategoryFilter"
import { cn } from "@/utils/cn"

const Sidebar = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  taskStats = {},
  isOpen = true,
  onToggle
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    { 
      name: "All Tasks", 
      icon: "Grid3X3", 
      path: "/", 
      count: taskStats.total || 0 
    },
    { 
      name: "Today", 
      icon: "Calendar", 
      path: "/today", 
      count: taskStats.today || 0 
    },
    { 
      name: "Upcoming", 
      icon: "Clock", 
      path: "/upcoming", 
      count: taskStats.upcoming || 0 
    },
    { 
      name: "Completed", 
      icon: "CheckSquare", 
      path: "/completed", 
      count: taskStats.completed || 0 
    }
  ]

  // Desktop sidebar (static)
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-80 lg:h-full lg:bg-white lg:border-r lg:border-gray-200">
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Quick Access
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                )}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.name}</span>
                </div>
                {item.count > 0 && (
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    location.pathname === item.path
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
<h3 className="text-sm font-semibold text-gray-900 mb-4">
            Filter by Category
          </h3>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            className="space-y-2"
          />
        </div>
      </div>
    </div>
  )

  // Mobile sidebar (overlay with transforms)
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <ApperIcon name={isOpen ? "X" : "Menu"} size={20} />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* Mobile sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform"
      >
        <div className="h-full flex flex-col p-6 pt-20">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Quick Access
            </h2>
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path)
                    onToggle()
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <ApperIcon name={item.icon} size={16} />
                    <span>{item.name}</span>
                  </div>
                  {item.count > 0 && (
                    <span className={cn(
                      "px-2 py-1 text-xs font-medium rounded-full",
                      location.pathname === item.path
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    )}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Filter by Category
            </h3>
<CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(category) => {
                onCategoryChange(category)
                onToggle()
              }}
              className="space-y-2"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar