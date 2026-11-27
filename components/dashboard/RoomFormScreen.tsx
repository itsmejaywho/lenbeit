"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardPage } from "./DashboardPage";
import { useDashboardUser } from "./DashboardContext";
import { dashboardProperties, type DashboardRoom, type RoomPhoto, type RoomType } from "../../lib/dashboard-placeholder";
import { roomTypeLabels } from "../../lib/room-labels";
import { DetailCard } from "../ui/DetailCard";
import { DetailField } from "../ui/DetailField";
import { Dropdown } from "../ui/Dropdown";
import { CheckIcon, HomeIcon, ListIcon, PhotoIcon, PlusIcon } from "../ui/icons";

type FormValues = {
  propertyId: string; name: string; roomType: RoomType | ""; monthlyRent: string; availableFrom: string; availableNow: boolean;
  depositMonths: string; advanceMonths: string; capacity: string; bathroom: "" | "private" | "shared";
  furnishing: "" | "unfurnished" | "semi" | "furnished"; floorAreaSqm: string; description: string; rules: string; contactPhone: string;
};

const emptyValues: FormValues = {
  propertyId: "", name: "", roomType: "", monthlyRent: "", availableFrom: "", availableNow: true,
  depositMonths: "", advanceMonths: "", capacity: "1", bathroom: "", furnishing: "", floorAreaSqm: "", description: "", rules: "", contactPhone: "",
};
const imageTypes = ["image/jpeg", "image/png"];
const maxPhotoSize = 5 * 1024 * 1024;

function options<T extends string>(items: readonly { id: T; label: string }[]) { return items; }

