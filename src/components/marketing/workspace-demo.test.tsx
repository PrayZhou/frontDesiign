import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  demoTasks,
  initialAgentDemoState,
  type AgentDemoState,
} from "@/features/agent-demo/model"

import { WorkspaceDemo } from "./workspace-demo"

function state(stage: AgentDemoState["stage"]): AgentDemoState {
  return { ...initialAgentDemoState, stage }
}

describe("WorkspaceDemo", () => {
  it("asks for an objective when the workspace is idle", () => {
    render(<WorkspaceDemo state={state("idle")} task={demoTasks[0]} />)

    expect(screen.getByText(/choose an objective/i)).toBeInTheDocument()
  })

  it("shows progress while preparing the execution plan", () => {
    render(<WorkspaceDemo state={state("planning")} task={demoTasks[0]} />)

    expect(screen.getByText(/preparing the execution plan/i)).toBeInTheDocument()
  })

  it("keeps recovery context when a run is interrupted", () => {
    render(<WorkspaceDemo state={state("error")} task={demoTasks[0]} />)

    expect(screen.getByText(/run interrupted/i)).toBeInTheDocument()
    expect(screen.getByText(/objective remains available/i)).toBeInTheDocument()
  })

  it("shows plan, evidence, and deliverables when complete", () => {
    render(<WorkspaceDemo state={state("complete")} task={demoTasks[0]} />)

    expect(screen.getByRole("list", { name: /execution plan/i })).toBeInTheDocument()
    expect(screen.getByText(/sources reviewed/i)).toBeInTheDocument()
    expect(screen.getByText(demoTasks[0].result)).toBeInTheDocument()
  })
})
