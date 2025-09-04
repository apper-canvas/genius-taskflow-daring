import { toast } from "react-toastify";

// Utility function for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

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
      };

      const response = await apperClient.fetchRecords('category_c', params);
      if (!response.success) {
console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const categories = response.data || [];
      
      // Add "All" category for filtering
      const allCategory = {
        Id: "all",
        Name: "All",
        color_c: "#6B7280",
        icon_c: "Grid3X3"
      };

      return [allCategory, ...categories];
    } catch (error) {
console.error("Error fetching categories:", error?.response?.data?.message || error);
      return [{
        Id: "all",
        Name: "All", 
        color_c: "#6B7280",
        icon_c: "Grid3X3"
      }];
    }
  },

  // Subcategory CRUD Operations
  async getSubcategories(parentCategoryId = null) {
    try {
      await delay(200);
      
      // Import subcategory mock data
const { default: subcategoriesData } = await import('@/services/mockData/subcategories.json');
      
      if (parentCategoryId && parentCategoryId !== "all") {
        const parentId = parseInt(parentCategoryId);
        return subcategoriesData.filter(sub => sub.parent_category_id === parentId);
      }
      
      return subcategoriesData;
    } catch (error) {
      console.error("Error fetching subcategories:", error?.response?.data?.message || error);
      return [];
    }
  },

async createSubcategory(subcategoryData) {
    try {
      await delay(300);
      
      const { default: subcategoriesData } = await import('@/services/mockData/subcategories.json');
      
      const newSubcategory = {
        ...subcategoryData,
        Id: Date.now(),
        parent_category_id: parseInt(subcategoryData.parent_category_id)
      };
      
      // In a real implementation, this would persist to database
      console.log("Created subcategory:", newSubcategory);
      
      return newSubcategory;
    } catch (error) {
      console.error("Error creating subcategory:", error?.response?.data?.message || error);
      throw error;
    }
  },

async updateSubcategory(id, subcategoryData) {
    try {
      await delay(250);
      
      const updatedSubcategory = {
        ...subcategoryData,
        Id: parseInt(id),
        parent_category_id: parseInt(subcategoryData.parent_category_id)
      };
      
      // In a real implementation, this would update in database
      console.log("Updated subcategory:", updatedSubcategory);
      
      return updatedSubcategory;
    } catch (error) {
      console.error("Error updating subcategory:", error?.response?.data?.message || error);
      throw error;
    }
  },

async deleteSubcategory(id) {
    try {
      await delay(200);
      
      // In a real implementation, this would delete from database
      console.log("Deleted subcategory with ID:", id);
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting subcategory:", error?.response?.data?.message || error);
      throw error;
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
        };
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

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
      };

      const response = await apperClient.getRecordById('category_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }
};