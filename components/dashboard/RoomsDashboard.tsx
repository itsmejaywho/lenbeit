"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardFilterOptions, dashboardUiCopy, type DashboardRoom, type RoomStatus } from "../../lib/dashboard-placeholder";
import { bathroomLabels, furnishingLabels, listingStatusLabels, roomStatusLabels, roomTypeLabels } from "../../lib/room-labels";
import { useDashboardUser } from "./DashboardContext";
import { RoomFormScreen } from "./RoomFormScreen";
import { Placeholder } from "../Placeholder";
import { Dropdown, type DropdownItem } from "../ui/Dropdown";
import { DetailField } from "../ui/DetailField";
import { StatusChip } from "../ui/StatusChip";
import { ArchiveIcon, BoxIcon, ChatIcon, CheckIcon, ChevronIcon, ChevronRightIcon, ClockIcon, DuplicateIcon, EditIcon, EyeIcon, ExpandIcon, FilterIcon, MoreIcon, PeopleIcon, PlusIcon, PublishIcon, SearchIcon, TagIcon, UnpublishIcon } from "../ui/icons";

type RoomTab = typeof dashboardFilterOptions.tabs[number];
type FilterState = { statuses: RoomStatus[]; types: string[]; properties: string[]; search: string };

const initialFilters: FilterState = { statuses: [], types: [], properties: [], search: "" };
const statIcons = { chat: ChatIcon, eye: EyeIcon, clock: ClockIcon };
const ROOM_CARD_IMAGE_RATIO = "16 / 10";

function FilterGroup({ title, children, initiallyOpen = true }: { title: string; children: ReactNode; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  return <section className="dashboard-filter-group"><button className="dashboard-filter-heading" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}><span>{title}</span><ChevronIcon open={open} /></button>{open && <div className="dashboard-filter-options">{children}</div>}</section>;
}

function FilterCheckbox({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: (checked: boolean) => void; count?: number }) {
  return <label className="dashboard-filter-option"><span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</span>{count !== undefined && <span className="dashboard-filter-count">{count}</span>}</label>;
}

function RoomFilters({ filters, setFilters, onClear, onClose, isOpen }: { filters: FilterState; setFilters: (next: FilterState) => void; onClear: () => void; onClose: () => void; isOpen: boolean }) {
  const setList = (key: "statuses" | "types" | "properties", value: string, checked: boolean) => {
    const current = filters[key] as string[];
    setFilters({ ...filters, [key]: checked ? [...current, value] : current.filter((item) => item !== value) });
  };
  const labelId = "dashboard-filter-title";
  return <>
    {isOpen && <button className="dashboard-drawer-scrim dashboard-filter-scrim" type="button" aria-label="Close filters" onClick={onClose} />}
    <aside className={`dashboard-filter-panel${isOpen ? " is-open" : ""}`} aria-labelledby={labelId} aria-modal={isOpen ? true : undefined} role={isOpen ? "dialog" : "complementary"}>
      <div className="dashboard-filter-panel-title"><h2 id={labelId}>{dashboardUiCopy.filterPanel}</h2><button className="dashboard-icon-button dashboard-filter-close" type="button" aria-label="Close filters" onClick={onClose}>×</button></div>
      <FilterGroup title={dashboardUiCopy.statusGroups}>{dashboardFilterOptions.statuses.map((status) => <FilterCheckbox key={status} label={roomStatusLabels[status]} checked={filters.statuses.includes(status)} onChange={(checked) => setList("statuses", status, checked)} />)}</FilterGroup>
      <FilterGroup title={dashboardUiCopy.typeGroup}>{dashboardFilterOptions.types.map((type) => <FilterCheckbox key={type} label={roomTypeLabels[type]} count={dashboardUiCopy.typeCounts[type]} checked={filters.types.includes(type)} onChange={(checked) => setList("types", type, checked)} />)}</FilterGroup>
      <FilterGroup title={dashboardUiCopy.propertyGroup}>{dashboardFilterOptions.properties.map((property) => <FilterCheckbox key={property} label={property} checked={filters.properties.includes(property)} onChange={(checked) => setList("properties", property, checked)} />)}</FilterGroup>
      <button className="dashboard-clear-filters" type="button" onClick={onClear}>{dashboardUiCopy.clearFilters}</button>
    </aside>
  </>;
}

