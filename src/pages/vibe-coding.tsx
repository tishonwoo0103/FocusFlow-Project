import { Badge, workspaceTone } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ProgressBar } from "@/components/ProgressBar";
import { useOperatingSystemState } from "@/lib/operatingSystem";
import { workspaceStates, type WorkspaceState } from "@/types";

export default function VibeCodingPage() {
  const { vibeCodingItems, setVibeCodingItems } = useOperatingSystemState();

  const updateItem = (itemId: string, patch: Partial<(typeof vibeCodingItems)[number]>) => {
    setVibeCodingItems((current) => current.map((item) => (item.id === itemId ? { ...item, ...patch } : item)));
  };

  const toggleChecklist = (itemId: string, checklistId: string) => {
    setVibeCodingItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              checklist: item.checklist.map((entry) => (entry.id === checklistId ? { ...entry, done: !entry.done } : entry))
            }
          : item
      )
    );
  };

  return (
    <Layout title="Vibe Coding">
      <PageHeader title="Vibe Coding" eyebrow="Internal Build Workspace" />

      <div className="grid gap-5 xl:grid-cols-2">
        {vibeCodingItems.map((item) => (
          <Panel key={item.id} title={item.feature} actions={<Badge tone={workspaceTone(item.status)}>{item.status}</Badge>}>
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="label">Status</span>
                <select className="select" value={item.status} onChange={(event) => updateItem(item.id, { status: event.target.value as WorkspaceState })}>
                  {workspaceStates.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="label">Notes</span>
                <textarea className="textarea" value={item.notes} onChange={(event) => updateItem(item.id, { notes: event.target.value })} />
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="label">Completion Percentage</span>
                  <span className="text-sm font-bold text-slate-950">{item.completion}%</span>
                </div>
                <ProgressBar value={item.completion} />
                <input
                  aria-label={`Completion percentage for ${item.feature}`}
                  className="mt-3 w-full"
                  type="range"
                  min="0"
                  max="100"
                  value={item.completion}
                  onChange={(event) => updateItem(item.id, { completion: Number(event.target.value) })}
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-950">Checklist</h3>
                <div className="mt-3 space-y-2">
                  {item.checklist.map((entry) => (
                    <label key={entry.id} className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm">
                      <input type="checkbox" checked={entry.done} onChange={() => toggleChecklist(item.id, entry.id)} />
                      <span className={entry.done ? "text-slate-500 line-through" : "text-slate-700"}>{entry.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </Layout>
  );
}
