export type RoomStatus = "vacant" | "occupied" | "maintenance";
export type ListingStatus = "draft" | "published" | "archived";
export type RoomType = "bedspace" | "private_room" | "studio" | "apartment_unit" | "whole_house";
export type RoomPhoto = { id: string; url: string; name: string; isCover: boolean };

export type DashboardRoom = {
  id: string;
  propertyId: string;
  property: string;
  name: string;
  roomType: RoomType;
  monthlyRent: number;
  photos: RoomPhoto[];
  description: string;
  availableFrom: string | "now";
  depositMonths: number | null;
  advanceMonths: number | null;
  capacity: number | null;
  floorAreaSqm?: number;
  bathroom?: "private" | "shared";
  furnishing?: "unfurnished" | "semi" | "furnished";
  rules?: string;
  contactPhone?: string;
  status: RoomStatus;
  listingStatus: ListingStatus;
  createdAt: string;
  updatedAt: string;
  tone: "sand" | "stone" | "clay";
};

export const dashboardProperties = [
  { id: "willow", name: "Willow Boarding House" },
  { id: "mabini", name: "Mabini Residences" },
  { id: "acacia", name: "Acacia House" },
] as const;

const createdAt = "2026-01-15T09:00:00.000Z";

// TODO: Replace these local examples with the landlord's room records.
export const dashboardRooms: DashboardRoom[] = [
  { id: "room-01", propertyId: "willow", name: "Room 01 · Garden wing", property: "Willow Boarding House", roomType: "private_room", monthlyRent: 4500, photos: [{ id: "p1", url: "", name: "", isCover: true }], description: "Bright private room overlooking the garden.", availableFrom: "now", depositMonths: 1, advanceMonths: 1, capacity: 2, bathroom: "shared", furnishing: "semi", floorAreaSqm: 16, rules: "No smoking indoors.", status: "vacant", listingStatus: "published", createdAt, updatedAt: createdAt, tone: "sand" },
  { id: "room-02", propertyId: "willow", name: "Room 02 · Corner room", property: "Willow Boarding House", roomType: "private_room", monthlyRent: 5200, photos: [{ id: "p3", url: "", name: "", isCover: true }], description: "Quiet corner room with morning light.", availableFrom: "now", depositMonths: 1, advanceMonths: 1, capacity: 2, bathroom: "shared", furnishing: "unfurnished", status: "vacant", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "stone" },
  { id: "room-03", propertyId: "mabini", name: "Studio 3A", property: "Mabini Residences", roomType: "studio", monthlyRent: 9800, photos: [{ id: "p2", url: "", name: "", isCover: true }], description: "Self-contained studio with kitchenette.", availableFrom: "2026-12-01", depositMonths: 2, advanceMonths: 1, capacity: 2, bathroom: "private", furnishing: "furnished", floorAreaSqm: 28, status: "vacant", listingStatus: "published", createdAt, updatedAt: createdAt, tone: "clay" },
  { id: "room-04", propertyId: "willow", name: "Room 04 · East side", property: "Willow Boarding House", roomType: "bedspace", monthlyRent: 4300, photos: [], description: "", availableFrom: "", depositMonths: null, advanceMonths: null, capacity: 4, status: "maintenance", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "stone" },
  { id: "room-05", propertyId: "mabini", name: "Studio 5B", property: "Mabini Residences", roomType: "studio", monthlyRent: 10500, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 2, status: "occupied", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "sand" },
  { id: "room-06", propertyId: "acacia", name: "Garden room", property: "Acacia House", roomType: "private_room", monthlyRent: 7200, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 1, status: "vacant", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "clay" },
  { id: "room-07", propertyId: "willow", name: "Room 07 · Shared bath", property: "Willow Boarding House", roomType: "private_room", monthlyRent: 3900, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 2, status: "occupied", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "sand" },
  { id: "room-08", propertyId: "mabini", name: "Studio 8C", property: "Mabini Residences", roomType: "studio", monthlyRent: 8900, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 2, status: "vacant", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "stone" },
  { id: "room-09", propertyId: "acacia", name: "Front bedroom", property: "Acacia House", roomType: "private_room", monthlyRent: 6800, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 2, status: "occupied", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "clay" },
  { id: "room-10", propertyId: "willow", name: "Room 10 · Upper floor", property: "Willow Boarding House", roomType: "private_room", monthlyRent: 4700, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 1, status: "vacant", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "stone" },
  { id: "room-11", propertyId: "mabini", name: "Studio 11A", property: "Mabini Residences", roomType: "studio", monthlyRent: 11200, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 2, status: "maintenance", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "sand" },
  { id: "room-12", propertyId: "acacia", name: "Garden suite", property: "Acacia House", roomType: "whole_house", monthlyRent: 8400, photos: [], description: "", availableFrom: "", depositMonths: 0, advanceMonths: 0, capacity: 4, status: "vacant", listingStatus: "draft", createdAt, updatedAt: createdAt, tone: "clay" },
];

