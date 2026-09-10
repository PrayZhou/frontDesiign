import {
  ArrowUpRight,
  Check,
  Circle,
  FileOutput,
  FolderSearch2,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { AgentDemoState, DemoTask } from "@/features/agent-demo/model"

type WorkspaceDemoProps = {
  state: AgentDemoState
  task: DemoTask
}

const planSteps = [
  "Define the decision boundary",
  "Collect and validate source signals",
  "Model opportunities and risks",
  "Produce the execution brief",
]

const previewSources = [
  ["INDUSTRY REPORTS", "08"],
  ["PUBLIC PRODUCT DOCS", "11"],
  ["ANALYST NOTES", "05"],
]

export function WorkspaceDemo({ state, task }: WorkspaceDemoProps) {
  const isIdle = state.stage === "idle"
  const isLoading = state.stage === "planning"
  const isError = state.stage === "error"
  const isComplete = state.stage === "complete"

  return (
    <section className="product-section shell" id="product" aria-labelledby="product-title">
      <div className="product-intro">
        <span className="section-kicker">PRODUCT / LIVE WORKSPACE</span>
        <h2 id="product-title">Complex work, made inspectable.</h2>
        <p>
          Axiom shows its plan, evidence, and execution record in one surface—not
          behind a stream of confident prose.
        </p>
      </div>

      <motion.div
        className="workspace-frame"
        aria-busy={isLoading}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="workspace-header">
          <div>
            <span className="workspace-mark" aria-hidden="true" />
            AXIOM WORKSPACE
          </div>
          <div className="workspace-header-meta">
            <span>RUN / 000184</span>
            <Badge variant="outline">
              {isComplete ? "COMPLETE" : isError ? "INTERRUPTED" : "PREVIEW"}
            </Badge>
          </div>
        </div>

        <div className="workspace-objective">
          <span>OBJECTIVE</span>
          <p>{task.objective}</p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
        {isIdle && (
          <motion.div
            key="idle"
            className="workspace-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Circle aria-hidden="true" />
            <div>
              <strong>Choose an objective</strong>
              <span>Select a sample task or write your own in the composer above.</span>
            </div>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            key="loading"
            className="workspace-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoaderCircle className="step-spinner" aria-hidden="true" />
            <div>
              <strong>Preparing the execution plan</strong>
              <span>Decomposing scope, dependencies, and evidence requirements.</span>
            </div>
          </motion.div>
        )}

        {isError && (
          <motion.div
            key="error"
            className="workspace-message workspace-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>Run interrupted</strong>
              <span>Your objective remains available. Restart when you are ready.</span>
            </div>
          </motion.div>
        )}

        {!isIdle && !isLoading && !isError && (
          <motion.div
            key="workspace"
            className="workspace-grid"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <aside className="workspace-plan" aria-labelledby="plan-heading">
              <div className="workspace-panel-heading">
                <span id="plan-heading">EXECUTION PLAN</span>
                <span>04 STEPS</span>
              </div>
              <ol aria-label="Execution plan">
                {planSteps.map((step, index) => {
                  const finished = isComplete || index < 2
                  return (
                    <motion.li
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <span className="workspace-step-state" aria-hidden="true">
                        {finished ? <Check /> : <Circle />}
                      </span>
                      <span>
                        <small>{String(index + 1).padStart(2, "0")}</small>
                        {step}
                      </span>
                    </motion.li>
                  )
                })}
              </ol>
            </aside>

            <div className="workspace-output">
              <section aria-labelledby="evidence-heading">
                <div className="workspace-panel-heading">
                  <span id="evidence-heading">EVIDENCE</span>
                  <span>PREVIEW SOURCE SET</span>
                </div>
                <div className="source-list">
                  {previewSources.map(([label, count]) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <FolderSearch2 aria-hidden="true" />
                      <span>{label}</span>
                      <strong>{count}</strong>
                    </motion.div>
                  ))}
                </div>
              </section>

              <Separator />

              <section className="deliverable-panel" aria-labelledby="deliverable-heading">
                <div className="workspace-panel-heading">
                  <span id="deliverable-heading">DELIVERABLE</span>
                  <span>{task.sources} SOURCES REVIEWED</span>
                </div>
                <motion.div
                  className="deliverable-file"
                  layout
                  animate={isComplete ? { borderColor: "#72f4d4" } : { borderColor: "#39443f" }}
                >
                  <FileOutput aria-hidden="true" />
                  <div>
                    <strong>Decision brief / v1.0</strong>
                    <p>{task.result}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </motion.div>
              </section>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
