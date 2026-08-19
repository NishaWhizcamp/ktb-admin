export function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="header-gradient border-b border-border px-8 py-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-pink-600">{title}</h1>
      {action}
    </div>
  );
}
