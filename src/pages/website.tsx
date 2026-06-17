import Link from "next/link";
import { Code2, PanelsTopLeft } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { ProgressBar } from "@/components/ProgressBar";
import { useOperatingSystemState } from "@/lib/operatingSystem";

const averageCompletion = (items: Array<{ completion: number }>) => {
  if (items.length === 0) {
    return 0;
  }

  return Math.round(items.reduce((sum, item) => sum + item.completion, 0) / items.length);
};

export default function WebsitePlanningPage() {
  const { vibeCodingItems, wixDevelopmentItems } = useOperatingSystemState();
  const vibeProgress = averageCompletion(vibeCodingItems);
  const wixProgress = averageCompletion(wixDevelopmentItems);
  const roadmapProgress = Math.round((vibeProgress + wixProgress) / 2);

  return (
    <Layout title="Website Planning">
      <PageHeader title="Website Planning" eyebrow="FocusFlow Build Workspaces" />

      <section className="surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-brand-600">Project Roadmap Progress</div>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">{roadmapProgress}%</h2>
          </div>
          <Badge tone="blue">Two Workspaces</Badge>
        </div>
        <div className="mt-5">
          <ProgressBar value={roadmapProgress} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Link href="/vibe-coding" className="block rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-100">
          <Panel title="Vibe Coding">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                <Code2 aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-slate-600">Track the internal project headquarters and prototype features.</p>
                <div className="mt-4">
                  <ProgressBar value={vibeProgress} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-950">{vibeProgress}% complete</p>
              </div>
            </div>
          </Panel>
        </Link>

        <Link href="/wix-development" className="block rounded-lg focus:outline-none focus:ring-4 focus:ring-brand-100">
          <Panel title="Wix Development">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                <PanelsTopLeft aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-6 text-slate-600">Track the public FocusFlow Wix website pages and launch materials.</p>
                <div className="mt-4">
                  <ProgressBar value={wixProgress} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-950">{wixProgress}% complete</p>
              </div>
            </div>
          </Panel>
        </Link>
      </div>
    </Layout>
  );
}
