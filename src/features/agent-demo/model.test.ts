import { describe, expect, it } from "vitest"

import { agentDemoReducer, demoTasks, initialAgentDemoState } from "./model"

describe("agent demo reducer", () => {
  it("selects a task and returns to ready", () => {
    const state = agentDemoReducer(initialAgentDemoState, {
      type: "select",
      task: demoTasks[1],
    })

    expect(state.objective).toBe(demoTasks[1].objective)
    expect(state.stage).toBe("ready")
  })

  it("starts a selected workflow atomically", () => {
    const state = agentDemoReducer(initialAgentDemoState, {
      type: "start-task",
      task: demoTasks[2],
    })

    expect(state.selectedTaskId).toBe(demoTasks[2].id)
    expect(state.objective).toBe(demoTasks[2].objective)
    expect(state.stage).toBe("planning")
  })

  it("advances through research, analysis, execution, and completion", () => {
    let state = agentDemoReducer(initialAgentDemoState, { type: "run" })

    for (const stage of [
      "researching",
      "analyzing",
      "executing",
      "complete",
    ] as const) {
      state = agentDemoReducer(state, { type: "advance" })
      expect(state.stage).toBe(stage)
    }
  })

  it("keeps an empty objective idle", () => {
    const empty = { ...initialAgentDemoState, objective: "" }

    expect(agentDemoReducer(empty, { type: "run" }).stage).toBe("idle")
  })

  it("treats whitespace-only edits as empty", () => {
    const state = agentDemoReducer(initialAgentDemoState, {
      type: "edit",
      objective: "   ",
    })

    expect(state.stage).toBe("idle")
  })
})
