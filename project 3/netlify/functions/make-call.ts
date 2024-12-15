import { Handler } from '@netlify/functions';
import axios from 'axios';

const VAPI_API_URL = 'https://api.vapi.ai/calls';

const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('Request body is required');
    }

    const { phoneNumber } = JSON.parse(event.body);

    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    if (!process.env.VAPI_API_KEY) {
      throw new Error('VAPI API key is not configured');
    }

    if (!process.env.VAPI_ASSISTANT_ID) {
      throw new Error('VAPI Assistant ID is not configured');
    }

    if (!process.env.TWILIO_NUMBER) {
      throw new Error('Twilio number is not configured');
    }

    // Make the API call to VAPI
    const response = await axios.post(
      VAPI_API_URL,
      {
        to: phoneNumber,
        from: process.env.TWILIO_NUMBER,
        assistant: process.env.VAPI_ASSISTANT_ID,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Call initiated successfully',
        callId: response.data.id,
      }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Failed to initiate call',
      }),
    };
  }
};

export { handler };