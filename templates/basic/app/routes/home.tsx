import { SetupToolbar } from '@joycostudio/v0-setup'
import { Welcome } from '../welcome/welcome'

export function meta() {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  return (
    <>
      <SetupToolbar
        title="Welcome to the Joyco Studio V0 Setup"
        description="This is a description"
        useShadowDOM={false}
        envCheckAction={async () => {
          console.log('envCheckAction')
          return {
            envs: [
              {
                isValid: true,
                name: 'TEST',
                label: 'TEST',
              },
              {
                isValid: false,
                name: 'TEST2',
                label: 'TEST2',
              },
            ],
            allValid: false,
          }
        }}
      />
      <Welcome />
    </>
  )
}
