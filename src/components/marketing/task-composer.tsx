import { forwardRef } from "react"
import { ArrowUpRight, CornerDownLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { demoTasks, type AgentStage, type DemoTask } from "@/features/agent-demo/model"

type TaskComposerProps = {
  objective: string
  stage: AgentStage
  selectedTaskId: string
  onObjectiveChange: (objective: string) => void
  onSelectTask: (task: DemoTask) => void
  onRun: () => void
}

const busyStages: AgentStage[] = [
  "planning",
  "researching",
  "analyzing",
  "executing",
]

export const TaskComposer = forwardRef<HTMLTextAreaElement, TaskComposerProps>(
  function TaskComposer(
    {
      objective,
      stage,
      selectedTaskId,
      onObjectiveChange,
      onSelectTask,
      onRun,
    },
    ref,
  ) {
    const isBusy = busyStages.includes(stage)

    return (
      <div className="composer-block">
        <div className="composer-label-row">
          <label htmlFor="objective">Objective</label>
          <span>01 / INPUT</span>
        </div>
        <div className="composer-input-shell">
          <Textarea
            ref={ref}
            id="objective"
            value={objective}
            onChange={(event) => onObjectiveChange(event.target.value)}
            rows={4}
            spellCheck="false"
            aria-describedby="objective-help"
          />
          <Button
            className="run-button"
            type="button"
            onClick={onRun}
            disabled={!objective.trim() || isBusy}
          >
            {isBusy ? "Axiom is working" : "Run Axiom"}
            {isBusy ? (
              <span className="working-dot" aria-hidden="true" />
            ) : (
              <ArrowUpRight data-icon="inline-end" />
            )}
          </Button>
        </div>
        <div className="sample-tasks" aria-label="Sample objectives">
          {demoTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              className={selectedTaskId === task.id ? "is-selected" : undefined}
              aria-pressed={selectedTaskId === task.id}
              onClick={() => onSelectTask(task)}
            >
              {task.label}
            </button>
          ))}
        </div>
        <p id="objective-help" className="composer-help">
          <CornerDownLeft aria-hidden="true" />
          Interactive interface preview · no live AI request
        </p>
      </div>
    )
  },
)
