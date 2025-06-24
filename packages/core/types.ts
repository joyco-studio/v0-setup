export type Variable = {
  name: string
  label: string
}

export type VariableGroup = Variable[]

export interface EnvCheckResult extends Variable {
  isValid: boolean
}

export interface EnvCheckActionResult {
  envs: EnvCheckResult[]
  allValid: boolean
}

export type EnvCheckAction = () => Promise<EnvCheckActionResult>
