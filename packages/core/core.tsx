import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useRef } from 'react'
import { AlertTriangle, X, Check } from './icons'
import { cn } from './utils'
import { EnvCheckAction, EnvCheckResult } from './types'

export const SetupToolbar = ({ envCheckAction }: { envCheckAction: EnvCheckAction }) => {
  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState('idle')
  const [envs, setEnvs] = useState<EnvCheckResult[]>([])
  const [allValid, setAllValid] = useState(false)
  const ref = useRef(null)

  function submit() {
    setFormState('loading')
    setTimeout(() => {
      setFormState('success')
    }, 1500)

    setTimeout(() => {
      setOpen(false)
    }, 3300)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && open && formState === 'idle') {
        submit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, formState])

  useEffect(() => {
    const loadEnvs = async () => {
      const result = await envCheckAction()
      setEnvs(result.envs)
      setAllValid(result.allValid)
    }
    loadEnvs()
  }, [])

  // Only show if in development and not all valid
  if (process.env.NODE_ENV === 'production' || allValid) {
    return null
  }

  const validCount = envs.filter((env) => env.isValid).length

  return (
    <div
      aria-hidden="true"
      className={cn(
        'v0-fixed v0-inset-0 v0-transition-colors v0-flex v0-items-end v0-justify-center v0-z-[9999] v0-p-4 v0-pointer-events-none'
      )}
    >
      <div
        onClick={() => setOpen(false)}
        className={cn(
          'v0-absolute v0-inset-0 v0-transition-colors',
          open ? 'v0-pointer-events-auto v0-bg-black/30' : 'v0-pointer-events-none'
        )}
      />
      <motion.button
        layoutId="wrapper"
        onClick={() => {
          setOpen(true)
          setFormState('idle')
        }}
        key="button"
        className="v0-relative v0-flex v0-items-center v0-gap-2 v0-px-3 v0-font-medium v0-transition-colors v0-border v0-rounded-lg v0-shadow-sm v0-outline-none v0-pointer-events-auto v0-h-9 v0-border-amber-200 v0-bg-amber-50 v0-hover:v0-bg-amber-100"
        style={{ borderRadius: 8 }}
      >
        <motion.div layoutId="icon">
          <AlertTriangle className="v0-w-4 v0-h-4 v0-text-amber-600" />
        </motion.div>
        <motion.span layoutId="title" className="v0-block v0-text-sm v0-text-amber-800">
          Setup your store
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            layoutId="wrapper"
            className="v0-pointer-events-auto v0-absolute v0-bottom-6 v0-w-[500px] v0-overflow-hidden v0-bg-neutral-100 v0-p-1 v0-outline-none v0-flex v0-flex-col"
            ref={ref}
            style={{
              borderRadius: 12,
              boxShadow:
                '0 0 0 1px rgba(0, 0, 0, 0.08), 0px 2px 2px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
              height: '400px',
            }}
          >
            {/* Header with animated title and close button */}
            <div className="v0-flex v0-items-center v0-justify-between v0-flex-shrink-0 v0-px-4 v0-py-3 v0-border-b v0-border-dashed v0-rounded-t-lg v0-bg-neutral-50 v0-border-neutral-200">
              <div className="v0-flex v0-items-center v0-gap-2">
                <motion.div layoutId="icon">
                  <AlertTriangle className="v0-size-4 v0-text-amber-600" />
                </motion.div>
                <motion.span layoutId="title" className="v0-text-sm v0-font-semibold v0-text-amber-800">
                  Setup your store
                </motion.span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="v0-p-1 v0-transition-colors v0-rounded v0-text-neutral-300 v0-hover:v0-text-neutral-600 v0-hover:v0-bg-neutral-100"
              >
                <X className="v0-size-4" />
              </button>
            </div>

            <div className="v0-flex v0-flex-col v0-flex-1 v0-min-h-0">
              <motion.div
                exit={{ y: 8, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
                key="content"
                className="v0-flex v0-flex-col v0-flex-1 v0-min-h-0 v0-rounded-b-lg"
              >
                {/* Description */}
                <div className="v0-flex v0-items-center v0-justify-between v0-flex-shrink-0 v0-gap-4 v0-px-3 v0-py-1.5 v0-border-b v0-bg-neutral-100 v0-border-neutral-200">
                  <p className="v0-text-xs v0-text-balance v0-text-neutral-600">
                    Configure the following environment variables to set up your Salesforce Commerce Cloud integration.
                  </p>
                  <div className="v0-flex v0-items-center v0-justify-center v0-shrink-0">
                    <div className="v0-relative v0-size-10">
                      {/* Background circle */}
                      <svg className="v0-transform v0--rotate-90 v0-size-10" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                          className="v0-text-neutral-300"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - validCount / envs.length)}`}
                          className={validCount === envs.length ? 'v0-text-green-500' : 'v0-text-amber-500'}
                          style={{
                            transition: 'stroke-dashoffset 0.3s ease-in-out',
                          }}
                        />
                      </svg>
                      {/* Center text */}
                      <div className="v0-absolute v0-inset-0 v0-flex v0-items-center v0-justify-center">
                        <span className="v0-text-[10px] v0-font-semibold v0-text-neutral-700 v0-leading-none v0-tabular-nums">
                          {validCount}/{envs.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Environment variables list */}
                <div className="v0-flex-1 v0-overflow-y-auto v0-bg-white">
                  <div className="v0-p-4 v0-pb-6 v0-space-y-3">
                    {envs.map((env) => (
                      <div
                        key={env.name}
                        className="v0-flex v0-items-center v0-gap-3 v0-p-3 v0-border v0-rounded-lg v0-bg-neutral-50 v0-border-neutral-200"
                      >
                        <div
                          className={`v0-flex-shrink-0 v0-size-8 v0-rounded-sm v0-flex v0-items-center v0-justify-center ${
                            env.isValid ? 'v0-bg-green-100 v0-text-green-600' : 'v0-bg-amber-100 v0-text-amber-600'
                          }`}
                        >
                          {env.isValid ? <Check className="v0-size-4" /> : <AlertTriangle className="v0-size-4" />}
                        </div>
                        <div className="v0-flex-1 v0-min-w-0">
                          <div className="v0-text-sm v0-font-medium v0-text-neutral-900">{env.label}</div>
                          <div className="v0-font-mono v0-text-xs v0-truncate v0-text-neutral-500">{env.name}</div>
                        </div>
                        <div
                          className={`v0-text-xs v0-font-medium ${env.isValid ? 'v0-text-green-600' : 'v0-text-amber-600'}`}
                        >
                          {env.isValid ? 'Set' : 'Missing'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
