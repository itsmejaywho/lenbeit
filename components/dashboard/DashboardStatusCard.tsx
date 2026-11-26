import Link from "next/link";
import { dashboardStatusCopy } from "../../lib/dashboard-placeholder";
import { Placeholder } from "../Placeholder";
import { ShieldCheckIcon } from "../ui/icons";

type StatusKey = keyof typeof dashboardStatusCopy;

export function DashboardStatusCard({ status }: { status: StatusKey }) {
  const copy = dashboardStatusCopy[status];
  const actionHref = status === "not_submitted" || status === "rejected" ? "/dashboard/verification" : undefined;
  return (
    <section className="dashboard-status-card" aria-labelledby="dashboard-status-heading">
      <div className="dashboard-status-icon"><Placeholder tone="sand" ratio="1" /><ShieldCheckIcon /></div>
      <div>
        <span className="dashboard-status-eyebrow">Rentora</span>
        <h2 id="dashboard-status-heading">{copy.title}</h2>
        <p>{copy.message}</p>
        {"action" in copy && actionHref && <Link className="button button-dark" href={actionHref}>{copy.action}</Link>}
      </div>
    </section>
  );
}
