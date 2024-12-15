import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { logCall } from '../lib/calls';

export function PhoneForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const initiateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/.netlify/functions/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate call');
      }

      // Log the successful call
      await logCall(phoneNumber, 'success');

      setStatus('success');
      setMessage('Call initiated successfully!');
      setPhoneNumber('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to initiate call');
      
      // Log the failed call
      await logCall(phoneNumber, 'error').catch(console.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-center mb-8">
        <div className="p-3 bg-blue-100 rounded-full">
          <Phone className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        VAPI Call Assistant
      </h1>

      <form onSubmit={initiateCall} className="space-y-4">
        <div>
          <label 
            htmlFor="phone" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition
            ${status === 'loading' 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {status === 'loading' ? 'Initiating Call...' : 'Start Call'}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}