export const dashboardCopy = {
  overview: { title: "Rooms", subtitle: "Manage your rooms, availability, and listings in one place." },
  verification: { title: "Verification", subtitle: "Review the steps for confirming your landlord account.", message: "Your verification checklist will be available here soon.", action: "Go to overview" },
  rooms: { title: "Rooms", subtitle: "Manage your rooms, availability, and listings in one place.", message: "Manage room details and availability from your overview.", action: "View overview" },
  listings: { title: "Listings", subtitle: "Keep track of the rooms renters can discover.", message: "Your listings workspace is coming soon.", action: "View rooms" },
  inquiries: { title: "Inquiries", subtitle: "Stay on top of conversations with prospective renters.", message: "Your inquiry inbox is coming soon.", action: "View rooms" },
  tenants: { title: "Tenants", subtitle: "Manage your tenants and room assignments.", message: "Your tenant workspace is coming soon.", action: "View rooms" },
  settings: { title: "Settings", subtitle: "Manage your landlord account settings.", message: "Your settings workspace is coming soon.", action: "View overview" },
  help: { title: "Help", subtitle: "Find answers and support.", message: "Your help workspace is coming soon.", action: "View overview" },
} as const;

export const dashboardStatusCopy = {
  unverified: { title: "Verify your email", message: "Confirm your email address before you continue.", action: "Check verification" },
  not_submitted: { title: "Complete your verification", message: "Submit your details so we can review your landlord account.", action: "Start verification" },
  pending: { title: "Under review", message: "Your verification is being reviewed. We’ll let you know when there’s an update." },
  rejected: { title: "Verification rejected", message: "Please review your details and submit them again.", action: "Resubmit" },
} as const;

export const accountMenuCopy = [
  { id: "profile", label: "Profile", href: "/dashboard/settings" },
  { id: "notification", label: "Notification", href: "/dashboard/inquiries" },
  { id: "settings", label: "Settings", href: "/dashboard/settings" },
  { id: "help", label: "Help", href: "/dashboard/help" },
  { id: "logout", label: "Logout", variant: "danger" as const, dividerBefore: true },
] as const;

export const dashboardFilterOptions = {
  tabs: ["All", "Vacant", "Occupied", "Unavailable"] as const,
  statuses: ["vacant", "occupied", "maintenance"] as RoomStatus[],
  types: ["bedspace", "private_room", "studio", "apartment_unit", "whole_house"] as const,
  properties: dashboardProperties.map((property) => property.name),
};

export const dashboardUiCopy = {
  addRoom: "Add room", filters: "Filters", searchRooms: "Search rooms", searchLabel: "Search rooms by name or property", allRooms: "All rooms",
  clearFilters: "Clear filters", filterPanel: "Room filters", typeCounts: { bedspace: 2, private_room: 10, studio: 8, apartment_unit: 2, whole_house: 2 },
  listed: "Published", draft: "Draft", viewDetails: "View room details", closeDetails: "Close room details", expandDetails: "Expand room details", roomDetail: "Room detail",
  description: { title: "Description", subtitle: "Room details" }, photos: { title: "Photos", subtitle: "Room images" }, listing: { title: "Listing", subtitle: "Publish or hide" },
  stats: [{ id: "inquiries", label: "Inquiries", value: "12", icon: "chat" }, { id: "views", label: "Views", value: "340", icon: "eye" }, { id: "days", label: "Days listed", value: "18", icon: "clock" }] as const,
  saveChanges: "Save changes", saveConfirmation: "Room changes saved locally.", status: { vacant: "Vacant", occupied: "Occupied", maintenance: "Maintenance" },
  showResults: "Showing", ofRooms: "of rooms", previous: "Previous", next: "Next", noRooms: "No rooms match these filters.", statusGroups: "Status", typeGroup: "Room type", propertyGroup: "Property",
} as const;
