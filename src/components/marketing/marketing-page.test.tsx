import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import App from "@/App"
import { demoTasks } from "@/features/agent-demo/model"

describe("Axiom marketing page", () => {
  it("assembles the product story with honest proof", () => {
    render(<App />)

    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /complex work, made inspectable/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /one agent. a complete line of work/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /built for the work between/i })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /connect the tools/i })).toBeInTheDocument()
    expect(screen.queryByText(/trusted by|10x faster|customers/i)).not.toBeInTheDocument()
  })

  it("routes every primary conversion action to the same objective", async () => {
    const user = userEvent.setup()
    render(<App />)

    const objective = screen.getByRole("textbox", { name: /^objective$/i })
    const callsToAction = screen.getAllByRole("button", {
      name: /^start with a task$/i,
    })

    expect(callsToAction).toHaveLength(3)
    for (const callToAction of callsToAction) {
      await user.click(callToAction)
      expect(objective).toHaveFocus()
    }
  })

  it("opens and closes accessible mobile navigation", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole("button", { name: /open navigation/i }))
    expect(screen.getByRole("dialog", { name: /navigate axiom/i })).toBeInTheDocument()

    await user.click(screen.getByRole("link", { name: "Product" }))
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /navigate axiom/i })).not.toBeInTheDocument()
    })
  })

  it("turns a use case into a running workflow", async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(
      screen.getByRole("button", { name: /try product planning/i }),
    )

    expect(screen.getByRole("textbox", { name: /^objective$/i })).toHaveValue(
      demoTasks[1].objective,
    )
    expect(screen.getByRole("status")).toHaveTextContent(/planning/i)
    expect(
      screen.getByRole("progressbar", { name: /agent execution progress/i }),
    ).toHaveAttribute("aria-valuenow", "12")
  })

  it("exposes the connected agent progress to assistive technology", () => {
    render(<App />)

    expect(
      screen.getByRole("progressbar", { name: /agent execution progress/i }),
    ).toHaveAttribute("aria-valuenow", "0")
  })
})
