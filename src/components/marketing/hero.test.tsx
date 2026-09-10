import { useRef } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { demoTasks } from "@/features/agent-demo/model"
import { useAgentDemo } from "@/features/agent-demo/use-agent-demo"

import { Hero } from "./hero"

function HeroHarness() {
  const demo = useAgentDemo()
  const composerRef = useRef<HTMLTextAreaElement>(null)

  return (
    <Hero
      composerRef={composerRef}
      focusComposer={() => composerRef.current?.focus()}
      {...demo}
    />
  )
}

describe("Hero", () => {
  it("selects a sample objective and begins a run", async () => {
    const user = userEvent.setup()
    render(<HeroHarness />)

    const objective = screen.getByRole("textbox", { name: /^objective$/i })
    expect(objective).toHaveValue(demoTasks[0].objective)

    await user.click(
      screen.getByRole("button", { name: demoTasks[1].label }),
    )
    expect(objective).toHaveValue(demoTasks[1].objective)

    await user.click(screen.getByRole("button", { name: /run axiom/i }))
    expect(screen.getByRole("status")).toHaveTextContent(/planning/i)
  })

  it("disables the run action when the objective is empty", async () => {
    const user = userEvent.setup()
    render(<HeroHarness />)

    await user.clear(screen.getByRole("textbox", { name: /^objective$/i }))

    expect(screen.getByRole("button", { name: /run axiom/i })).toBeDisabled()
  })

  it("moves focus from the primary call to action to the objective", async () => {
    const user = userEvent.setup()
    render(<HeroHarness />)

    await user.click(screen.getByRole("button", { name: /start with a task/i }))

    expect(screen.getByRole("textbox", { name: /^objective$/i })).toHaveFocus()
  })
})
