import { render, screen } from "@testing-library/react"
import { expect, it } from "vitest"

import App from "./App"

it("renders the Axiom product heading", () => {
  render(<App />)

  expect(
    screen.getByRole("heading", { name: /from objective to outcome/i }),
  ).toBeInTheDocument()
})
