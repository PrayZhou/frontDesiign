import {
  ArrowRight,
  Blocks,
  BookOpenCheck,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  Database,
  FileStack,
  Globe2,
  Orbit,
  PanelsTopLeft,
  Users,
} from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { demoTasks, type DemoTask } from "@/features/agent-demo/model"

type FocusComposerProps = {
  focusComposer: () => void
}

const evidence = [
  {
    label: "Cited research",
    copy: "Trace every important claim back to its source set.",
    icon: BookOpenCheck,
  },
  {
    label: "Reviewable plans",
    copy: "See the work graph before execution begins.",
    icon: CheckCircle2,
  },
  {
    label: "Tool-aware execution",
    copy: "Turn decisions into files, updates, and handoffs.",
    icon: Bot,
  },
]

const useCases = [
  {
    code: "MARKET / 01",
    title: "Market intelligence",
    copy: "Map a category, challenge consensus, and surface a defensible point of entry.",
    icon: ChartNoAxesCombined,
    task: demoTasks[0],
  },
  {
    code: "PRODUCT / 02",
    title: "Product planning",
    copy: "Convert scattered evidence into a focused brief and a sequence the team can run.",
    icon: PanelsTopLeft,
    task: demoTasks[1],
  },
  {
    code: "OPS / 03",
    title: "Operating systems",
    copy: "Find recurring work, design the workflow, and leave a clear execution record.",
    icon: Blocks,
    task: demoTasks[2],
  },
]

const integrations = [
  { label: "Browser", detail: "Public research", icon: Globe2 },
  { label: "Documents", detail: "Briefs and reports", icon: FileStack },
  { label: "Data", detail: "Tables and signals", icon: Database },
  { label: "Team tools", detail: "Plans and handoffs", icon: Users },
]

type UseCasesProps = {
  onStartTask: (task: DemoTask) => void
}

export function EvidenceRail() {
  return (
    <section className="evidence-rail shell" aria-label="Platform evidence">
      {evidence.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.09 }}
          >
            <span className="evidence-code">0{index + 1}</span>
            <Icon aria-hidden="true" />
            <div>
              <strong>{item.label}</strong>
              <p>{item.copy}</p>
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}

export function UseCases({ onStartTask }: UseCasesProps) {
  return (
    <section className="use-cases-section" id="use-cases" aria-labelledby="use-cases-title">
      <div className="shell">
        <div className="section-heading-row use-case-heading">
          <div>
            <span className="section-kicker">OPERATORS / USE CASES</span>
            <h2 id="use-cases-title">Built for the work between idea and decision.</h2>
          </div>
          <p>
            Give Axiom an outcome with real ambiguity. It returns structure,
            evidence, and a next move.
          </p>
        </div>
        <div className="use-case-list">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.article
                key={useCase.code}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ x: 8 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ delay: index * 0.08 }}
              >
                <span>{useCase.code}</span>
                <Icon aria-hidden="true" />
                <div>
                  <h3>{useCase.title}</h3>
                  <p>{useCase.copy}</p>
                </div>
                <button
                  className="use-case-action"
                  type="button"
                  aria-label={`Try ${useCase.title}`}
                  onClick={() => onStartTask(useCase.task)}
                >
                  <span>RUN</span>
                  <ArrowRight aria-hidden="true" />
                </button>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function IntegrationStrip() {
  return (
    <section
      className="integration-section shell"
      id="integrations"
      aria-labelledby="integrations-title"
    >
      <div className="integration-intro">
        <span className="section-kicker">CONNECTION LAYER</span>
        <h2 id="integrations-title">Connect the tools already in motion.</h2>
        <p>
          The interface below represents supported tool categories, not announced
          third-party partnerships.
        </p>
      </div>
      <div className="integration-list">
        {integrations.map((integration, index) => {
          const Icon = integration.icon
          return (
            <motion.div
              key={integration.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ backgroundColor: "#121816" }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.06 }}
            >
              <Icon aria-hidden="true" />
              <span>
                <strong>{integration.label}</strong>
                <small>{integration.detail}</small>
              </span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export function FinalCTA({ focusComposer }: FocusComposerProps) {
  return (
    <section className="final-cta-section shell" aria-labelledby="final-cta-title">
      <span className="final-index">04 / BEGIN</span>
      <div>
        <span className="section-kicker">READY WHEN YOU ARE</span>
        <h2 id="final-cta-title">Your next objective deserves more than a blank chat.</h2>
      </div>
      <Button type="button" onClick={focusComposer}>
        Start with a task
        <ArrowRight data-icon="inline-end" />
      </Button>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            <Orbit size={17} strokeWidth={1.6} />
          </span>
          <strong>AXIOM</strong>
          <p>Autonomous work engine for ambitious operators.</p>
        </div>
        <div className="footer-links">
          <a href="#product">Product</a>
          <a href="#workflow">Workflow</a>
          <a href="#integrations">Integrations</a>
        </div>
        <div className="footer-links">
          <a href="#top">Security</a>
          <a href="#top">Privacy</a>
          <a href="#top">Terms</a>
        </div>
      </div>
      <Separator />
      <div className="shell footer-base">
        <span>© 2026 AXIOM SYSTEMS</span>
        <span>INTERFACE PROTOTYPE / NO LIVE AI CONNECTION</span>
      </div>
    </footer>
  )
}
