type StatusChipProps = {
  status: "not-submitted" | "pending" | "approved" | "rejected" | "vacant" | "occupied" | "maintenance";
  label: string;
};

export function StatusChip({ status, label }: StatusChipProps) {
  if (status === "vacant" || status === "occupied" || status === "maintenance") {
    return <span className={`dashboard-status-pill is-${status}`}>{label}</span>;
  }
  return (
    <span className={`verification-status-chip is-${status}`}>
      <span className="verification-status-dot" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
