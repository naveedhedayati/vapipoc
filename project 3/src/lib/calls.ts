import { supabase } from './supabase';

export type CallStatus = 'success' | 'error';

export interface CallLog {
  phone_number: string;
  timestamp: string;
  status: CallStatus;
}

export async function logCall(phoneNumber: string, status: CallStatus): Promise<void> {
  try {
    const { error } = await supabase
      .from('calls')
      .insert([{
          phone_number: phoneNumber,
          timestamp: new Date().toISOString(),
          status,
      }]);

    if (error) {
      console.error('Error logging call:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to log call to Supabase:', error);
    // Don't re-throw as this is a non-critical operation
  }
}