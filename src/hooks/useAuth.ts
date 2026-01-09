import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentEmployee } from '../lib/supabase';
import { Empleado } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Empleado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadEmployee();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadEmployee();
      } else {
        setEmployee(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadEmployee = async () => {
    try {
      const emp = await getCurrentEmployee();
      setEmployee(emp);
    } catch (error) {
      console.error('Error loading employee:', error);
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, employee, loading, isManager: employee?.puesto === 'gerente' };
};