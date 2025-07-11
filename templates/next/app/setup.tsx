'use client'

import { SetupToolbar } from '@joycostudio/v0-setup'

export default function Setup() {
  return (
    <SetupToolbar
      title="Welcome to the Joyco Studio V0 Setupa"
      description="This is a description"
      useShadowDOM={false}
      envCheckAction={async () => {
        return {
          envs: [
            {
              name: 'TEST',
              label: 'TEST',
              isValid: false,
            },
            {
              name: 'TEST2',
              label: 'TEST2',
              isValid: true,
            },
            {
              name: 'Missing some required tables',
              label: 'Database Schema',
              script: {
                language: 'sql',
                content: `
                  CREATE TABLE IF NOT EXISTS form_sessions (
                    id TEXT PRIMARY KEY,
                    form_data JSONB NOT NULL DEFAULT '{}',
                    current_step INTEGER NOT NULL DEFAULT -1,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    expires_at TIMESTAMPTZ NOT NULL
                  );
            
                  CREATE INDEX IF NOT EXISTS idx_form_sessions_id ON form_sessions(id);
            
                  CREATE TABLE IF NOT EXISTS form_submissions (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    session_id TEXT NOT NULL,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT,
                    form_data JSONB NOT NULL DEFAULT '{}',
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                  );
            
                  CREATE INDEX IF NOT EXISTS idx_form_submissions_session_id ON form_submissions(session_id);
            
                  CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions(email);
                `,
              },
            },
          ],
          allValid: false,
        }
      }}
    />
  )
}
