import { CheckCircle2, Circle, GitBranch, MessageSquare, Users } from "lucide-react";
import { Badge, statusTone } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useOperatingSystemState } from "@/lib/operatingSystem";
import { collaboratorNames, reviewStates, taskStatuses, type CollaboratorName, type ReviewState, type TaskStatus } from "@/types";

export default function CollaboratorPage() {
  const { collaborationBoard, setCollaborationBoard } = useOperatingSystemState();

  const updateBoard = (patch: Partial<typeof collaborationBoard>) => {
    setCollaborationBoard((current) => ({ ...current, ...patch }));
  };

  const updateItem = (itemId: string, patch: Partial<(typeof collaborationBoard.items)[number]>) => {
    setCollaborationBoard((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
    }));
  };

  const toggleChecklist = (itemId: string, checklistId: string) => {
    setCollaborationBoard((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              checklist: item.checklist.map((entry) => (entry.id === checklistId ? { ...entry, done: !entry.done } : entry))
            }
          : item
      )
    }));
  };

  const miaItems = collaborationBoard.items.filter((item) => item.owner === "Mia" || item.owner === "Both");
  const readyForReview = collaborationBoard.items.filter((item) => item.reviewState === "Needs Review").length;

  return (
    <Layout title="Collaborator Mode">
      <PageHeader title="Collaborator Mode" eyebrow="FocusFlow V3.5">
        <Badge tone="blue">Tishon + Mia</Badge>
        <Badge tone="green">Local Only</Badge>
      </PageHeader>

      <section className="surface p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Users aria-hidden="true" className="h-4 w-4" />
              Shared Build Lane
            </div>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">FocusFlow V3.5</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{collaborationBoard.sharedGoal}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">Mia Items</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{miaItems.length}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">Needs Review</div>
              <div className="mt-2 text-2xl font-bold text-slate-950">{readyForReview}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="label">Default Branch</div>
              <p className="mt-2 break-words text-sm font-bold text-slate-950">{collaborationBoard.githubBranch}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Collaboration Notes">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="label">Shared Goal</span>
              <textarea className="textarea" value={collaborationBoard.sharedGoal} onChange={(event) => updateBoard({ sharedGoal: event.target.value })} />
            </label>
            <label className="grid gap-2">
              <span className="label">Next Check-In</span>
              <input className="input" value={collaborationBoard.nextCheckIn} onChange={(event) => updateBoard({ nextCheckIn: event.target.value })} />
            </label>
            <label className="grid gap-2">
              <span className="label">Default GitHub Branch</span>
              <input className="input" value={collaborationBoard.githubBranch} onChange={(event) => updateBoard({ githubBranch: event.target.value })} />
            </label>
            <label className="grid gap-2">
              <span className="label">Handoff Note</span>
              <textarea className="textarea" value={collaborationBoard.handoffNote} onChange={(event) => updateBoard({ handoffNote: event.target.value })} />
            </label>
            <label className="grid gap-2">
              <span className="label">Review Focus</span>
              <textarea className="textarea" value={collaborationBoard.reviewFocus} onChange={(event) => updateBoard({ reviewFocus: event.target.value })} />
            </label>
          </div>
        </Panel>

        <Panel title="GitHub Safe Workflow">
          <div className="space-y-3">
            {["Pull main before changing files", "Use one feature branch per focused change", "Run checks before review", "Merge only after both people understand the change"].map(
              (step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{index + 1}</div>
                  <p className="text-sm font-semibold leading-6 text-slate-700">{step}</p>
                </div>
              )
            )}
          </div>
          <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
              <GitBranch aria-hidden="true" className="h-4 w-4" />
              Current branch pattern
            </div>
            <p className="mt-2 break-words text-sm font-semibold text-slate-800">{collaborationBoard.githubBranch}</p>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        {collaborationBoard.items.map((item) => (
          <article key={item.id} className="surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase text-brand-600">{item.area}</div>
                <h2 className="mt-1 text-lg font-bold leading-6 text-slate-950">{item.title}</h2>
              </div>
              <Badge tone={statusTone(item.status)}>{item.status}</Badge>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="grid gap-2">
                <span className="label">Owner</span>
                <select className="select" value={item.owner} onChange={(event) => updateItem(item.id, { owner: event.target.value as CollaboratorName })}>
                  {collaboratorNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="label">Status</span>
                <select className="select" value={item.status} onChange={(event) => updateItem(item.id, { status: event.target.value as TaskStatus })}>
                  {taskStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="label">Review Status</span>
                <select className="select" value={item.reviewState} onChange={(event) => updateItem(item.id, { reviewState: event.target.value as ReviewState })}>
                  {reviewStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="label">GitHub Branch</span>
                <input className="input" value={item.githubBranch} onChange={(event) => updateItem(item.id, { githubBranch: event.target.value })} />
              </label>
              <label className="grid gap-2">
                <span className="label">Handoff</span>
                <textarea className="textarea" value={item.handoffNote} onChange={(event) => updateItem(item.id, { handoffNote: event.target.value })} />
              </label>
              <label className="grid gap-2">
                <span className="label">Check-In Note</span>
                <textarea className="textarea" value={item.checkInNote} onChange={(event) => updateItem(item.id, { checkInNote: event.target.value })} />
              </label>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-950">
                <MessageSquare aria-hidden="true" className="h-4 w-4" />
                Shared Checklist
              </div>
              <div className="space-y-2">
                {item.checklist.map((entry) => {
                  const Icon = entry.done ? CheckCircle2 : Circle;

                  return (
                    <label key={entry.id} className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm">
                      <input className="sr-only" type="checkbox" checked={entry.done} onChange={() => toggleChecklist(item.id, entry.id)} />
                      <Icon aria-hidden="true" className={`h-5 w-5 ${entry.done ? "text-emerald-600" : "text-slate-400"}`} />
                      <span className={entry.done ? "text-slate-500 line-through" : "text-slate-700"}>{entry.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
}
