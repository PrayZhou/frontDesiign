import {
  Check,
  Circle,
  FileCheck2,
  LoaderCircle,
  RotateCcw,
  ScanSearch,
  Sparkles,
  Waypoints,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AgentDemoState, AgentStage, DemoTask } from "@/features/agent-demo/model"

type AgentRunPreviewProps = {
  state: AgentDemoState
  task: DemoTask
  onRestart: () => void
}

const steps = [
  { stage: "planning", label: "Plan", detail: "Decompose the objective", icon: Waypoints },
  { stage: "researching", label: "Research", detail: "Gather and verify evidence", icon: ScanSearch },
  { stage: "analyzing", label: "Analyze", detail: "Synthesize decision signals", icon: Sparkles },
  { stage: "executing", label: "Execute", detail: "Produce reviewable outputs", icon: FileCheck2 },
] as const

const stageIndex: Record<AgentStage, number> = {
  idle: -1,
  ready: -1,
  planning: 0,
  researching: 1,
  analyzing: 2,
  executing: 3,
  complete: 4,
  error: -1,
}

const statusCopy: Record<AgentStage, string> = {
  idle: "Add an objective to begin.",
  ready: "Axiom is ready to build the work graph.",
  planning: "Planning the work graph.",
  researching: "Researching and checking source signals.",
  analyzing: "Analyzing evidence and ranking decisions.",
  executing: "Executing the approved work sequence.",
  complete: "Run complete. Deliverables are ready for review.",
  error: "Run interrupted. Your objective is preserved.",
}

const stageProgress: Record<AgentStage, number> = {
  idle: 0,
  ready: 0,
  planning: 12,
  researching: 38,
  analyzing: 63,
  executing: 88,
  complete: 100,
  error: 0,
}

export function AgentRunPreview({ state, task, onRestart }: AgentRunPreviewProps) {
  const currentIndex = stageIndex[state.stage]
  const progress = stageProgress[state.stage]

  return (
    <div className="run-preview" data-stage={state.stage}>
      <div className="preview-topline">
        <div className="preview-identity">
          <span className="agent-pulse" aria-hidden="true" />
          <span>AXIOM / AGENT 01</span>
        </div>
        <Badge variant="outline">LOCAL PREVIEW</Badge>
      </div>

      <div className="run-status" role="status" aria-live="polite">
        {statusCopy[state.stage]}
      </div>

      <div
        className="agent-progress"
        role="progressbar"
        aria-label="Agent execution progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <motion.span
          initial={false}
          animate={{ scaleX: progress / 100 }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </div>

      <ol className="agent-steps">
        {steps.map((step, index) => {
          const complete = currentIndex > index
          const active = currentIndex === index
          const Icon = step.icon

          return (
            <li
              key={step.stage}
              className={complete ? "is-complete" : active ? "is-active" : undefined}
            >
              {active && (
                <motion.span
                  className="active-step-scan"
                  layoutId="active-step-scan"
                  transition={{ type: "spring", stiffness: 210, damping: 28 }}
                  aria-hidden="true"
                />
              )}
              <span className="step-state" aria-hidden="true">
                {complete ? (
                  <Check />
                ) : active ? (
                  <LoaderCircle className="step-spinner" />
                ) : (
                  <Circle />
                )}
              </span>
              <Icon className="step-icon" aria-hidden="true" />
              <span className="step-copy">
                <strong>{step.label}</strong>
                <span>{step.detail}</span>
              </span>
              <span className="step-meta">
                {complete ? "DONE" : active ? "ACTIVE" : "WAITING"}
              </span>
            </li>
          )
        })}
      </ol>

      <AnimatePresence initial={false}>
        {state.stage === "complete" && (
          <motion.div
            className="run-result"
            initial={{ opacity: 0, height: 0, y: 12 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span>{String(task.sources).padStart(2, "0")} SOURCES REVIEWED</span>
            <p>{task.result}</p>
            <Button variant="outline" size="sm" type="button" onClick={onRestart}>
              <RotateCcw data-icon="inline-start" /> Restart
            </Button>
          </motion.div>
        )}

        {state.stage === "error" && (
          <motion.div
            className="run-result error-result"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p>Run interrupted. Review the objective and restart when ready.</p>
            <Button variant="outline" size="sm" type="button" onClick={onRestart}>
              <RotateCcw data-icon="inline-start" /> Restart
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