export function RoomFormScreen({ roomId }: { roomId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userStatus, rooms, saveRoom } = useDashboardUser();
  const editing = Boolean(roomId);
  const duplicateId = searchParams.get("duplicate");
  const sourceRoom = rooms.find((room) => room.id === (roomId ?? duplicateId));
  const initialRoom = sourceRoom;
  const [values, setValues] = useState<FormValues>(() => initialRoom ? {
    propertyId: initialRoom.propertyId, name: duplicateId ? `${initialRoom.name} (copy)` : initialRoom.name,
    roomType: initialRoom.roomType, monthlyRent: String(initialRoom.monthlyRent), availableFrom: initialRoom.availableFrom === "now" ? "" : initialRoom.availableFrom,
    availableNow: initialRoom.availableFrom === "now", depositMonths: String(initialRoom.depositMonths ?? ""), advanceMonths: String(initialRoom.advanceMonths ?? ""),
    capacity: String(initialRoom.capacity ?? ""), bathroom: initialRoom.bathroom ?? "", furnishing: initialRoom.furnishing ?? "",
    floorAreaSqm: initialRoom.floorAreaSqm ? String(initialRoom.floorAreaSqm) : "", description: initialRoom.description,
    rules: initialRoom.rules ?? "", contactPhone: initialRoom.contactPhone ?? "",
  } : emptyValues);
  const [photos, setPhotos] = useState<RoomPhoto[]>(initialRoom?.photos ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [notice, setNotice] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const rentRef = useRef<HTMLInputElement>(null);
  const ownedUrls = useRef(new Set<string>());
  const approved = userStatus.emailVerified && userStatus.verificationStatus === "approved";
  const dirty = useMemo(() => Boolean(duplicateId) || JSON.stringify(values) !== JSON.stringify(initialRoom ? {
    propertyId: initialRoom.propertyId, name: duplicateId ? `${initialRoom.name} (copy)` : initialRoom.name,
    roomType: initialRoom.roomType, monthlyRent: String(initialRoom.monthlyRent), availableFrom: initialRoom.availableFrom === "now" ? "" : initialRoom.availableFrom,
    availableNow: initialRoom.availableFrom === "now", depositMonths: String(initialRoom.depositMonths ?? ""), advanceMonths: String(initialRoom.advanceMonths ?? ""),
    capacity: String(initialRoom.capacity ?? ""), bathroom: initialRoom.bathroom ?? "", furnishing: initialRoom.furnishing ?? "",
    floorAreaSqm: initialRoom.floorAreaSqm ? String(initialRoom.floorAreaSqm) : "", description: initialRoom.description,
    rules: initialRoom.rules ?? "", contactPhone: initialRoom.contactPhone ?? "",
  } : emptyValues) || JSON.stringify(photos) !== JSON.stringify(initialRoom?.photos ?? []), [initialRoom, duplicateId, photos, values]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  useEffect(() => () => { ownedUrls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const setField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: validateField(field, { ...values, [field]: value }) }));
  };

  function validateField(field: keyof FormValues, data = values) {
    if (field === "propertyId" && !data.propertyId) return "Choose a property.";
    if (field === "name") {
      const name = data.name.trim();
      if (!name) return "Enter a room name or number.";
      if (name.length > 80) return "Use 80 characters or fewer.";
      if (dashboardProperties.some((property) => property.id === data.propertyId) && rooms.some((room) => room.propertyId === data.propertyId && room.id !== roomId && room.name.trim().toLowerCase() === name.toLowerCase())) return "This room name already exists for this property.";
    }
    if (field === "roomType" && !data.roomType) return "Choose a room type.";
    if (field === "monthlyRent") {
      const amount = Number(data.monthlyRent);
      if (!data.monthlyRent || !Number.isInteger(amount) || amount <= 0 || amount > 1_000_000) return "Enter a whole amount from ₱1 to ₱1,000,000.";
    }
    if (field === "description" && data.description.length > 500) return "Use 500 characters or fewer.";
    return "";
  }

  function validateBasics() {
    const next = { propertyId: validateField("propertyId"), name: validateField("name"), roomType: validateField("roomType"), monthlyRent: validateField("monthlyRent") };
    setErrors((current) => ({ ...current, ...next }));
    const first = Object.entries(next).find(([, error]) => error)?.[0];
    if (first === "propertyId") document.getElementById("room-property")?.focus();
    if (first === "name") nameRef.current?.focus();
    if (first === "roomType") document.getElementById("room-type")?.focus();
    if (first === "monthlyRent") rentRef.current?.focus();
    return !first;
  }

  const missingPublish = [
    photos.length ? "" : "a photo",
    values.description.trim() ? "" : "a description",
    values.availableNow || values.availableFrom ? "" : "an availability date",
    values.depositMonths !== "" && values.advanceMonths !== "" ? "" : "deposit and advance",
    Number(values.capacity) >= 1 && Number(values.capacity) <= 20 ? "" : "capacity",
  ].filter(Boolean);
  const publishReasons = [...missingPublish.map((item) => `To publish, add: ${item}.`), ...(!approved ? ["Available after your account is verified."] : [])];

  function selectPhotos(event: ChangeEvent<HTMLInputElement>) {
    setPhotoError("");
    const selected = Array.from(event.target.files ?? []);
    const remaining = 8 - photos.length;
    const accepted: RoomPhoto[] = [];
    for (const file of selected) {
      if (!imageTypes.includes(file.type)) { setPhotoError("Choose JPG or PNG files only."); continue; }
      if (file.size > maxPhotoSize) { setPhotoError("Each photo must be 5 MB or smaller."); continue; }
      if (accepted.length >= remaining) { setPhotoError("You can add up to 8 photos."); break; }
      const url = URL.createObjectURL(file);
      ownedUrls.current.add(url);
      accepted.push({ id: crypto.randomUUID(), url, name: file.name, isCover: false });
    }
    setPhotos((current) => {
      const next = [...current, ...accepted];
      if (!next.some((photo) => photo.isCover) && next[0]) next[0] = { ...next[0], isCover: true };
      return next;
    });
    event.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);
      if (removed && ownedUrls.current.delete(removed.url)) URL.revokeObjectURL(removed.url);
      const next = current.filter((photo) => photo.id !== id);
      if (removed?.isCover && next[0]) next[0] = { ...next[0], isCover: true };
      return next;
    });
  }

  function movePhoto(index: number, offset: number) {
    setPhotos((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function save(publish: boolean) {
    setTriedSubmit(true);
    if (!validateBasics()) return;
    if (publish && (missingPublish.length > 0 || !approved)) return;
    if (publish && (!values.capacity || Number(values.capacity) < 1 || Number(values.capacity) > 20)) {
      setErrors((current) => ({ ...current, capacity: "Enter a capacity from 1 to 20." }));
      return;
    }
    const now = new Date().toISOString();
    const property = dashboardProperties.find((item) => item.id === values.propertyId);
    if (!property || !values.roomType) return;
    // TODO: PHP backend must re-validate all fields, confirm property ownership, enforce unique names and publish rules, check approval, and validate photo types and sizes.
    const room: DashboardRoom = {
      ...(initialRoom ?? {} as DashboardRoom),
      id: initialRoom?.id ?? `room-${crypto.randomUUID()}`,
      propertyId: property.id, property: property.name, name: values.name.trim(), roomType: values.roomType,
      monthlyRent: Number(values.monthlyRent), photos,
      description: values.description.trim(), availableFrom: values.availableNow ? "now" : values.availableFrom,
      depositMonths: values.depositMonths === "" ? null : Number(values.depositMonths), advanceMonths: values.advanceMonths === "" ? null : Number(values.advanceMonths), capacity: values.capacity === "" ? null : Number(values.capacity),
      bathroom: values.bathroom || undefined, furnishing: values.furnishing || undefined,
      floorAreaSqm: values.floorAreaSqm ? Number(values.floorAreaSqm) : undefined, rules: values.rules.trim() || undefined,
      contactPhone: values.contactPhone.trim() || undefined,
      status: roomId ? initialRoom?.status ?? "vacant" : "vacant", listingStatus: publish ? "published" : roomId && initialRoom?.listingStatus === "published" ? "published" : "draft",
      createdAt: roomId ? initialRoom?.createdAt ?? now : now, updatedAt: now, tone: initialRoom?.tone ?? "sand",
    };
    saveRoom(room);
    router.push("/dashboard/rooms?saved=1");
  }

  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); save(false); }
  function cancel() {
    if (!dirty || window.confirm("Discard your unsaved room changes?")) router.push("/dashboard/rooms");
  }

  const roomTypeOptions = options(Object.entries(roomTypeLabels).map(([id, label]) => ({ id: id as RoomType, label })));
  const propertyOptions = dashboardProperties.map((property) => ({ id: property.id, label: property.name }));
  const bathroomOptions = [{ id: "private", label: "Private" }, { id: "shared", label: "Shared" }];
  const furnishingOptions = [{ id: "unfurnished", label: "Unfurnished" }, { id: "semi", label: "Semi-furnished" }, { id: "furnished", label: "Furnished" }];
  const monthOptions = [0, 1, 2, 3].map((value) => ({ id: String(value), label: String(value) }));

  return (
    <DashboardPage title={editing ? "Edit room" : "Add room"} subtitle="Start with the basics. You can finish the rest later." userStatus={userStatus}>
      <form className="room-form" onSubmit={submit} noValidate>
        <DetailCard icon={<HomeIcon />} title="Basics">
          <p className="room-form-shortcut"><button type="button" className="room-text-link" onClick={() => setNotice("Coming soon.")}>Add many rooms at once</button></p>
          {notice && <p className="room-form-notice" role="status">{notice}</p>}
          {dashboardProperties.length ? <div className="room-form-grid">
            <DetailField label="Property" htmlFor="room-property">
              <Dropdown id="room-property" items={propertyOptions} value={values.propertyId} onChange={(value) => setField("propertyId", value)} placeholder="Choose a property" aria-label="Property" aria-describedby={errors.propertyId ? "error-property" : undefined} />
              {errors.propertyId && <span className="room-field-error" id="error-property" aria-live="polite">{errors.propertyId}</span>}
            </DetailField>
            <DetailField label="Room name or number" htmlFor="room-name">
              <input id="room-name" ref={nameRef} value={values.name} maxLength={80} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "error-name" : undefined} onChange={(event) => setField("name", event.target.value)} />
              {errors.name && <span className="room-field-error" id="error-name" aria-live="polite">{errors.name}</span>}
            </DetailField>
            <DetailField label="Room type" htmlFor="room-type">
              <Dropdown id="room-type" items={roomTypeOptions} value={values.roomType} onChange={(value) => setField("roomType", value as RoomType)} placeholder="Choose a room type" aria-label="Room type" aria-describedby={errors.roomType ? "error-type" : undefined} />
              {errors.roomType && <span className="room-field-error" id="error-type" aria-live="polite">{errors.roomType}</span>}
            </DetailField>
            <DetailField label="Monthly rent" htmlFor="room-rent">
              <div className="room-money-input"><span aria-hidden="true">₱</span><input id="room-rent" ref={rentRef} type="number" min="1" max="1000000" step="1" value={values.monthlyRent} aria-invalid={Boolean(errors.monthlyRent)} aria-describedby={errors.monthlyRent ? "error-rent" : undefined} onChange={(event) => setField("monthlyRent", event.target.value)} /></div>
              {errors.monthlyRent && <span className="room-field-error" id="error-rent" aria-live="polite">{errors.monthlyRent}</span>}
            </DetailField>
          </div> : <p className="room-form-empty">Add a property first. <Link href="/dashboard/settings">Go to properties</Link></p>}
        </DetailCard>

        <DetailCard icon={<ListIcon />} title="Details">
          <div className="room-form-grid">
            <DetailField label="Availability">
              <label className="room-toggle"><input type="checkbox" checked={values.availableNow} onChange={(event) => setField("availableNow", event.target.checked)} />Available now</label>
              {!values.availableNow && <input aria-label="Available from" type="date" value={values.availableFrom} onChange={(event) => setField("availableFrom", event.target.value)} />}
            </DetailField>
            <div className="room-form-pair">
              <DetailField label="Deposit (months)"><Dropdown items={monthOptions} value={values.depositMonths} onChange={(value) => setField("depositMonths", value)} placeholder="Choose" aria-label="Deposit months" aria-describedby={errors.depositMonths ? "error-deposit" : undefined} />{errors.depositMonths && <span className="room-field-error" id="error-deposit" aria-live="polite">{errors.depositMonths}</span>}</DetailField>
              <DetailField label="Advance (months)"><Dropdown items={monthOptions} value={values.advanceMonths} onChange={(value) => setField("advanceMonths", value)} placeholder="Choose" aria-label="Advance months" aria-describedby={errors.advanceMonths ? "error-advance" : undefined} />{errors.advanceMonths && <span className="room-field-error" id="error-advance" aria-live="polite">{errors.advanceMonths}</span>}</DetailField>
            </div>
            <DetailField label="Capacity" htmlFor="room-capacity"><input id="room-capacity" type="number" min="1" max="20" step="1" value={values.capacity} aria-invalid={Boolean(errors.capacity)} aria-describedby={errors.capacity ? "error-capacity" : undefined} onChange={(event) => setField("capacity", event.target.value)} />{errors.capacity && <span className="room-field-error" id="error-capacity" aria-live="polite">{errors.capacity}</span>}</DetailField>
            <DetailField label="Bathroom"><Dropdown items={bathroomOptions} value={values.bathroom} onChange={(value) => setField("bathroom", value as FormValues["bathroom"])} placeholder="Choose" aria-label="Bathroom" /></DetailField>
            <DetailField label="Furnishing"><Dropdown items={furnishingOptions} value={values.furnishing} onChange={(value) => setField("furnishing", value as FormValues["furnishing"])} placeholder="Choose" aria-label="Furnishing" /></DetailField>
            <DetailField label="Floor area (sqm)" htmlFor="room-area"><input id="room-area" type="number" min="1" step="0.1" value={values.floorAreaSqm} onChange={(event) => setField("floorAreaSqm", event.target.value)} /></DetailField>
            <DetailField label="Description" htmlFor="room-description" hint={`${values.description.length}/500`}><textarea id="room-description" maxLength={500} value={values.description} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "error-description" : "room-description-count"} onChange={(event) => setField("description", event.target.value)} />{errors.description && <span className="room-field-error" id="error-description" aria-live="polite">{errors.description}</span>}<span className="room-description-count" id="room-description-count" aria-live="polite">{values.description.length}/500</span></DetailField>
            <DetailField label="Rules" htmlFor="room-rules"><textarea id="room-rules" value={values.rules} onChange={(event) => setField("rules", event.target.value)} /></DetailField>
            <DetailField label="Contact number override" htmlFor="room-phone"><input id="room-phone" type="tel" value={values.contactPhone} onChange={(event) => setField("contactPhone", event.target.value)} /></DetailField>
          </div>
        </DetailCard>

        <DetailCard icon={<PhotoIcon />} title="Photos">
          <input ref={photoInputRef} className="room-photo-input" type="file" accept="image/jpeg,image/png" multiple aria-label="Upload room photos" onChange={selectPhotos} />
          <button className="room-upload-area" type="button" onClick={() => photoInputRef.current?.click()}>
            <PlusIcon /><span>Choose JPG or PNG photos</span><small>Up to 5 MB each · 8 photos maximum</small>
          </button>
          {photoError && <p className="room-field-error" role="status" aria-live="polite">{photoError}</p>}
          <div className="room-photo-grid">{photos.map((photo, index) => <figure className="room-photo-item" key={photo.id}>
            {photo.url ? <Image src={photo.url} alt={photo.name || `Room photo ${index + 1}`} width={240} height={180} unoptimized /> : <div className="room-photo-placeholder">Photo</div>}
            {photo.isCover && <span className="room-cover-label"><CheckIcon />Cover</span>}
            <figcaption>{photo.name || `Photo ${index + 1}`}</figcaption>
            <div className="room-photo-actions">
              {!photo.isCover && <button type="button" onClick={() => setPhotos((current) => current.map((item) => ({ ...item, isCover: item.id === photo.id })))}>Set cover</button>}
              <button type="button" aria-label={`Move ${photo.name} left`} disabled={index === 0} onClick={() => movePhoto(index, -1)}>Move left</button>
              <button type="button" aria-label={`Move ${photo.name} right`} disabled={index === photos.length - 1} onClick={() => movePhoto(index, 1)}>Move right</button>
              <button type="button" aria-label={`Remove ${photo.name}`} onClick={() => removePhoto(photo.id)}>Remove</button>
            </div>
          </figure>)}</div>
        </DetailCard>
        <div className="room-form-action-spacer" />
        <div className="room-form-action-bar">
          <div className="room-form-actions">
            <button className="button button-ghost" type="button" onClick={cancel}>Cancel</button>
            <button className="button button-outline" type="submit">Save as draft</button>
            <button className="button button-dark" type="button" disabled={publishReasons.length > 0} onClick={() => save(true)}>Save and publish</button>
          </div>
          {publishReasons.length > 0 && <ul className="room-publish-reasons" aria-live="polite">{publishReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>}
          {triedSubmit && Object.values(errors).some(Boolean) && <p className="room-field-error" role="status" aria-live="polite">Fix the highlighted fields before saving.</p>}
        </div>
      </form>
    </DashboardPage>
  );
}
