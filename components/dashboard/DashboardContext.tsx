"use client";

import { Suspense, createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { mockUser, type DashboardUserStatus, type VerificationStatus } from "../../lib/mock-user";
import { dashboardRooms, type DashboardRoom } from "../../lib/dashboard-placeholder";
import { dashboardNavItems } from "../../lib/dashboard-nav";
import { Dropdown } from "../ui/Dropdown";
import { SidebarNav } from "./SidebarNav";

type DashboardContextValue = {
  userStatus: DashboardUserStatus;
  setVerificationStatus: (status: VerificationStatus | "unverified") => void;
  rooms: DashboardRoom[];
  saveRoom: (room: DashboardRoom) => void;
  updateRoom: (id: string, update: Partial<DashboardRoom>) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [userStatus, setUserStatus] = useState<DashboardUserStatus>(mockUser);
  const [rooms, setRooms] = useState(dashboardRooms);
  const value = useMemo<DashboardContextValue>(() => ({
    userStatus,
    rooms,
    saveRoom: (room) => setRooms((current) => current.some((item) => item.id === room.id)
      ? current.map((item) => item.id === room.id ? room : item)
      : [...current, room]),
    updateRoom: (id, update) => setRooms((current) => current.map((room) => room.id === id ? { ...room, ...update } : room)),
    setVerificationStatus: (status) => setUserStatus({
      ...userStatus,
      emailVerified: status !== "unverified",
      verificationStatus: status === "unverified" ? "not_submitted" : status,
    }),
  }), [rooms, userStatus]);
  const switcherItems = [
    { id: "unverified", label: "Email not confirmed" },
    { id: "not_submitted", label: "Not submitted" },
    { id: "pending", label: "Pending review" },
    { id: "rejected", label: "Rejected" },
    { id: "approved", label: "Approved" },
  ];
  const switcherValue = !userStatus.emailVerified ? "unverified" : userStatus.verificationStatus;

  return (
    <DashboardContext.Provider value={value}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <div className="dashboard-status-switcher">
          <span>Demo status</span>
          <Dropdown
            items={switcherItems}
            value={switcherValue}
            onChange={(status) => value.setVerificationStatus(status as VerificationStatus | "unverified")}
            aria-label="Change demo account status"
            variant="inline"
          />
        </div>
      )}
    </DashboardContext.Provider>
  );
}

export function useDashboardUser() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboardUser must be used inside DashboardProvider.");
  return context;
}

export function DashboardFrame({ children }: { children: ReactNode }) {
  const { userStatus } = useDashboardUser();
  return (
    <div className="dashboard-viewport">
      <div className="dashboard-shell">
        <Suspense fallback={null}><SidebarNav items={dashboardNavItems} userStatus={userStatus} /></Suspense>
        <div className="dashboard-main-column">{children}</div>
      </div>
    </div>
  );
}
