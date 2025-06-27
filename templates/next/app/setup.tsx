'use client'

import { SetupToolbar } from "@joycostudio/v0-setup";

export default function Setup() {
  return (
    <SetupToolbar
      title="Welcome to the Joyco Studio V0 Setup"
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
          ],
          allValid: false,
        }
      }}
    />
  )
}