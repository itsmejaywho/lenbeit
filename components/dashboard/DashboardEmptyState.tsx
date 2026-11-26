import Link from "next/link";
import { Placeholder } from "../Placeholder";
import { ShieldCheckIcon } from "../ui/icons";

export function DashboardEmptyState({ message, action, href }: { message: string; action?: string; href?: string }) {
  return (
    <section className="dashboard-empty-state" aria-label="Page information">
      <div className="dashboard-empty-icon">
        <Placeholder tone="sand" ratio="1" />
        <ShieldCheckIcon />
      </div>
      <p>{message}</p>
      {action && href && <Link className="button button-dark" href={href}>{action}</Link>}
    </section>
  );
}
