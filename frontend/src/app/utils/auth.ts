import { supabase } from "../lib/supabase";

export async function login(email: string, password: string) {
    try {
      console.log('Attempting to log in with:', email, password); // Debug log
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('Login error:', error); // Debug log
        throw error;
      }
  
      console.log('Login successful:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }