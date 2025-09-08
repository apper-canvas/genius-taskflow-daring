import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const taskService = {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await apperClient.fetchRecords('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "subcategory_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById('task_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
records: [{
          Name: taskData.title_c || taskData.title || "",
          title_c: taskData.title_c || taskData.title || "",
          description_c: taskData.description_c || taskData.description || "",
          completed_c: taskData.completed_c || taskData.completed || false,
          category_c: taskData.category_c || taskData.category || "Work",
          subcategory_c: taskData.subcategory_c || taskData.subcategory || "",
          priority_c: taskData.priority_c || taskData.priority || "Medium",
          due_date_c: taskData.due_date_c || taskData.dueDate || null,
          created_at_c: taskData.created_at_c || new Date().toISOString(),
          order_c: taskData.order_c || taskData.order || 1,
          status_c: taskData.status_c || taskData.status || "pending"
        }]
      }

      const response = await apperClient.createRecord('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Task created successfully")
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const updateRecord = {
        Id: parseInt(id)
      }

      if (taskData.title_c !== undefined || taskData.title !== undefined) {
        updateRecord.Name = taskData.title_c || taskData.title
        updateRecord.title_c = taskData.title_c || taskData.title
      }
      if (taskData.description_c !== undefined || taskData.description !== undefined) {
        updateRecord.description_c = taskData.description_c || taskData.description
      }
      if (taskData.completed_c !== undefined || taskData.completed !== undefined) {
        updateRecord.completed_c = taskData.completed_c || taskData.completed
}
      if (taskData.category_c !== undefined || taskData.category !== undefined) {
        updateRecord.category_c = taskData.category_c || taskData.category
      }
      if (taskData.subcategory_c !== undefined || taskData.subcategory !== undefined) {
        updateRecord.subcategory_c = taskData.subcategory_c || taskData.subcategory
      }
      if (taskData.priority_c !== undefined || taskData.priority !== undefined) {
        updateRecord.priority_c = taskData.priority_c || taskData.priority
      }
      if (taskData.due_date_c !== undefined || taskData.dueDate !== undefined) {
        updateRecord.due_date_c = taskData.due_date_c || taskData.dueDate
      }
      if (taskData.order_c !== undefined || taskData.order !== undefined) {
        updateRecord.order_c = taskData.order_c || taskData.order
      }
      if (taskData.status_c !== undefined || taskData.status !== undefined) {
        updateRecord.status_c = taskData.status_c || taskData.status
      }
      const params = {
        records: [updateRecord]
      }

      const response = await apperClient.updateRecord('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Task updated successfully")
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Task deleted successfully")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      return false
    }
  },

  async toggleComplete(id) {
    try {
      const task = await this.getById(id)
      if (!task) {
        throw new Error("Task not found")
      }

      const updatedTask = await this.update(id, {
        completed_c: !task.completed_c
      })

      return updatedTask
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error)
      throw error
    }
  },

  async reorderTasks(reorderedTasks) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const records = reorderedTasks.map((task, index) => ({
        Id: task.Id,
        order_c: index + 1
      }))

      const params = { records }

      const response = await apperClient.updateRecord('task_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to reorder ${failed.length} tasks:${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Tasks reordered successfully")
          return successful.map(r => r.data)
        }
      }

      return []
    } catch (error) {
      console.error("Error reordering tasks:", error?.response?.data?.message || error)
      return []
    }
}
}