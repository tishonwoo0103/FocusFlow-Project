type PanelProps = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="surface">
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        {actions}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
