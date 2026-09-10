import type { RefObject } from "react"
import { ArrowDownRight, ArrowRight } from "lucide-react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AgentDemoState, DemoTask } from "@/features/agent-demo/model"

import { AgentRunPreview } from "./agent-run-preview"
import { TaskComposer } from "./task-composer"

type HeroProps = {
  state: AgentDemoState
  selectedTask: DemoTask
  composerRef: RefObject<HTMLTextAreaElement | null>
  focusComposer: () => void
  selectTask: (task: DemoTask) => void
  setObjective: (objective: string) => void
  run: () => void
  restart: () => void
}

export function Hero({
  state,
  selectedTask,
  composerRef,
  focusComposer,
  selectTask,
  setObjective,
  run,
  restart,
}: HeroProps) {
  const prefersReducedMotion = useReducedMotion()
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [1.8, -1.8]), {
    stiffness: 170,
    damping: 24,
  })
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-2.4, 2.4]), {
    stiffness: 170,
    damping: 24,
  })
  const cursorLeft = useTransform(pointerX, [0, 1], ["0%", "100%"])
  const cursorTop = useTransform(pointerY, [0, 1], ["0%", "100%"])

  function updatePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width)
    pointerY.set((event.clientY - bounds.top) / bounds.height)
  }

  function resetPointer() {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <section className="hero-section shell" id="top" aria-labelledby="hero-title">
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Badge className="hero-eyebrow" variant="outline">
          <span className="eyebrow-signal" aria-hidden="true" />
          AUTONOMOUS WORK ENGINE
        </Badge>
        <h1 id="hero-title">
          From objective{" "}
          <span>to outcome.</span>
        </h1>
        <p className="hero-lede">
          Axiom researches the unknown, reasons through complexity, and executes
          the work—while you stay in control of every decision.
        </p>
        <div className="hero-actions">
          <Button className="primary-cta" type="button" onClick={focusComposer}>
            Start with a task <ArrowRight data-icon="inline-end" />
          </Button>
          <a className="workflow-link" href="#workflow">
            See how it works <ArrowDownRight aria-hidden="true" />
          </a>
        </div>
        <div className="hero-footnote" aria-label="Product qualities">
          <span>01</span>
          <p>Built for operators who need finished work, not another conversation.</p>
        </div>
      </motion.div>

      <motion.div
        className="hero-console"
        aria-label="Axiom interactive preview"
        initial={{ opacity: 0, y: 30, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.18 }}
        style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 1200 }}
        onPointerMove={updatePointer}
        onPointerLeave={resetPointer}
      >
        {!prefersReducedMotion && (
          <motion.span
            className="console-cursor"
            style={{ left: cursorLeft, top: cursorTop }}
            aria-hidden="true"
          />
        )}
        <div className="console-chrome" aria-hidden="true">
          <span>WORKSPACE / UNTITLED</span>
          <span className="console-coordinates">POINTER SIGNAL / LIVE</span>
        </div>
        <TaskComposer
          ref={composerRef}
          objective={state.objective}
          stage={state.stage}
          selectedTaskId={state.selectedTaskId}
          onObjectiveChange={setObjective}
          onSelectTask={selectTask}
          onRun={run}
        />
        <AgentRunPreview state={state} task={selectedTask} onRestart={restart} />
        <div className="signal-line" aria-hidden="true" />
      </motion.div>
    </section>
  )
}
