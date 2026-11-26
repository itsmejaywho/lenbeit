"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { dashboardFilterOptions, dashboardRooms, dashboardUiCopy, type DashboardRoom, type RoomStatus } from "../../lib/dashboard-placeholder";
import { Placeholder } from "../Placeholder";
import { Dropdown } from "../ui/Dropdown";
import { BoxIcon, ChatIcon, ChevronIcon, ChevronRightIcon, ClockIcon, EyeIcon, ExpandIcon, FilterIcon, MoreIcon, PlusIcon, SearchIcon, TagIcon, WaterIcon } from "../ui/icons";

type RoomTab = typeof dashboardFilterOptions.tabs[number];
type FilterState = { statuses: RoomStatus[]; types: string[]; properties: string[]; inclusions: string[]; from: string; to: string; search: string };

const initialFilters: FilterState = { statuses: [], types: [], properties: [], inclusions: [], from: "", to: "", search: "" };
const statIcons = { chat: ChatIcon, eye: EyeIcon, clock: ClockIcon };

function FilterGroup({ title, children, initiallyOpen = true }: { title: string; children: ReactNode; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  return (
    <section className="dashboard-filter-group">
      <button className="dashboard-filter-heading" type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span>{title}</span><ChevronIcon open={open} />
      </button>
      {open && <div className="dashboard-filter-options">{children}</div>}
    </section>
  );
}

function FilterCheckbox({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: (checked: boolean) => void; count?: number }) {
  return (
    <label className="dashboard-filter-option">
      <span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</span>
      {count !== undefined && <span className="dashboard-filter-count">{count}</span>}
    </label>
  );
}

function RoomFilters({ filters, setFilters, onClear, onClose, isOpen }: {
  filters: FilterState;
  setFilters: (next: FilterState) => void;
  onClear: () => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const setList = (key: "statuses" | "types" | "properties" | "inclusions", value: string, checked: boolean) => {
    const current = filters[key] as string[];
    const updated = checked ? [...current, value] : current.filter((item) => item !== value);
    setFilters({ ...filters, [key]: updated });
  };
  const labelId = "dashboard-filter-title";

  return (
    <>
      {isOpen && <button className="dashboard-drawer-scrim dashboard-filter-scrim" type="button" aria-label="Close filters" onClick={onClose} />}
      <aside className={`dashboard-filter-panel${isOpen ? " is-open" : ""}`} aria-labelledby={labelId} aria-modal={isOpen ? true : undefined} role={isOpen ? "dialog" : "complementary"}>
        <div className="dashboard-filter-panel-title">
          <h2 id={labelId}>{dashboardUiCopy.filterPanel}</h2>
          <button className="dashboard-icon-button dashboard-filter-close" type="button" aria-label="Close filters" onClick={onClose}>×</button>
        </div>
        <FilterGroup title={dashboardUiCopy.statusGroups}>
          {dashboardFilterOptions.statuses.map((status) => <FilterCheckbox key={status} label={status} checked={filters.statuses.includes(status)} onChange={(checked) => setList("statuses", status, checked)} />)}
        </FilterGroup>
        <FilterGroup title={dashboardUiCopy.typeGroup}>
          {dashboardFilterOptions.types.map((type) => <FilterCheckbox key={type} label={type} count={dashboardUiCopy.typeCounts[type]} checked={filters.types.includes(type)} onChange={(checked) => setList("types", type, checked)} />)}
        </FilterGroup>
        <FilterGroup title={dashboardUiCopy.propertyGroup}>
          {dashboardFilterOptions.properties.map((property) => <FilterCheckbox key={property} label={property} checked={filters.properties.includes(property)} onChange={(checked) => setList("properties", property, checked)} />)}
        </FilterGroup>
        <FilterGroup title={dashboardUiCopy.priceGroup} initiallyOpen={false}>
          <div className="dashboard-price-inputs">
            <label>{dashboardUiCopy.priceFrom}<input type="number" min="0" value={filters.from} aria-label={dashboardUiCopy.minimumPrice} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label>
            <label>{dashboardUiCopy.priceTo}<input type="number" min="0" value={filters.to} aria-label={dashboardUiCopy.maximumPrice} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label>
          </div>
          <label className="dashboard-range-label" htmlFor="dashboard-max-price">{dashboardUiCopy.maxPrice}</label>
          <input id="dashboard-max-price" className="dashboard-range" type="range" min="0" max="15000" step="500" value={filters.to || 15000} onChange={(event) => setFilters({ ...filters, to: event.target.value })} />
        </FilterGroup>
        <FilterGroup title={dashboardUiCopy.inclusionsGroup} initiallyOpen={false}>
          {dashboardFilterOptions.inclusions.map((inclusion) => <FilterCheckbox key={inclusion} label={inclusion} checked={filters.inclusions.includes(inclusion)} onChange={(checked) => setList("inclusions", inclusion, checked)} />)}
        </FilterGroup>
        <button className="dashboard-clear-filters" type="button" onClick={onClear}>{dashboardUiCopy.clearFilters}</button>
      </aside>
    </>
  );
}

function RoomCard({ room, selected, onSelect }: { room: DashboardRoom; selected: boolean; onSelect: (room: DashboardRoom) => void }) {
  const statusClass = room.status === "Vacant" ? "vacant" : room.status === "Occupied" ? "occupied" : "maintenance";
  const statusLabel = room.status === "Under maintenance" ? "Maintenance" : room.status;
  const moreItems = [
    { id: "edit", label: "Edit room" },
    { id: "duplicate", label: "Duplicate" },
    { id: "archive", label: "Archive", variant: "danger" as const, dividerBefore: true },
  ];
  return (
    <article className={`dashboard-room-card${selected ? " is-selected" : ""}`}>
      <button className="dashboard-room-card-main" type="button" aria-label={`${room.name}, ${room.status}, ₱${room.price.toLocaleString()} per month. ${dashboardUiCopy.viewDetails}`} aria-pressed={selected} onClick={() => onSelect(room)}>
        <div className={`dashboard-room-visual dashboard-room-visual-${room.tone}`}>
          <Placeholder tone={room.tone} ratio="1.55" />
          <span className="dashboard-room-badge">{room.listed ? dashboardUiCopy.listed : dashboardUiCopy.draft}</span>
          <span className="dashboard-room-visual-caption">{room.property}</span>
        </div>
        <span className="dashboard-room-info">
          <span className="dashboard-room-name">{room.name}</span>
          <span className="dashboard-room-meta"><span>₱{room.price.toLocaleString()} / month</span><span className={`dashboard-status-pill is-${statusClass}`}>{statusLabel} (1)</span></span>
        </span>
      </button>
      <Dropdown className="dashboard-room-menu" items={moreItems} trigger={<MoreIcon />} aria-label={`More options for ${room.name}`} variant="inline" />
    </article>
  );
}

function RoomDetail({ room, open, onClose, onExpand, expanded }: { room: DashboardRoom; open: boolean; onClose: () => void; onExpand: () => void; expanded: boolean }) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const groups = [dashboardUiCopy.description, dashboardUiCopy.inclusionDetails, dashboardUiCopy.photos, dashboardUiCopy.listing];
  const statusClass = room.status === "Vacant" ? "vacant" : room.status === "Occupied" ? "occupied" : "maintenance";
  return (
    <>
      <button className={`dashboard-drawer-scrim dashboard-detail-scrim${open || expanded ? " is-open" : ""}`} type="button" aria-label={dashboardUiCopy.closeDetails} onClick={onClose} />
      <aside className={`dashboard-room-detail${open ? " is-open" : ""}${expanded ? " is-expanded" : ""}`} aria-label={dashboardUiCopy.roomDetail} role={open ? "dialog" : "complementary"} aria-modal={open ? true : undefined}>
        <div className="dashboard-detail-heading">
          <h2>{dashboardUiCopy.roomDetail}</h2>
          <div>
            <button className="dashboard-icon-button dashboard-expand-detail" type="button" aria-label={dashboardUiCopy.expandDetails} aria-expanded={expanded} onClick={onExpand}><ExpandIcon /></button>
            <button className="dashboard-icon-button dashboard-detail-close" type="button" aria-label={dashboardUiCopy.closeDetails} onClick={onClose}>×</button>
          </div>
        </div>
        <div className="dashboard-detail-content">
          <div className={`dashboard-detail-visual dashboard-room-visual-${room.tone}`}>
            <Placeholder tone={room.tone} ratio="1.4" />
            <div className="dashboard-detail-visual-caption"><strong>{room.name}</strong><span className={`dashboard-status-pill is-${statusClass}`}>{room.status}</span></div>
          </div>
          <div className="dashboard-detail-stats">
            {dashboardUiCopy.stats.map((stat) => {
              const Icon = stat.icon === "chat" ? statIcons.chat : stat.icon === "eye" ? statIcons.eye : statIcons.clock;
              return <div className="dashboard-stat" key={stat.id}><span className="dashboard-stat-icon"><Icon /></span><strong>{stat.value}</strong><span>{stat.label}</span></div>;
            })}
          </div>
          <div className="dashboard-detail-rows">
            {groups.map((group) => {
              const isOpen = openRow === group.title;
              return (
                <section className="dashboard-detail-row" key={group.title}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenRow(isOpen ? null : group.title)}>
                    <span className="dashboard-detail-row-icon">{group.title === dashboardUiCopy.description.title ? <BoxIcon /> : group.title === dashboardUiCopy.inclusionDetails.title ? <WaterIcon /> : group.title === dashboardUiCopy.photos.title ? <EyeIcon /> : <TagIcon />}</span>
                    <span className="dashboard-detail-row-copy"><strong>{group.title}</strong><small>{group.subtitle}</small></span>
                    <ChevronRightIcon className={isOpen ? "is-open" : ""} />
                  </button>
                  {isOpen && <div className="dashboard-detail-row-content">{group.title === dashboardUiCopy.inclusionDetails.title ? room.inclusions.join(" · ") : group.title === dashboardUiCopy.description.title ? `₱${room.price.toLocaleString()} / month · ${room.property}` : group.title === dashboardUiCopy.listing.title ? (room.listed ? dashboardUiCopy.listed : dashboardUiCopy.draft) : dashboardUiCopy.photos.subtitle}</div>}
                </section>
              );
            })}
          </div>
        </div>
        <div className="dashboard-detail-footer">
          {saved && <span className="dashboard-save-feedback" role="status">{dashboardUiCopy.saveConfirmation}</span>}
          <button className="button button-dark" type="button" onClick={() => setSaved(true)}>{dashboardUiCopy.saveChanges}</button>
        </div>
      </aside>
    </>
  );
}

