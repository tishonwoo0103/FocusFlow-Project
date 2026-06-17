type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  children?: React.ReactNode;
};

export function PageHeader({ title, eyebrow, children }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <div className="mb-2 text-sm font-semibold text-brand-600">{eyebrow}</div> : null}
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">{title}</h1>
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </div>
  );
}
