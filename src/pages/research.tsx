import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Panel } from "@/components/Panel";
import { useOperatingSystemState } from "@/lib/operatingSystem";

export default function ResearchPage() {
  const { researchDomains, setResearchDomains } = useOperatingSystemState();

  const updateEvidence = (domainId: string, evidenceId: string, field: "source" | "summary" | "establishes", value: string) => {
    setResearchDomains((current) =>
      current.map((domain) =>
        domain.id === domainId
          ? {
              ...domain,
              evidence: domain.evidence.map((item) => (item.id === evidenceId ? { ...item, [field]: value } : item))
            }
          : domain
      )
    );
  };

  return (
    <Layout title="Evidence Library">
      <PageHeader title="Evidence Library" eyebrow="FocusFlow Research Hub" />

      <div className="grid gap-5 xl:grid-cols-2">
        {researchDomains.map((domain) => (
          <Panel key={domain.id} title={domain.name}>
            <div className="space-y-4">
              {domain.evidence.map((item, index) => (
                <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
                  <h2 className="text-sm font-bold text-brand-700">Evidence {index + 1}</h2>
                  <label className="mt-3 grid gap-2">
                    <span className="label">Source</span>
                    <input className="input" value={item.source} onChange={(event) => updateEvidence(domain.id, item.id, "source", event.target.value)} />
                  </label>
                  <label className="mt-3 grid gap-2">
                    <span className="label">Summary</span>
                    <textarea
                      className="textarea"
                      value={item.summary}
                      onChange={(event) => updateEvidence(domain.id, item.id, "summary", event.target.value)}
                    />
                  </label>
                  <label className="mt-3 grid gap-2">
                    <span className="label">What It Establishes</span>
                    <textarea
                      className="textarea"
                      value={item.establishes}
                      onChange={(event) => updateEvidence(domain.id, item.id, "establishes", event.target.value)}
                    />
                  </label>
                </article>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </Layout>
  );
}