function roomPublishReason(room: DashboardRoom, approved: boolean) {
  if (!approved) return "Available after your account is verified.";
  if (!room.photos.length) return "Add a photo to publish.";
  if (!room.description.trim()) return "Add a description to publish.";
  if (!room.availableFrom) return "Add an availability date to publish.";
  if (room.depositMonths === null || room.advanceMonths === null) return "Set deposit and advance to publish.";
  if (room.capacity === null) return "Set capacity to publish.";
  return "";
}

function RoomCard({ room, selected, onSelect, onStatus, onListing, onArchive, onEdit, onDuplicate, approved }: {
  room: DashboardRoom; selected: boolean; onSelect: (room: DashboardRoom) => void;
  onStatus: (room: DashboardRoom) => void; onListing: (room: DashboardRoom) => void; onArchive: (room: DashboardRoom) => void;
  onEdit: (room: DashboardRoom) => void; onDuplicate: (room: DashboardRoom) => void; approved: boolean;
}) {
  const statusLabel = roomStatusLabels[room.status];
  const statusItems: DropdownItem[] = [
    { id: "edit", label: "Edit room", icon: <EditIcon />, onSelect: () => onEdit(room) },
    { id: "publish", label: room.listingStatus === "published" ? "Unpublish" : "Publish", icon: room.listingStatus === "published" ? <UnpublishIcon /> : <PublishIcon />, onSelect: () => onListing(room) },
    { id: "status", label: room.status === "vacant" ? "Mark as occupied" : "Mark as vacant", icon: room.status === "vacant" ? <PeopleIcon /> : <CheckIcon />, onSelect: () => onStatus(room) },
    { id: "duplicate", label: "Duplicate", icon: <DuplicateIcon />, onSelect: () => onDuplicate(room) },
    { id: "archive", label: "Archive", icon: <ArchiveIcon />, variant: "danger", dividerBefore: true, onSelect: () => onArchive(room) },
  ];
  const publishReason = roomPublishReason(room, approved);
  return <article className={`dashboard-room-card${selected ? " is-selected" : ""}`}>
    <button className="dashboard-room-card-main" type="button" aria-label={`${room.name}, ${statusLabel}, ₱${room.monthlyRent.toLocaleString()} per month. ${dashboardUiCopy.viewDetails}`} aria-pressed={selected} onClick={() => onSelect(room)}>
      <div className={`dashboard-room-visual dashboard-room-visual-${room.tone}`}><Placeholder tone={room.tone} ratio={ROOM_CARD_IMAGE_RATIO} /><span className="dashboard-room-visual-caption">{room.property}</span></div>
      <span className="dashboard-room-info"><span className="dashboard-room-name">{room.name}</span><span className="dashboard-room-type-line">{roomTypeLabels[room.roomType]} · up to {room.capacity ?? "Not set"} persons</span><span className="dashboard-room-meta"><span>₱{room.monthlyRent.toLocaleString()} / month</span><StatusChip status={room.status} label={statusLabel} /></span></span>
    </button>
    <div className="dashboard-room-visual-topline"><span className="dashboard-room-badge">{listingStatusLabels[room.listingStatus]}</span><Dropdown className="dashboard-room-menu" items={statusItems} trigger={<MoreIcon />} aria-label={`Actions for ${room.name}`} variant="icon" align="right" />{room.listingStatus !== "published" && publishReason && <span className="sr-only">{publishReason}</span>}</div>
  </article>;
}

function DetailValue({ value }: { value?: string | number | null }) {
  return <span className={value === undefined || value === null || value === "" ? "room-detail-not-set" : ""}>{value === undefined || value === null || value === "" ? "Not set" : value}</span>;
}

