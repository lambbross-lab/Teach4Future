import { supabase } from '../lib/supabase';

export const CAMPUS_BUCKET = 'campus';

export type CampusEnrollment = {
  id: string;
  session_id: string;
  user_id: string;
  full_name: string;
  email: string;
  access_until: string;
  created_at: string;
};

export type CampusMaterial = {
  id: string;
  course_id: string;
  day: number;
  title: string;
  description: string | null;
  kind: 'file' | 'link';
  url: string | null;
  storage_path: string | null;
  sort_order: number;
  created_at: string;
};

export type CampusSessionInfo = {
  id: string;
  course_id: string;
  city_id: string;
  start_date: string;
  end_date: string;
};

export const MATERIAL_COLUMNS = 'id, course_id, day, title, description, kind, url, storage_path, sort_order, created_at';
export const ENROLLMENT_COLUMNS = 'id, session_id, user_id, full_name, email, access_until, created_at';

export const isCurrentUserAdmin = async (userId: string) => {
  if (!supabase) return false;
  const { data } = await supabase.from('admin_users').select('id').eq('id', userId).maybeSingle();
  return Boolean(data);
};

export const openMaterial = async (material: CampusMaterial) => {
  if (material.kind === 'link' && material.url) {
    window.open(material.url, '_blank', 'noopener,noreferrer');
    return;
  }
  if (!supabase || !material.storage_path) throw new Error('missing_file');
  // Open the tab synchronously so pop-up blockers allow it, then point it at the signed URL.
  const tab = window.open('', '_blank');
  const { data, error } = await supabase.storage.from(CAMPUS_BUCKET).createSignedUrl(material.storage_path, 60 * 60);
  if (error || !data?.signedUrl) {
    tab?.close();
    throw error ?? new Error('signed_url_failed');
  }
  if (tab) {
    tab.opener = null;
    tab.location.href = data.signedUrl;
  } else {
    window.location.href = data.signedUrl;
  }
};

export const safeFileName = (name: string) => name
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[^a-zA-Z0-9._-]+/g, '-')
  .replace(/-+/g, '-')
  .slice(-120);

export const callCampusAdmin = async <T,>(body: Record<string, unknown>): Promise<T> => {
  if (!supabase) throw new Error('not_configured');
  const { data, error } = await supabase.functions.invoke('campus-admin', { body });
  if (error) {
    let code = 'request_failed';
    try {
      const payload = await (error as { context?: Response }).context?.json();
      if (payload?.error) code = payload.error;
    } catch {
      // keep generic code
    }
    throw new Error(code);
  }
  return data as T;
};
