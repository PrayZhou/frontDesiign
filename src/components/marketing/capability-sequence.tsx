import { ArrowDown, Braces, ScanSearch, Send, Waypoints } from "lucide-react"
import { motion } from "motion/react"

const capabilities = [
  {
    index: "01",
    title: "Research",
    description:
      "Search broadly, trace claims to evidence, and keep uncertainty visible.",
    output: "SOURCE MAP",
    icon: ScanSearch,
  },
  {
    index: "02",
    title: "Analyze",
    description:
      "Turn fragmented signals into structured options, risks, and decisions.",
    output: "DECISION MODEL",
    icon: Braces,
  },
  {
    index: "03",
    title: "Execute",
    description:
      "Use tools to create the brief, update the plan, and finish the handoff.",
    output: "DELIVERABLES",
    icon: Send,
  },
]

export function CapabilitySequence() {
  return (
    <section className="workflow-section" id="workflow" aria-labelledby="workflow-title">
      <div className="shell">
        <div className="section-heading-row">
          <div>
            <span className="section-kicker">SYSTEM / WORKFLOW</span>
            <h2 id="workflow-title">One agent. A complete line of work.</h2>
          </div>
          <p>
            Every stage leaves a reviewable trail, so speed never comes at the
            cost of judgment.
          </p>
        </div>

        <motion.div
          className="capability-sequence-shell"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
        >
          <motion.span
            className="capability-flow-line"
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1 },
            }}
            transition={{ duration: 1.05 }}
            aria-hidden="true"
          />
          <motion.ol
            className="capability-sequence"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.14 } },
            }}
          >
            {capabilities.map((capability, index) => {
              const Icon = capability.icon
              return (
                <motion.li
                  key={capability.index}
                  variants={{
                    hidden: { opacity: 0, y: 26 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -6 }}
                >
                  <div className="capability-index">
                    <span>{capability.index}</span>
                    <Waypoints aria-hidden="true" />
                  </div>
                  <Icon className="capability-icon" aria-hidden="true" />
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                  <span className="capability-output">OUTPUT / {capability.output}</span>
                  {index < capabilities.length - 1 && (
                    <ArrowDown className="capability-arrow" aria-hidden="true" />
                  )}
                </motion.li>
              )
            })}
          </motion.ol>
        </motion.div>
      </div>
    </section>
  )
}
