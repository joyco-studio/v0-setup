'use server'

import { EnvCheckResult, EnvCheckAction } from '@joycostudio/v0-setup'
import { VariableGroup } from './types'

export const checkEnvironmentVariables: EnvCheckAction = async (variables: VariableGroup) => {
  // Only check environment variables in development
  if (process.env.NODE_ENV === 'production') {
    return {
      envs: [],
      allValid: true,
    }
  }

  const envs: EnvCheckResult[] = variables.map((env) => ({
    name: env.name,
    label: env.label,
    isValid: Boolean(process.env[env.name]),
  }))

  const allValid = envs.every((env) => env.isValid)

  return {
    envs,
    allValid,
  }
}
