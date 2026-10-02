import { supabase } from '../lib/supabase';

export type EnquiryKind = 'course' | 'europe' | 'contact';

export interface EnquiryPayload {
  kind: EnquiryKind;
  fullName: string;
  email: string;
  institution?: string;
  courseId?: string;
  sessionId?: string;
  city?: string;
  topic?: string;
  preferredDates?: string;
  groupSize?: number;
  country?: string;
  role?: string;
  participantsCount?: number;
  subject?: string;
  message?: string;
  notes?: string;
  language: 'en' | 'es';
  privacyAccepted: boolean;
  website?: string;
}

export async function submitEnquiry(payload: EnquiryPayload) {
  if (!supabase) throw new Error('FORM_NOT_CONFIGURED');
  if (!payload.privacyAccepted) throw new Error('CONSENT_REQUIRED');

  const { data, error } = await supabase.functions.invoke('submit-enquiry', {
    body: payload,
  });

  if (error) {
    const response = (error as { context?: Response }).context;
    if (response) {
      const body = await response.clone().json().catch(() => null) as { error?: string } | null;
      if (body?.error) throw new Error(body.error);
    }
    throw error;
  }
  if (data?.error) throw new Error(data.error);
}
