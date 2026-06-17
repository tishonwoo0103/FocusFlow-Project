import { Badge, workspaceTone } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ProgressBar } from "@/components/ProgressBar";
import { useOperatingSystemState } from "@/lib/operatingSystem";
import { workspaceStates, type WorkspaceState } from "@/types";

export default function WixDevelopmentPage() {
  const { wixDevelopmentItems, setWixDevelopmentItems } = useOperatingSystemState();

  const updatePage = (pageId: string, patch: Partial<(typeof wixDevelopmentItems)[number]>) => {
    setWixDevelopmentItems((current) => current.map((page) => (page.id === pageId ? { ...page, ...patch } : page)));
  };

  const toggleChecklist = (pageId: string, checklistId: string) => {
    setWixDevelopmentItems((current) =>
      current.map((page) =>
        page.id === pageId
          ? {
              ...page,
              checklist: page.checklist.map((entry) => (entry.id === checklistId ? { ...entry, done: !entry.done } : entry))
            }
          : page
      )
    );
  };

  return (
    <Layout title="Wix Development">
      <PageHeader title="Wix Development" eyebrow="Public Website Workspace" />

      <div className="grid gap-5 xl:grid-cols-2">
        {wixDevelopmentItems.map((page) => (
          <Panel key={page.id} title={page.page} actions={<Badge tone={workspaceTone(page.status)}>{page.status}</Badge>}>
            <div className="grid gap-4">
              <label className="grid gap-2">
                <span className="label">Status</span>
                <select className="select" value={page.status} onChange={(event) => updatePage(page.id, { status: event.target.value as WorkspaceState })}>
                  {workspaceStates.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="label">Notes</span>
                <textarea className="textarea" value={page.notes} onChange={(event) => updatePage(page.id, { notes: event.target.value })} />
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="label">Completion Percentage</span>
                  <span className="text-sm font-bold text-slate-950">{page.completion}%</span>
                </div>
                <ProgressBar value={page.completion} />
                <input
                  aria-label={`Completion percentage for ${page.page}`}
                  className="mt-3 w-full"
                  type="range"
                  min="0"
                  max="100"
                  value={page.completion}
                  onChange={(event) => updatePage(page.id, { completion: Number(event.target.value) })}
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-950">Checklist</h3>
                <div className="mt-3 space-y-2">
                  {page.checklist.map((entry) => (
                    <label key={entry.id} className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm">
                      <input type="checkbox" checked={entry.done} onChange={() => toggleChecklist(page.id, entry.id)} />
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
