"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthField } from "../auth/AuthField";
import { ResendEmailButton } from "../auth/ResendEmailButton";
import { useDashboardUser } from "./DashboardContext";
import { DashboardPage } from "./DashboardPage";
import { Placeholder } from "../Placeholder";
import { Dropdown } from "../ui/Dropdown";
import { DetailCard } from "../ui/DetailCard";
import { DetailField } from "../ui/DetailField";
import { StatusChip } from "../ui/StatusChip";
import { useFormField } from "../../lib/useFormField";
import { verificationPlaceholderData as copy } from "../../lib/verification-placeholder";
import { LockIcon, ShieldCheckIcon, UserIcon } from "../ui/icons";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png"];
const PROOF_TYPES = [...IMAGE_TYPES, "application/pdf"];

function validateRequired(value: string) {
  return value.trim() ? null : "Choose an option.";
}

function validateFullName(value: string) {
  if (!value.trim()) return "Enter your full name.";
  return value.trim().length >= 2 ? null : "Enter at least 2 characters.";
}

function validateLandline(value: string) {
  if (!value.trim()) return null;
  const normalized = value.replace(/[\s()-]/g, "").replace(/^\+63/, "0");
  return /^0(?:9\d{9}|[2-8]\d{7,9})$/.test(normalized)
    ? null
    : "Enter a valid Philippine landline or mobile number.";
}

function validateAgreement(value: string) {
  return value === "confirmed" ? null : "Confirm that your details and documents are true.";
}

