import type { ReactNode } from "react";

type DetailCardProps = {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function DetailCard({ icon, title, action, children }: DetailCardProps) {
  return (
    <section className="detail-card" aria-label={title}>
      <header className="detail-card-header">
        <span className="detail-card-icon" aria-hidden="true">{icon}</span>
        <h2>{title}</h2>
        {action && <div className="detail-card-action">{action}</div>}
      </header>
      <div className="detail-card-content">{children}</div>
    </section>
  );
}
