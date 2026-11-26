type StatusChipProps = {
  status: "not-submitted" | "pending" | "approved" | "rejected";
  label: string;
};

export function StatusChip({ status, label }: StatusChipProps) {
  return (
    <span className={`verification-status-chip is-${status}`}>
      <span className="verification-status-dot" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