export function RoomsDashboard() {
  const [tab, setTab] = useState<RoomTab>("All");
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<DashboardRoom>(dashboardRooms[0]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailExpanded, setDetailExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const selectedCardRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredRooms = useMemo(() => dashboardRooms.filter((room) => {
    const tabMatch = tab === "All" || (tab === "Unavailable" ? room.status === "Under maintenance" : room.status === tab);
    const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(room.status);
    const typeMatch = filters.types.length === 0 || filters.types.includes(room.type);
    const propertyMatch = filters.properties.length === 0 || filters.properties.includes(room.property);
    const inclusionMatch = filters.inclusions.length === 0 || filters.inclusions.every((item) => room.inclusions.includes(item));
    const fromMatch = !filters.from || room.price >= Number(filters.from);
    const toMatch = !filters.to || room.price <= Number(filters.to);
    const query = filters.search.trim().toLowerCase();
    const searchMatch = !query || `${room.name} ${room.property}`.toLowerCase().includes(query);
    return tabMatch && statusMatch && typeMatch && propertyMatch && inclusionMatch && fromMatch && toMatch && searchMatch;
  }), [filters, tab]);
  const pageCount = Math.max(1, Math.ceil(filteredRooms.length / 6));
  const currentPage = Math.min(page, pageCount);
  const visibleRooms = filteredRooms.slice((currentPage - 1) * 6, currentPage * 6);
  const showingStart = filteredRooms.length ? (currentPage - 1) * 6 + 1 : 0;
  const showingEnd = Math.min(currentPage * 6, filteredRooms.length);

  const closeFilter = () => { setFilterOpen(false); requestAnimationFrame(() => filterButtonRef.current?.focus()); };
  const closeDetail = () => { setDetailOpen(false); setDetailExpanded(false); requestAnimationFrame(() => selectedCardRef.current?.focus()); };

  useEffect(() => {
    if (!filterOpen && !detailOpen && !detailExpanded) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (detailOpen || detailExpanded) closeDetail();
        else closeFilter();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [detailExpanded, detailOpen, filterOpen]);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  function chooseRoom(room: DashboardRoom) {
    setSelectedRoom(room);
    selectedCardRef.current = document.activeElement instanceof HTMLButtonElement ? document.activeElement : null;
    if (window.matchMedia("(max-width: 1279px)").matches) setDetailOpen(true);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const currentIndex = dashboardFilterOptions.tabs.indexOf(tab);
    const nextIndex = (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + dashboardFilterOptions.tabs.length) % dashboardFilterOptions.tabs.length;
    setTab(dashboardFilterOptions.tabs[nextIndex]);
    document.getElementById(`dashboard-tab-${nextIndex}`)?.focus();
  }

  const setTabIndex = (index: number) => setTab(dashboardFilterOptions.tabs[index]);
  const clearFilters = () => setFilters(initialFilters);
  const filterPanel = <RoomFilters filters={filters} setFilters={setFilters} onClear={clearFilters} onClose={closeFilter} isOpen={filterOpen} />;

  return (
    <div className="dashboard-rooms-layout">
      {filterPanel}
      <section className="dashboard-rooms-column" aria-label={dashboardUiCopy.allRooms}>
        <div className="dashboard-rooms-toolbar">
          <div className="dashboard-tabs" role="tablist" aria-label={dashboardUiCopy.allRooms}>
            {dashboardFilterOptions.tabs.map((tabLabel, index) => <button id={`dashboard-tab-${index}`} key={tabLabel} type="button" role="tab" aria-selected={tab === tabLabel} tabIndex={tab === tabLabel ? 0 : -1} className={tab === tabLabel ? "is-active" : ""} onClick={() => setTabIndex(index)} onKeyDown={handleTabKeyDown}>{tabLabel}</button>)}
          </div>
          <div className="dashboard-room-actions">
            <button className="dashboard-icon-button" type="button" aria-label={dashboardUiCopy.searchRooms} aria-expanded={searchOpen} onClick={() => setSearchOpen((open) => !open)}><SearchIcon /></button>
            <button ref={filterButtonRef} className="dashboard-icon-button dashboard-filter-trigger" type="button" aria-label={dashboardUiCopy.filters} aria-expanded={filterOpen} onClick={() => setFilterOpen(true)}><FilterIcon /></button>
            <button className="button button-dark dashboard-add-room" type="button"><PlusIcon />{dashboardUiCopy.addRoom}</button>
          </div>
        </div>
        {searchOpen && <div className="dashboard-search-row"><SearchIcon /><input ref={searchRef} type="search" aria-label={dashboardUiCopy.searchLabel} placeholder={dashboardUiCopy.searchRooms} value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /><button type="button" aria-label="Close room search" onClick={() => { setSearchOpen(false); setFilters({ ...filters, search: "" }); }}>×</button></div>}
        {visibleRooms.length ? <div className="dashboard-room-grid">{visibleRooms.map((room) => <RoomCard key={room.id} room={room} selected={room.id === selectedRoom.id} onSelect={chooseRoom} />)}</div> : <p className="dashboard-no-rooms">{dashboardUiCopy.noRooms}</p>}
        <div className="dashboard-pagination">
          <span>{dashboardUiCopy.showResults} {showingStart} - {showingEnd} {dashboardUiCopy.ofRooms}</span>
          <div className="dashboard-pagination-buttons" aria-label="Room pages">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>{dashboardUiCopy.previous}</button>
            {Array.from({ length: Math.min(pageCount, 3) }, (_, index) => index + 1).map((number) => <button key={number} type="button" aria-current={currentPage === number ? "page" : undefined} className={currentPage === number ? "is-current" : ""} onClick={() => setPage(number)}>{number}</button>)}
            <span aria-hidden="true">…</span><button type="button" aria-label="Page 8" onClick={() => setPage(pageCount)}>8</button>
            <button type="button" disabled={currentPage === pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>{dashboardUiCopy.next}</button>
          </div>
        </div>
      </section>
      {selectedRoom && <RoomDetail room={selectedRoom} open={detailOpen} onClose={closeDetail} expanded={detailExpanded} onExpand={() => setDetailExpanded((value) => !value)} />}
    </div>
  );
}