function formatFileSize(size: number) {
  return size >= 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(size / 1024))} KB`;
}

function InlineIcon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function IdCardIcon() {
  return <InlineIcon><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M5.5 16c.5-1.5 1.3-2.2 2.5-2.2s2 .7 2.5 2.2M13 10h5M13 14h5" /></InlineIcon>;
}

function DocumentIcon() {
  return <InlineIcon><path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></InlineIcon>;
}

function PhoneIcon() {
  return <InlineIcon><path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M10 17h4" /></InlineIcon>;
}

function MailIcon() {
  return <InlineIcon><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></InlineIcon>;
}

function CameraIcon() {
  return <InlineIcon><path d="M4 8h3l1.5-2h7L17 8h3v11H4Z" /><circle cx="12" cy="13" r="3.5" /></InlineIcon>;
}

function statusInfo(status: string) {
  switch (status) {
    case "pending": return { label: "Under review", tone: "pending" as const };
    case "approved": return { label: "Approved", tone: "approved" as const };
    case "rejected": return { label: "Rejected", tone: "rejected" as const };
    default: return { label: "Not submitted", tone: "not-submitted" as const };
  }
}

function statusLabel(status: string) {
  return status === "passport" ? "Philippine passport"
    : copy.idTypes.find((item) => item.id === status)?.label ?? "National ID (PhilSys)";
}

function proofLabel(status: string) {
  return copy.proofTypes.find((item) => item.id === status)?.label ?? "Utility bill for the property";
}

export function VerificationDashboard() {
  const { userStatus, setVerificationStatus } = useDashboardUser();
  const status = userStatus.emailVerified ? userStatus.verificationStatus : "unverified";
  const isUnverified = status === "unverified";
  const isReadOnly = status === "pending" || status === "approved";
  const isRejected = status === "rejected";
  const editable = !isReadOnly;
  const chip = statusInfo(status);
  const fullName = useFormField(validateFullName, userStatus.name);
  const landline = useFormField(validateLandline);
  const idType = useFormField(validateRequired);
  const proofType = useFormField(validateRequired);
  const documentAddress = useFormField(() => null);
  const agreement = useFormField(validateAgreement);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [idRemoved, setIdRemoved] = useState(false);
  const [proofRemoved, setProofRemoved] = useState(false);
  const [idFileError, setIdFileError] = useState("");
  const [proofFileError, setProofFileError] = useState("");
  const [agreementError, setAgreementError] = useState("");
  const [submittedAttempt, setSubmittedAttempt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const idInputRef = useRef<HTMLInputElement>(null);
  const idPreviewUrlRef = useRef("");
  const proofInputRef = useRef<HTMLInputElement>(null);
  const submitLock = useRef(false);
  const submitTimer = useRef<number | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const agreementInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (submitTimer.current !== null) window.clearTimeout(submitTimer.current);
    if (idPreviewUrlRef.current) URL.revokeObjectURL(idPreviewUrlRef.current);
  }, []);

  const idIsExisting = isRejected && !idFile && !idRemoved;
  const proofIsExisting = isRejected && proofFiles.length === 0 && !proofRemoved;
  const selectedIdType = idType.value || (isRejected ? "national-id" : "");
  const selectedProofType = proofType.value || (isRejected ? "utility-bill" : "");
  const proofHint = selectedProofType === "authorization" ? "Also upload the owner's ID." : "";
  const maxProofFiles = selectedProofType === "authorization" ? 2 : 1;
  const idRequiredError = idFileError || (submittedAttempt && !idFile && !idIsExisting ? "Upload a photo of your ID." : "");
  const proofRequiredError = proofFileError || (submittedAttempt && proofFiles.length === 0 && !proofIsExisting ? "Upload a proof document." : "");

  function chooseIdFile(file: File | undefined) {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      clearIdFile();
      setIdRemoved(false);
      setIdFileError("Choose a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      clearIdFile();
      setIdRemoved(false);
      setIdFileError("The file must be 5 MB or smaller.");
      return;
    }
    clearIdFile();
    const objectUrl = URL.createObjectURL(file);
    idPreviewUrlRef.current = objectUrl;
    setIdPreview(objectUrl);
    setIdFile(file);
    setIdRemoved(false);
    setIdFileError("");
  }

  function clearIdFile() {
    if (idPreviewUrlRef.current) URL.revokeObjectURL(idPreviewUrlRef.current);
    idPreviewUrlRef.current = "";
    setIdPreview("");
    setIdFile(null);
  }

  function chooseProofFiles(files: FileList | null) {
    if (!files?.length) return;
    const chosen = Array.from(files);
    if (chosen.length > maxProofFiles) {
      setProofFileError(`Choose no more than ${maxProofFiles} file${maxProofFiles === 1 ? "" : "s"}.`);
      return;
    }
    if (chosen.some((file) => !PROOF_TYPES.includes(file.type))) {
      setProofFileError("Choose a JPG, PNG, or PDF document.");
      return;
    }
    if (chosen.some((file) => file.size > MAX_FILE_SIZE)) {
      setProofFileError("Each file must be 5 MB or smaller.");
      return;
    }
    setProofFiles(chosen);
    setProofRemoved(false);
    setProofFileError("");
  }

function openFilePicker(event: KeyboardEvent<HTMLLabelElement>, inputRef: RefObject<HTMLInputElement | null>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || !editable) return;
    setSubmittedAttempt(true);
    const nameError = fullName.validateForSubmit();
    const phoneError = landline.validateForSubmit();
    const idTypeError = idType.value ? idType.validateForSubmit() : isRejected && selectedIdType ? null : idType.validateForSubmit();
    const proofTypeError = proofType.value ? proofType.validateForSubmit() : isRejected && selectedProofType ? null : proofType.validateForSubmit();
    const confirmError = agreement.validateForSubmit();
    setAgreementError(confirmError ?? "");
    if (nameError) {
      nameInputRef.current?.focus();
      return;
    }
    if (phoneError) {
      document.getElementById("verification-landline")?.focus();
      return;
    }
    if (idTypeError) {
      document.getElementById("verification-id-type")?.focus();
      return;
    }
    if (idRequiredError || (!idFile && !idIsExisting)) {
      document.getElementById("verification-id-upload-target")?.focus();
      return;
    }
    if (proofTypeError) {
      document.getElementById("verification-proof-type")?.focus();
      return;
    }
    if (proofRequiredError || (!proofFiles.length && !proofIsExisting)) {
      document.getElementById("verification-proof-upload-target")?.focus();
      return;
    }
    if (confirmError) {
      agreementInputRef.current?.focus();
      return;
    }

    submitLock.current = true;
    setSubmitting(true);
    // TODO: Upload the ID photo and proof files to the backend, then submit this verification record.
    // The server must re-check file types and sizes, store files privately, and check the user's role and current status before saving.
    submitTimer.current = window.setTimeout(() => {
      setVerificationStatus("pending");
      submitLock.current = false;
      setSubmitting(false);
    }, 600);
  }

  const idEditAction = isRejected ? <button className="button button-outline verification-edit" type="button" onClick={() => document.getElementById("verification-full-name")?.focus()}>Edit</button> : undefined;
  const idPhotoTitle = idFile?.name ?? copy.idFileName;
  const idPhotoSize = idFile ? formatFileSize(idFile.size) : copy.idFileSize;
  const shownProofFiles = proofFiles.length ? proofFiles : isReadOnly || proofIsExisting ? [{ name: copy.proofFileName, size: 0 } as File] : [];
  const submittedDate = status === "not_submitted" ? "Not yet" : copy.submittedAt;
  const reviewedDate = status === "pending" || status === "not_submitted" ? "Not yet" : copy.reviewedAt;

  return (
    <DashboardPage
      title="Verification"
      subtitle="Confirm who you are so renters can trust your listings."
      userStatus={userStatus}
    >
      <div className="verification-page">
        {isUnverified ? (
          <div className="verification-single-card">
            <DetailCard icon={<MailIcon />} title="Please confirm your email">
              <p className="verification-body-copy">Confirm your email address before submitting your verification details.</p>
              <ResendEmailButton />
            </DetailCard>
          </div>
        ) : (
          <>
            <section className="verification-summary" aria-label="Verification summary">
              <div className="verification-summary-person">
                <span className="verification-avatar" aria-hidden="true">{userStatus.name.trim().charAt(0).toUpperCase() || "R"}</span>
                <div className="verification-summary-name">
                  <h2>{userStatus.name}</h2>
                  <StatusChip status={chip.tone} label={chip.label} />
                </div>
              </div>
              <dl className="verification-summary-items">
                <div><dt>Email</dt><dd>Confirmed</dd></div>
                <div><dt>Submitted</dt><dd>{submittedDate}</dd></div>
                <div><dt>Reviewed</dt><dd>{reviewedDate}</dd></div>
              </dl>
              {editable && <button className="button button-dark verification-summary-submit" type="submit" form="verification-form" disabled={submitting}>{isRejected ? "Resubmit for review" : "Submit for review"}</button>}
            </section>

            {status === "pending" && <div className="verification-banner is-pending" role="status">Your verification is under review. We will email you when it is done.</div>}
            {status === "approved" && <div className="verification-banner is-approved" role="status"><span>You&apos;re verified.</span><Link className="button button-dark" href="/dashboard">Go to dashboard</Link></div>}
            {isRejected && <div className="verification-banner is-rejected" role="alert"><strong>We couldn&apos;t approve these details yet.</strong><span>{copy.rejectionReason}</span></div>}

            <form id="verification-form" className="verification-form" noValidate onSubmit={handleSubmit}>
              <div className="verification-columns">
                <div className="verification-column">
                  <DetailCard icon={<UserIcon />} title="Personal information" action={idEditAction}>
                    <div className="verification-fields-grid">
                      <DetailField label={editable ? "" : "Full name as shown on your ID"}>
                        {editable ? <AuthField id="verification-full-name" label="Full name as shown on your ID" autoComplete="name" value={fullName.value} error={fullName.error} validAfterBlur={fullName.validAfterBlur} required inputRef={nameInputRef} onChange={fullName.handleChange} onBlur={fullName.handleBlur} /> : <span>{fullName.value}</span>}
                      </DetailField>
                      <DetailField label={editable ? "" : "Landline or business number"} hint="Helps us confirm you by phone.">
                        {editable ? <AuthField id="verification-landline" label="Landline or business number" type="tel" autoComplete="tel" inputMode="tel" value={landline.value} error={landline.error} validAfterBlur={landline.validAfterBlur} onChange={landline.handleChange} onBlur={landline.handleBlur} /> : <span>{landline.value || "Not provided"}</span>}
                      </DetailField>
                    </div>
                  </DetailCard>

                  <DetailCard icon={<IdCardIcon />} title="Identity document" action={isRejected ? <button className="button button-outline verification-edit" type="button" onClick={() => document.getElementById("verification-id-type")?.focus()}>Edit</button> : undefined}>
                    <div className="verification-fields-grid">
                      <DetailField label={editable ? "" : "ID type"}>
                        {editable ? (
                          <>
                            <label className="verification-control-label" htmlFor="verification-id-type">ID type <span aria-hidden="true">*</span></label>
                            <Dropdown id="verification-id-type" aria-label="ID type" aria-describedby="verification-id-type-error" items={copy.idTypes} value={selectedIdType} onChange={idType.handleChange} onBlur={idType.handleBlur} placeholder="Choose an ID type" />
                            {idType.error && <p className="verification-field-error" id="verification-id-type-error" aria-live="polite">{idType.error}</p>}
                          </>
                        ) : <span>{statusLabel(selectedIdType)}</span>}
                      </DetailField>
                      <DetailField label="ID photo" htmlFor="verification-id-photo" hint="Good light, no glare, all four corners visible, text readable.">
                        {editable ? (
                          <div className="verification-file-control">
                            <input ref={idInputRef} className="verification-file-input" id="verification-id-photo" type="file" accept="image/jpeg,image/png" capture="environment" aria-describedby="verification-id-photo-hint verification-id-photo-error" onChange={(event) => { chooseIdFile(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />
                            <span id="verification-id-photo-hint" className="verification-visually-hidden">JPG or PNG, up to 5 MB.</span>
                            {idFile ? (
                              <div className="verification-file-preview-row">
                                <Image unoptimized width={62} height={48} className="verification-id-preview" src={idPreview} alt="Preview of your ID photo" />
                                <div className="verification-file-name"><strong>{idPhotoTitle}</strong><span>{idPhotoSize}</span></div>
                                <div className="verification-file-actions"><button type="button" className="verification-text-button" onClick={() => idInputRef.current?.click()}>Retake</button><button type="button" className="verification-text-button is-danger" onClick={() => { clearIdFile(); setIdRemoved(true); setIdFileError(""); }}>Remove</button></div>
                              </div>
                            ) : idIsExisting ? (
                              <div className="verification-file-preview-row">
                                <span className="verification-placeholder-thumb"><Placeholder tone="sand" ratio="4 / 3" /></span>
                                <div className="verification-file-name"><strong>{idPhotoTitle}</strong><span>{idPhotoSize}</span></div>
                                <div className="verification-file-actions"><button type="button" className="verification-text-button" onClick={() => idInputRef.current?.click()}>Retake</button><button type="button" className="verification-text-button is-danger" onClick={() => { setIdRemoved(true); setIdFileError(""); }}>Remove</button></div>
                              </div>
                            ) : (
                              <label id="verification-id-upload-target" className="verification-upload-target" htmlFor="verification-id-photo" tabIndex={0} onKeyDown={(event) => openFilePicker(event, idInputRef)}>
                                <CameraIcon />
                                <span>Take a photo or upload.</span>
                                <small>JPG or PNG · Up to 5 MB</small>
                              </label>
                            )}
                            {idRequiredError && <p className="verification-field-error" id="verification-id-photo-error" aria-live="polite">{idRequiredError}</p>}
                          </div>
                        ) : (
                          <div className="verification-file-preview-row">
                            {idFile && idPreview ? <Image unoptimized width={62} height={48} className="verification-id-preview" src={idPreview} alt="Preview of your ID photo" /> : <span className="verification-placeholder-thumb"><Placeholder tone="sand" ratio="4 / 3" /></span>}
                            <div className="verification-file-name"><strong>{idPhotoTitle}</strong><span>{idPhotoSize}</span></div>
                          </div>
                        )}
                      </DetailField>
                    </div>
                  </DetailCard>

                  <DetailCard icon={<DocumentIcon />} title="Proof you can rent out a property" action={isRejected ? <button className="button button-outline verification-edit" type="button" onClick={() => document.getElementById("verification-proof-type")?.focus()}>Edit</button> : undefined}>
                    <div className="verification-fields-grid">
                      <DetailField label={editable ? "" : "Document type"}>
                        {editable ? (
                          <>
                            <label className="verification-control-label" htmlFor="verification-proof-type">Document type <span aria-hidden="true">*</span></label>
                            <Dropdown id="verification-proof-type" aria-label="Document type" aria-describedby="verification-proof-type-error" items={copy.proofTypes} value={selectedProofType} onChange={(nextType) => { proofType.handleChange(nextType); if (nextType !== "authorization" && proofFiles.length > 1) setProofFiles(proofFiles.slice(0, 1)); }} onBlur={proofType.handleBlur} placeholder="Choose a document type" />
                            {proofType.error && <p className="verification-field-error" id="verification-proof-type-error" aria-live="polite">{proofType.error}</p>}
                          </>
                        ) : <span>{proofLabel(selectedProofType)}</span>}
                        {proofHint && <p className="detail-field-hint">{proofHint}</p>}
                      </DetailField>
                      <DetailField label="Proof file" htmlFor="verification-proof-file" hint="JPG, PNG, or PDF · Up to 5 MB per file.">
                        {editable ? (
                          <div className="verification-file-control">
                            <input ref={proofInputRef} className="verification-file-input" id="verification-proof-file" type="file" accept="image/jpeg,image/png,application/pdf" multiple={maxProofFiles === 2} aria-describedby="verification-proof-file-hint verification-proof-file-error" onChange={(event) => { chooseProofFiles(event.currentTarget.files); event.currentTarget.value = ""; }} />
                            <span id="verification-proof-file-hint" className="verification-visually-hidden">JPG, PNG, or PDF, up to 5 MB. Up to two files for an authorization letter.</span>
                            {proofFiles.length || proofIsExisting ? (
                              <div className="verification-proof-file-list">
                                {(proofFiles.length ? proofFiles : [{ name: copy.proofFileName, size: 0 } as File]).map((file, index) => (
                                  <div className="verification-proof-file" key={`${file.name}-${index}`}>
                                    <span className="verification-proof-file-icon"><DocumentIcon /></span>
                                    <span className="verification-file-name"><strong>{file.name}</strong><span>{file.size ? formatFileSize(file.size) : copy.proofFileSize}</span></span>
                                    {index === 0 && <button type="button" className="verification-text-button" onClick={() => proofInputRef.current?.click()}>{proofIsExisting ? "Replace" : "Replace"}</button>}
                                    {index === 0 && <button type="button" className="verification-text-button is-danger" onClick={() => { setProofFiles([]); setProofRemoved(true); setProofFileError(""); }}>Remove</button>}
                                  </div>
                                ))}
                                {maxProofFiles === 2 && proofFiles.length < 2 && <button className="verification-add-file" type="button" onClick={() => proofInputRef.current?.click()}>Add another file</button>}
                              </div>
                            ) : (
                              <label id="verification-proof-upload-target" className="verification-upload-target verification-upload-target-compact" htmlFor="verification-proof-file" tabIndex={0} onKeyDown={(event) => openFilePicker(event, proofInputRef)}>
                                <DocumentIcon />
                                <span>Upload a document</span>
                                <small>JPG, PNG, or PDF · Up to 5 MB</small>
                              </label>
                            )}
                            {proofRequiredError && <p className="verification-field-error" id="verification-proof-file-error" aria-live="polite">{proofRequiredError}</p>}
                          </div>
                        ) : (
                          <div className="verification-proof-file-list">
                            {(shownProofFiles.length ? shownProofFiles : [{ name: copy.proofFileName, size: 0 } as File]).map((file, index) => (
                              <div className="verification-proof-file" key={`${file.name}-${index}`}><span className="verification-proof-file-icon"><DocumentIcon /></span><span className="verification-file-name"><strong>{file.name}</strong><span>{file.size ? formatFileSize(file.size) : copy.proofFileSize}</span></span></div>
                            ))}
                          </div>
                        )}
                      </DetailField>
                      <DetailField label={editable ? "" : "Address shown on your document"} hint="Helps us match it to the property you add.">
                        {editable ? <AuthField id="verification-document-address" label="Address shown on your document" autoComplete="street-address" value={documentAddress.value || (isRejected ? copy.documentAddress : "")} onChange={documentAddress.handleChange} onBlur={documentAddress.handleBlur} /> : <span>{documentAddress.value || copy.documentAddress}</span>}
                      </DetailField>
                    </div>
                  </DetailCard>
                </div>

                <aside className="verification-column verification-column-right">
                  <DetailCard icon={<PhoneIcon />} title="Contact information">
                    <p className="verification-card-note">From your account</p>
                    <div className="verification-contact-fields">
                      <DetailField label="Mobile number" value={<>{copy.mobile}<span className="verification-confirmed-tag">Confirmed</span></>} />
                      <DetailField label="Email" value={<>{copy.email}<span className="verification-confirmed-tag">Confirmed</span></>} />
                    </div>
                    <Link className="verification-inline-link" href="/dashboard/settings">Change in Settings</Link>
                  </DetailCard>

                  <DetailCard icon={<ShieldCheckIcon />} title="How review works">
                    <ol className="verification-review-steps">{copy.reviewSteps.map((step) => <li key={step}>{step}</li>)}</ol>
                    <p className="verification-review-promise">{copy.reviewPromise}</p>
                  </DetailCard>

                  <DetailCard icon={<LockIcon />} title="Your privacy">
                    <p className="verification-privacy-copy">{copy.privacy}</p>
                    <Link className="verification-inline-link" href="/privacy">Privacy Policy</Link>
                    <div className={`verification-agreement${agreement.error || agreementError ? " has-error" : ""}`}>
                      <input ref={agreementInputRef} id="verification-agreement" type="checkbox" checked={isReadOnly || agreement.value === "confirmed"} disabled={!editable} aria-invalid={Boolean(agreement.error || agreementError)} aria-describedby="verification-agreement-error" onChange={(event) => { agreement.handleChange(event.target.checked ? "confirmed" : ""); setAgreementError(""); }} onBlur={() => { agreement.handleBlur(); if (submittedAttempt && !agreement.value) setAgreementError(validateAgreement("") ?? ""); }} />
                      <label htmlFor="verification-agreement">I confirm the details and documents I submitted are true and belong to me, or I am authorized to use them.</label>
                    </div>
                    {(agreement.error || agreementError) && <p className="verification-field-error" id="verification-agreement-error" aria-live="polite">{agreement.error || agreementError}</p>}
                  </DetailCard>
                </aside>
              </div>

              {editable && <div className="verification-submit-bar"><button className="button button-dark verification-submit-button" type="submit" disabled={submitting}>{submitting ? "Submitting..." : isRejected ? "Resubmit for review" : "Submit for review"}</button></div>}
            </form>
          </>
        )}
      </div>
    </DashboardPage>
  );
}
