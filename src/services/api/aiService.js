import { toast } from 'react-toastify';

/**
 * Service for AI-powered functionality
 */
class AIService {
  constructor() {
    this.baseUrl = `https://test-api.apper.io/fn/${import.meta.env.VITE_GENERATE_TASK_DESCRIPTION}`;
  }

  /**
   * Generate task description based on title using AI
   * @param {string} title - The task title to generate description for
   * @returns {Promise<string>} Generated description
   */
  async generateTaskDescription(title) {
    try {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        throw new Error('Task title is required');
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim()
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate description');
      }

      if (!data.description) {
        throw new Error('No description generated');
      }

      return data.description;

    } catch (error) {
      console.error('Error generating task description:', error);
      
      // User-friendly error messages
      if (error.message.includes('AI service is not configured')) {
        toast.error('AI description generation is currently unavailable');
      } else if (error.message.includes('Task title is required')) {
        toast.error('Please enter a task title first');
      } else {
        toast.error('Failed to generate description. Please try again.');
      }
      
      throw error;
    }
  }
}

export const aiService = new AIService();