function RoomDetail({ room, open, onClose, onExpand, expanded, onListing, approved }: {
  room: DashboardRoom; open: boolean; onClose: () => void; onExpand: () => void; expanded: boolean; onListing: (room: DashboardRoom) => void; approved: boolean;
}) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const groups = [dashboardUiCopy.description, dashboardUiCopy.photos, dashboardUiCopy.listing];
  const publishReason = roomPublishReason(room, approved);
  const checks = [
    { label: "At least 1 photo", done: room.photos.length > 0 },
    { label: "Description", done: Boolean(room.description.trim()) },
    { label: "Availability date", done: Boolean(room.availableFrom) },
    { label: "Deposit and advance set", done: room.depositMonths !== null && room.advanceMonths !== null },
  ];
  return <>
    <button className={`dashboard-drawer-scrim dashboard-detail-scrim${open || expanded ? " is-open" : ""}`} type="button" aria-label={dashboardUiCopy.closeDetails} onClick={onClose} />
    <aside className={`dashboard-room-detail${open ? " is-open" : ""}${expanded ? " is-expanded" : ""}`} aria-label={dashboardUiCopy.roomDetail} role={open ? "dialog" : "complementary"} aria-modal={open ? true : undefined}>
      <div className="dashboard-detail-heading"><h2>{dashboardUiCopy.roomDetail}</h2><div><button className="dashboard-icon-button dashboard-expand-detail" type="button" aria-label={dashboardUiCopy.expandDetails} aria-expanded={expanded} onClick={onExpand}><ExpandIcon /></button><button className="dashboard-icon-button dashboard-detail-close" type="button" aria-label={dashboardUiCopy.closeDetails} onClick={onClose}>×</button></div></div>
      <div className="dashboard-detail-content">
        <div className={`dashboard-detail-visual dashboard-room-visual-${room.tone}`}><Placeholder tone={room.tone} ratio="4 / 3" /><div className="dashboard-detail-visual-caption"><strong>{room.name}</strong><StatusChip status={room.status} label={roomStatusLabels[room.status]} /></div></div>
        <div className="dashboard-detail-stats">{dashboardUiCopy.stats.map((stat) => { const Icon = statIcons[stat.icon]; return <div className="dashboard-stat" key={stat.id}><span className="dashboard-stat-icon"><Icon /></span><strong>{stat.value}</strong><span>{stat.label}</span></div>; })}</div>
        <div className="dashboard-detail-rows">{groups.map((group) => {
          const isOpen = openRow === group.title;
          return <section className="dashboard-detail-row" key={group.title}>
            <button type="button" aria-expanded={isOpen} onClick={() => setOpenRow(isOpen ? null : group.title)}><span className="dashboard-detail-row-icon">{group.title === dashboardUiCopy.description.title ? <BoxIcon /> : group.title === dashboardUiCopy.photos.title ? <EyeIcon /> : <TagIcon />}</span><span className="dashboard-detail-row-copy"><strong>{group.title}</strong><small>{group.subtitle}</small></span><ChevronRightIcon className={isOpen ? "is-open" : ""} /></button>
            {isOpen && <div className="dashboard-detail-row-content">
              {group.title === dashboardUiCopy.description.title && <>
                <div className="room-detail-section-heading"><strong>Description</strong><Link className="button button-ghost room-detail-edit" href={`/dashboard/rooms/${room.id}/edit`}>Edit</Link></div>
                <p className={room.description ? "room-detail-description" : "room-detail-not-set"}>{room.description || "Not set"}</p>
                <div className="room-detail-fields">
                  <DetailField label="Room type" value={<DetailValue value={roomTypeLabels[room.roomType]} />} />
                  <DetailField label="Monthly rent" value={`₱${room.monthlyRent.toLocaleString()} / month`} />
                  <DetailField label="Deposit and advance" value={<DetailValue value={room.depositMonths === null || room.advanceMonths === null ? null : `${room.depositMonths} month${room.depositMonths === 1 ? "" : "s"} deposit, ${room.advanceMonths} month${room.advanceMonths === 1 ? "" : "s"} advance`} />} />
                  <DetailField label="Capacity" value={<DetailValue value={room.capacity === null ? null : `Up to ${room.capacity} persons`} />} />
                  <DetailField label="Available from" value={<DetailValue value={room.availableFrom === "now" ? "Now" : room.availableFrom} />} />
                  <DetailField label="Bathroom" value={<DetailValue value={room.bathroom ? bathroomLabels[room.bathroom] : null} />} />
                  <DetailField label="Furnishing" value={<DetailValue value={room.furnishing ? furnishingLabels[room.furnishing] : null} />} />
                  <DetailField label="Floor area" value={<DetailValue value={room.floorAreaSqm ? `${room.floorAreaSqm} sqm` : null} />} />
                  <DetailField label="Rules" value={<DetailValue value={room.rules} />} />
                </div>
              </>}
              {group.title === dashboardUiCopy.photos.title && <p>{room.photos.length ? `${room.photos.length} photo${room.photos.length === 1 ? "" : "s"}` : "No photos yet"}</p>}
              {group.title === dashboardUiCopy.listing.title && <>
                <ul className="room-listing-checklist">{checks.map((item) => <li key={item.label}><span aria-hidden="true">{item.done ? "✓" : "○"}</span>{item.label}<span className="sr-only">{item.done ? "Complete" : "Missing"}</span></li>)}</ul>
                {room.capacity === null && <p className="room-publish-reason">Set capacity to publish.</p>}
                <button className="button button-dark" type="button" disabled={room.listingStatus !== "published" && Boolean(publishReason)} title={room.listingStatus !== "published" ? publishReason : undefined} onClick={() => onListing(room)}>{room.listingStatus === "published" ? "Unpublish" : "Publish"}</button>
                {publishReason && room.listingStatus !== "published" && <p className="room-publish-reason">{publishReason}</p>}
              </>}
            </div>}
          </section>;
        })}</div>
      </div>
    </aside>
  </>;
}

