import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { categoryService } from "@/services/api/categoryService"

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  className = "" 
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [subcategories, setSubcategories] = useState({})
  const [loadingSubcategories, setLoadingSubcategories] = useState({})

  const allCategory = { Id: "all", name: "All", color: "#6B7280", icon: "Grid3X3" }
  const filterCategories = [allCategory, ...categories]

  // Load subcategories for a category
  const loadSubcategories = async (categoryId) => {
    if (subcategories[categoryId] || loadingSubcategories[categoryId]) return

    setLoadingSubcategories(prev => ({ ...prev, [categoryId]: true }))
    try {
      const subs = await categoryService.getSubcategories(categoryId)
      setSubcategories(prev => ({ ...prev, [categoryId]: subs }))
    } catch (error) {
      console.error("Failed to load subcategories:", error)
    } finally {
      setLoadingSubcategories(prev => ({ ...prev, [categoryId]: false }))
    }
  }

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
      loadSubcategories(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {filterCategories.map((category) => {
        const categoryName = category.Name || category.name
        const isActive = selectedCategory === categoryName || 
                         (selectedCategory === "" && category.Id === "all")
        const isExpanded = expandedCategories.has(category.Id)
        const categorySubcategories = subcategories[category.Id] || []
        const hasSubcategories = category.Id !== "all" && categorySubcategories.length > 0

        return (
          <div key={category.Id} className="w-full">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(category.Id === "all" ? "" : categoryName)}
                className={cn(
                  "flex-1 inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                )}
              >
                <ApperIcon 
                  name={category.icon_c || category.icon}
                  size={14}
                  className={isActive ? "text-white" : ""}
                  style={!isActive ? { color: category.color_c || category.color } : {}}
                />
                <span>{categoryName}</span>
              </motion.button>
              
              {category.Id !== "all" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleCategoryExpansion(category.Id)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon 
                    name="ChevronDown" 
                    size={16} 
                    className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </motion.button>
              )}
            </div>

            {/* Subcategories */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 ml-4 space-y-1"
              >
                {loadingSubcategories[category.Id] ? (
                  <div className="flex items-center space-x-2 px-4 py-2 text-gray-500">
                    <ApperIcon name="Loader2" size={14} className="animate-spin" />
                    <span className="text-sm">Loading subcategories...</span>
                  </div>
                ) : (
                  categorySubcategories.map((subcategory) => (
                    <motion.button
                      key={subcategory.Id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onCategoryChange(subcategory.name)}
                      className={cn(
                        "w-full inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        selectedCategory === subcategory.name
                          ? "bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-md"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                      )}
                    >
                      <ApperIcon 
                        name={subcategory.icon}
                        size={12}
                        className={selectedCategory === subcategory.name ? "text-white" : ""}
                        style={selectedCategory !== subcategory.name ? { color: subcategory.color } : {}}
                      />
                      <span>{subcategory.name}</span>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CategoryFilter