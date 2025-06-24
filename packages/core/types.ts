export interface EnvCheckResult {
  name: string
  isValid: boolean
  label: string
}

export interface EnvCheckActionResult {
  envs: EnvCheckResult[]
  allValid: boolean
}

export type EnvCheckAction = () => Promise<EnvCheckActionResult>
