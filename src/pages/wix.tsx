import { ExternalLink } from "lucide-react";
import { Badge, curriculumTone } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useOperatingSystemState } from "@/lib/operatingSystem";
import { curriculumStatuses, type CurriculumStatus } from "@/types";

export default function WixLearningPage() {
  const { curriculumStages, setCurriculumStages } = useOperatingSystemState();

  const updateStatus = (stageId: string, status: CurriculumStatus) => {
    setCurriculumStages((current) => current.map((stage) => (stage.id === stageId ? { ...stage, status } : stage)));
  };

  const updateNotes = (stageId: string, notes: string) => {
    setCurriculumStages((current) => current.map((stage) => (stage.id === stageId ? { ...stage, notes } : stage)));
  };

  return (
    <Layout title="Wix Learning">
      <PageHeader title="Wix Learning Center" eyebrow="Guided Curriculum" />

      <div className="space-y-5">
        {curriculumStages.map((stage) => (
          <Panel
            key={stage.id}
            title={`Stage ${stage.stageNumber}: ${stage.title}`}
            actions={<Badge tone={curriculumTone(stage.status)}>{stage.status}</Badge>}
          >
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-sm leading-6 text-slate-600">{stage.description}</p>
                <label className="mt-4 grid gap-2">
                  <span className="label">Status</span>
                  <select className="select" value={stage.status} onChange={(event) => updateStatus(stage.id, event.target.value as CurriculumStatus)}>
                    {curriculumStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="mt-4 grid gap-2">
                  <span className="label">Notes</span>
                  <textarea className="textarea" value={stage.notes} onChange={(event) => updateNotes(stage.id, event.target.value)} />
                </label>
              </div>

              <div className="grid gap-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-bold text-slate-950">How To Learn</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stage.howToLearn.explanation}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">{stage.howToLearn.workflow}</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {stage.howToLearn.steps.map((step) => (
                      <li key={step} className="rounded-md bg-white px-3 py-2">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-950">Resources</h3>
                  <div className="mt-3 grid gap-2">
                    {stage.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url || "#"}
                        className="flex min-h-11 items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
                        target={resource.url ? "_blank" : undefined}
                        rel={resource.url ? "noreferrer" : undefined}
                      >
                        <span>
                          {resource.type}: {resource.label}
                        </span>
                        <ExternalLink aria-hidden="true" className="h-4 w-4 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
                  <div className="text-sm font-bold text-brand-700">Next Step</div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{stage.nextStep}</p>
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </Layout>
  );
}
