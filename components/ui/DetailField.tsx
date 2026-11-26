import type { ReactNode } from "react";

type DetailFieldProps = {
  label: string;
  htmlFor?: string;
  value?: ReactNode;
  hint?: string;
  children?: ReactNode;
};

export function DetailField({ label, htmlFor, value, hint, children }: DetailFieldProps) {
  return (
    <div className="detail-field">
      {label && (htmlFor
        ? <label className="detail-field-label" htmlFor={htmlFor}>{label}</label>
        : <span className="detail-field-label">{label}</span>)}
      {children ? <div className="detail-field-control">{children}</div> : <div className="detail-field-value">{value}</div>}
      {hint && <p className="detail-field-hint">{hint}</p>}
    </div>
  );
}