export function RoomsDashboard({ showSavedNotice = false }: { showSavedNotice?: boolean }) {
  const router = useRouter();
  const { rooms, updateRoom, userStatus } = useDashboardUser();
  const approved = userStatus.emailVerified && userStatus.verificationStatus === "approved";
  const [tab, setTab] = useState<RoomTab>("All");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(rooms[0]?.id ?? null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [roomSaved, setRoomSaved] = useState(false);
  const [page, setPage] = useState(1);
  const addRoomButtonRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const selectedCardRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedRoom = rooms.find((room) => room.id === selectedId) ?? rooms[0];

  const filteredRooms = useMemo(() => rooms.filter((room) => {
    const tabMatch = tab === "All" || (tab === "Unavailable" ? room.status === "maintenance" : roomStatusLabels[room.status] === tab);
    const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(room.status);
    const typeMatch = filters.types.length === 0 || filters.types.includes(room.roomType);
    const propertyMatch = filters.properties.length === 0 || filters.properties.includes(room.property);
    const query = filters.search.trim().toLowerCase();
    const searchMatch = !query || `${room.name} ${room.property}`.toLowerCase().includes(query);
    return room.listingStatus !== "archived" && tabMatch && statusMatch && typeMatch && propertyMatch && searchMatch;
  }), [filters, rooms, tab]);
  const pageCount = Math.max(1, Math.ceil(filteredRooms.length / 6));
  const currentPage = Math.min(page, pageCount);
  const visibleRooms = filteredRooms.slice((currentPage - 1) * 6, currentPage * 6);
  const showingStart = filteredRooms.length ? (currentPage - 1) * 6 + 1 : 0;
  const showingEnd = Math.min(currentPage * 6, filteredRooms.length);

  const closeFilter = () => { setFilterOpen(false); requestAnimationFrame(() => filterButtonRef.current?.focus()); };
  const closeDetail = () => { setDetailOpen(false); setDetailExpanded(false); requestAnimationFrame(() => selectedCardRef.current?.focus()); };
  function finishAddingRoom(saved: boolean) {
    setAddRoomOpen(false);
    setRoomSaved(saved);
    addRoomButtonRef.current?.focus({ preventScroll: true });
  }
  function chooseRoom(room: DashboardRoom) { setSelectedId(room.id); selectedCardRef.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null; if (window.matchMedia("(max-width: 1279px)").matches) setDetailOpen(true); }
  function toggleListing(room: DashboardRoom) {
    if (room.listingStatus === "published") { updateRoom(room.id, { listingStatus: "draft", updatedAt: new Date().toISOString() }); return; }
    const reason = roomPublishReason(room, approved);
    if (reason) { window.alert(reason); return; }
    updateRoom(room.id, { listingStatus: "published", updatedAt: new Date().toISOString() });
  }
  function markOccupied(room: DashboardRoom) { updateRoom(room.id, { status: room.status === "vacant" ? "occupied" : "vacant", updatedAt: new Date().toISOString() }); }
  function archiveRoom(room: DashboardRoom) { if (window.confirm(`Archive ${room.name}?`)) updateRoom(room.id, { listingStatus: "archived", updatedAt: new Date().toISOString() }); }
  function editRoom(room: DashboardRoom) { router.push(`/dashboard/rooms/${room.id}/edit`); }
  function duplicateRoom(room: DashboardRoom) { router.push(`/dashboard/rooms/new?duplicate=${room.id}`); }
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    if (addRoomOpen || (!filterOpen && !detailOpen && !detailExpanded)) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") { if (detailOpen || detailExpanded) closeDetail(); else closeFilter(); } };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [addRoomOpen, detailExpanded, detailOpen, filterOpen]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = dashboardFilterOptions.tabs.indexOf(tab);
    const nextIndex = (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + dashboardFilterOptions.tabs.length) % dashboardFilterOptions.tabs.length;
    setTab(dashboardFilterOptions.tabs[nextIndex]);
    document.getElementById(`dashboard-tab-${nextIndex}`)?.focus();
  }
  const clearFilters = () => setFilters(initialFilters);
  const filterPanel = <RoomFilters filters={filters} setFilters={setFilters} onClear={clearFilters} onClose={closeFilter} isOpen={filterOpen} />;

  return <div className="dashboard-rooms-layout">
    {filterPanel}
    <section className="dashboard-rooms-column" aria-label={dashboardUiCopy.allRooms}>
      <div className="dashboard-rooms-toolbar">
        <div className="dashboard-tabs" role="tablist" aria-label={dashboardUiCopy.allRooms}>{dashboardFilterOptions.tabs.map((label, index) => <button id={`dashboard-tab-${index}`} key={label} type="button" role="tab" aria-selected={tab === label} tabIndex={tab === label ? 0 : -1} className={tab === label ? "is-active" : ""} onClick={() => setTab(label)} onKeyDown={handleTabKeyDown}>{label}</button>)}</div>
        <div className="dashboard-room-actions"><button className="dashboard-icon-button" type="button" aria-label={dashboardUiCopy.searchRooms} aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)}><SearchIcon /></button><button ref={filterButtonRef} className="dashboard-icon-button dashboard-filter-trigger" type="button" aria-label={dashboardUiCopy.filters} aria-expanded={filterOpen} onClick={() => setFilterOpen(true)}><FilterIcon /></button><button ref={addRoomButtonRef} className="button button-dark dashboard-add-room" type="button" aria-haspopup="dialog" onClick={() => { setRoomSaved(false); setAddRoomOpen(true); }}><PlusIcon />{dashboardUiCopy.addRoom}</button></div>
      </div>
      {(roomSaved || showSavedNotice) && <p key={roomSaved ? "modal" : "page"} className="room-form-notice" role="status">Room saved locally.</p>}
      {searchOpen && <div className="dashboard-search-row"><SearchIcon /><input ref={searchRef} type="search" aria-label={dashboardUiCopy.searchLabel} placeholder={dashboardUiCopy.searchRooms} value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /><button type="button" aria-label="Close room search" onClick={() => { setSearchOpen(false); setFilters({ ...filters, search: "" }); }}>×</button></div>}
      {visibleRooms.length ? <div className="dashboard-room-grid">{visibleRooms.map((room) => <RoomCard key={room.id} room={room} selected={room.id === selectedRoom?.id} onSelect={chooseRoom} onStatus={markOccupied} onListing={toggleListing} onArchive={archiveRoom} onEdit={editRoom} onDuplicate={duplicateRoom} approved={approved} />)}</div> : <p className="dashboard-no-rooms">{dashboardUiCopy.noRooms}</p>}
      <div className="dashboard-pagination"><span>{dashboardUiCopy.showResults} {showingStart} - {showingEnd} {dashboardUiCopy.ofRooms}</span><div className="dashboard-pagination-buttons" aria-label="Room pages"><button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>{dashboardUiCopy.previous}</button>{Array.from({ length: Math.min(pageCount, 3) }, (_, index) => index + 1).map((number) => <button key={number} type="button" aria-current={currentPage === number ? "page" : undefined} className={currentPage === number ? "is-current" : ""} onClick={() => setPage(number)}>{number}</button>)}<button type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>{dashboardUiCopy.next}</button></div></div>
    </section>
    {selectedRoom && <RoomDetail room={selectedRoom} open={detailOpen} onClose={closeDetail} expanded={detailExpanded} onExpand={() => setDetailExpanded((value) => !value)} onListing={toggleListing} approved={approved} />}
    {addRoomOpen && <RoomFormScreen onFinish={finishAddingRoom} />}
  </div>;
}
