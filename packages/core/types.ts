export interface EnvCheckResult {
  name: string
  isValid: boolean
  label: string
}

export interface EnvCheckActionResult {
  envs: EnvCheckResult[]
  allValid: boolean
}

export type Variable = {
  name: string
  label: string
}

export type VariableGroup = Variable[]

export type EnvCheckAction = () => Promise<EnvCheckActionResult>
