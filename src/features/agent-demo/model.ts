export type AgentStage =
  | "idle"
  | "ready"
  | "planning"
  | "researching"
  | "analyzing"
  | "executing"
  | "complete"
  | "error"

export type DemoTask = {
  id: string
  label: string
  objective: string
  sources: number
  result: string
}

export type AgentDemoState = {
  selectedTaskId: string
  objective: string
  stage: AgentStage
}

export type AgentDemoAction =
  | { type: "select"; task: DemoTask }
  | { type: "start-task"; task: DemoTask }
  | { type: "edit"; objective: string }
  | { type: "run" }
  | { type: "advance" }
  | { type: "restart" }
  | { type: "fail" }

export const demoTasks: DemoTask[] = [
  {
    id: "market-map",
    label: "Map a market",
    objective:
      "Map the emerging AI operations market and identify three defensible product wedges.",
    sources: 24,
    result:
      "A concise market map, competitive signals, and three ranked opportunities with supporting evidence.",
  },
  {
    id: "product-brief",
    label: "Shape a product",
    objective:
      "Turn customer interview notes into a focused product brief and a two-week validation plan.",
    sources: 16,
    result:
      "A decision-ready product brief with assumptions, evidence gaps, and a sequenced validation sprint.",
  },
  {
    id: "ops-audit",
    label: "Audit operations",
    objective:
      "Audit our weekly operating rhythm and propose an automation plan for repetitive team work.",
    sources: 12,
    result:
      "An operational audit, prioritized automation backlog, and owners for the first execution cycle.",
  },
]

export const initialAgentDemoState: AgentDemoState = {
  selectedTaskId: demoTasks[0].id,
  objective: demoTasks[0].objective,
  stage: "ready",
}

const nextStage: Partial<Record<AgentStage, AgentStage>> = {
  planning: "researching",
  researching: "analyzing",
  analyzing: "executing",
  executing: "complete",
}

export function agentDemoReducer(
  state: AgentDemoState,
  action: AgentDemoAction,
): AgentDemoState {
  switch (action.type) {
    case "select":
      return {
        selectedTaskId: action.task.id,
        objective: action.task.objective,
        stage: "ready",
      }
    case "start-task":
      return {
        selectedTaskId: action.task.id,
        objective: action.task.objective,
        stage: "planning",
      }
    case "edit":
      return {
        selectedTaskId: "custom",
        objective: action.objective,
        stage: action.objective.trim() ? "ready" : "idle",
      }
    case "run":
      return state.objective.trim()
        ? { ...state, stage: "planning" }
        : { ...state, stage: "idle" }
    case "advance":
      return { ...state, stage: nextStage[state.stage] ?? state.stage }
    case "restart":
      return {
        ...state,
        stage: state.objective.trim() ? "ready" : "idle",
      }
    case "fail":
      return { ...state, stage: "error" }
  }
}
