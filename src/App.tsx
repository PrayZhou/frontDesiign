import { useRef } from "react"
import { MotionConfig } from "motion/react"

import { CapabilitySequence } from "@/components/marketing/capability-sequence"
import { Hero } from "@/components/marketing/hero"
import { SiteHeader } from "@/components/marketing/site-header"
import {
  EvidenceRail,
  FinalCTA,
  IntegrationStrip,
  SiteFooter,
  UseCases,
} from "@/components/marketing/supporting-sections"
import { WorkspaceDemo } from "@/components/marketing/workspace-demo"
import { useAgentDemo } from "@/features/agent-demo/use-agent-demo"
import type { DemoTask } from "@/features/agent-demo/model"

import { ScrollProgress } from "@/components/motion/scroll-progress"

export default function App() {
  const composerRef = useRef<HTMLTextAreaElement>(null)
  const demo = useAgentDemo()

  function focusComposer() {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    composerRef.current?.scrollIntoView?.({
      block: "center",
      behavior: reduceMotion ? "auto" : "smooth",
    })
    composerRef.current?.focus()
  }

  function startUseCase(task: DemoTask) {
    demo.startTask(task)
    focusComposer()
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <div className="site-shell">
        <ScrollProgress />
        <SiteHeader focusComposer={focusComposer} />
        <main>
          <Hero composerRef={composerRef} focusComposer={focusComposer} {...demo} />
          <EvidenceRail />
          <CapabilitySequence />
          <WorkspaceDemo state={demo.state} task={demo.selectedTask} />
          <UseCases onStartTask={startUseCase} />
          <IntegrationStrip />
          <FinalCTA focusComposer={focusComposer} />
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  )
}
