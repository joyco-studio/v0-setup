export type Variable = {
  name: string
  label: string
  script?: {
    language: string
    content: string
  }
}

export type VariableGroup = Variable[]

export interface EnvCheckResult extends Variable {
  isValid: boolean
}

export interface EnvCheckActionResult {
  envs: EnvCheckResult[]
}

export type EnvCheckAction = () => Promise<EnvCheckActionResult>
