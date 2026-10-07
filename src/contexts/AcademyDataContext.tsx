import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CourseSession } from '../types';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { automaticSessionStatus } from '../lib/utils';

type DataMode = 'live' | 'preview';

interface AcademyDataContextValue {
  sessions: CourseSession[];
  mode: DataMode;
  loading: boolean;
  refreshSessions: () => Promise<void>;
  updateSession: (session: CourseSession) => Promise<void>;
  upsertSessions: (sessions: CourseSession[]) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

const AcademyDataContext = createContext<AcademyDataContextValue | undefined>(undefined);

const mapSession = (row: any): CourseSession => ({
  id: row.id,
  courseId: row.course_id,
  cityId: row.city_id,
  startDate: row.start_date,
  endDate: row.end_date,
  seatsTotal: row.seats_total,
  seatsLeft: row.seats_left,
  status: automaticSessionStatus({ endDate: row.end_date, seatsLeft: row.seats_left }),
  schedule: row.schedule,
});

const toSessionRow = (session: CourseSession) => ({
  id: session.id,
  course_id: session.courseId,
  city_id: session.cityId,
  start_date: session.startDate,
  end_date: session.endDate,
  seats_total: session.seatsTotal,
  seats_left: session.seatsLeft,
  status: automaticSessionStatus(session),
  schedule: session.schedule,
});

export const AcademyDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const refreshSessions = useCallback(async () => {
    if (!supabase) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('course_sessions')
      .select('*')
      .order('start_date', { ascending: true });

    if (error) throw error;
    setSessions((data ?? []).map(mapSession));
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSessions().catch(() => setLoading(false));
    if (!supabase) return;

    const channel = supabase
      .channel('public-course-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'course_sessions' },
        () => refreshSessions().catch(() => undefined),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshSessions]);

  const updateSession = useCallback(async (session: CourseSession) => {
    if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED');
    const { error } = await supabase
      .from('course_sessions')
      .upsert(toSessionRow(session));
    if (error) throw error;
  }, []);

  const upsertSessions = useCallback(async (newSessions: CourseSession[]) => {
    if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED');
    const { error } = await supabase
      .from('course_sessions')
      .upsert(newSessions.map(toSessionRow));
    if (error) throw error;
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    if (!supabase) throw new Error('SUPABASE_NOT_CONFIGURED');
    const { error } = await supabase.from('course_sessions').delete().eq('id', id);
    if (error) throw error;
    setSessions((current) => current.filter((session) => session.id !== id));
  }, []);

  const value = useMemo(() => ({
    sessions,
    mode: isSupabaseConfigured ? 'live' as const : 'preview' as const,
    loading,
    refreshSessions,
    updateSession,
    upsertSessions,
    deleteSession,
  }), [deleteSession, loading, refreshSessions, sessions, updateSession, upsertSessions]);

  return <AcademyDataContext.Provider value={value}>{children}</AcademyDataContext.Provider>;
};

export const useAcademyData = () => {
  const context = useContext(AcademyDataContext);
  if (!context) throw new Error('useAcademyData must be used within AcademyDataProvider');
  return context;
};
