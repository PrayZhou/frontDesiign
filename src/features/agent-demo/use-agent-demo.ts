import { useEffect, useMemo, useReducer } from "react"

import {
  agentDemoReducer,
  demoTasks,
  initialAgentDemoState,
  type DemoTask,
} from "./model"

const activeStages = new Set([
  "planning",
  "researching",
  "analyzing",
  "executing",
])

export function useAgentDemo() {
  const [state, dispatch] = useReducer(agentDemoReducer, initialAgentDemoState)

  useEffect(() => {
    if (!activeStages.has(state.stage)) return

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(
      () => dispatch({ type: "advance" }),
      prefersReducedMotion ? 0 : 550,
    )

    return () => window.clearTimeout(timer)
  }, [state.stage])

  const selectedTask = useMemo(
    () =>
      demoTasks.find((task) => task.id === state.selectedTaskId) ?? {
        id: "custom",
        label: "Custom objective",
        objective: state.objective,
        sources: 18,
        result:
          "A structured brief with sourced findings, decisions, and a reviewable execution record.",
      },
    [state.objective, state.selectedTaskId],
  )

  return {
    state,
    selectedTask,
    selectTask: (task: DemoTask) => dispatch({ type: "select", task }),
    startTask: (task: DemoTask) => dispatch({ type: "start-task", task }),
    setObjective: (objective: string) => dispatch({ type: "edit", objective }),
    run: () => dispatch({ type: "run" }),
    restart: () => dispatch({ type: "restart" }),
  }
}
