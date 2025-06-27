'use server'

import { VariableGroup, EnvCheckResult, EnvCheckActionResult } from './types'

export const checkEnvironmentVariables = async (variables: VariableGroup): Promise<EnvCheckActionResult> => {
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
