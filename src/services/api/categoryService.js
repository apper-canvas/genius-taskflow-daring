import { toast } from 'react-toastify'

export const categoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      }

      const response = await apperClient.fetchRecords('category_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      const categories = response.data || []
      
      // Add "All" category for filtering
      const allCategory = {
        Id: "all",
        Name: "All",
        color_c: "#6B7280",
        icon_c: "Grid3X3"
      }

      return [allCategory, ...categories]
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      return [{
        Id: "all",
        Name: "All", 
        color_c: "#6B7280",
        icon_c: "Grid3X3"
      }]
    }
  },

  async getById(id) {
    try {
      if (id === "all") {
        return {
          Id: "all",
          Name: "All",
          color_c: "#6B7280", 
          icon_c: "Grid3X3"
        }
      }

      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById('category_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }
}