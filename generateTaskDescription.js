// Custom action for AI-powered task description generation
// Uses OpenAI API to generate descriptions based on task titles

// Global declarations for custom action environment
const apper = globalThis.apper || {};
const Response = globalThis.Response || class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = new Map(Object.entries(options.headers || {}));
  }
};

apper.serve(async (request) => {
  try {
    // Parse request body
    const { title } = await request.json();
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Task title is required and must be a non-empty string'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get API key from secrets
    const apiKey = await apper.getSecret('AI_SERVICE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'AI service is not configured'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare OpenAI API request
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates concise, actionable task descriptions. Generate a brief description (2-3 sentences) that explains what needs to be done for the given task title. Focus on the action items and expected outcome.'
          },
          {
            role: 'user',
            content: `Generate a task description for: "${title.trim()}"`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          success: false,
          error: `AI service error: ${errorData.error?.message || 'Unknown error'}`
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await openAIResponse.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid response from AI service'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const generatedDescription = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({
        success: true,
        description: generatedDescription
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error generating task description:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error while generating description'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});