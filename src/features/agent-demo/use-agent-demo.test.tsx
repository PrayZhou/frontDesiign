import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { demoTasks } from "./model"
import { useAgentDemo } from "./use-agent-demo"

describe("useAgentDemo", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: false }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it("runs the complete deterministic sequence", () => {
    const { result } = renderHook(() => useAgentDemo())

    act(() => result.current.run())
    expect(result.current.state.stage).toBe("planning")

    for (const stage of [
      "researching",
      "analyzing",
      "executing",
      "complete",
    ] as const) {
      act(() => vi.advanceTimersByTime(550))
      expect(result.current.state.stage).toBe(stage)
    }
  })

  it("cancels an active sequence when a new task is selected", () => {
    const { result } = renderHook(() => useAgentDemo())

    act(() => result.current.run())
    act(() => vi.advanceTimersByTime(200))
    act(() => result.current.selectTask(demoTasks[1]))
    act(() => vi.runAllTimers())

    expect(result.current.state.stage).toBe("ready")
    expect(result.current.state.selectedTaskId).toBe(demoTasks[1].id)
  })

  it("does not advance after unmount", () => {
    const { result, unmount } = renderHook(() => useAgentDemo())

    act(() => result.current.run())
    unmount()
    act(() => vi.runAllTimers())

    expect(vi.getTimerCount()).toBe(0)
  })
})
