export type RoomStatus = "Vacant" | "Occupied" | "Under maintenance";

export type DashboardRoom = {
  id: string;
  name: string;
  property: string;
  price: number;
  status: RoomStatus;
  listed: boolean;
  tone: "sand" | "stone" | "clay";
  type: "Boarding house" | "Apartment" | "House";
  inclusions: string[];
};

// TODO: Replace these local examples with the landlord's room records.
export const dashboardRooms: DashboardRoom[] = [
  { id: "room-01", name: "Room 01 · Garden wing", property: "Willow Boarding House", price: 4500, status: "Vacant", listed: true, tone: "sand", type: "Boarding house", inclusions: ["Water", "Wifi"] },
  { id: "room-02", name: "Room 02 · Corner room", property: "Willow Boarding House", price: 5200, status: "Occupied", listed: true, tone: "stone", type: "Boarding house", inclusions: ["Water", "Wifi", "Electricity"] },
  { id: "room-03", name: "Studio 3A", property: "Mabini Residences", price: 9800, status: "Vacant", listed: true, tone: "clay", type: "Apartment", inclusions: ["Water", "Aircon"] },
  { id: "room-04", name: "Room 04 · East side", property: "Willow Boarding House", price: 4300, status: "Under maintenance", listed: false, tone: "stone", type: "Boarding house", inclusions: ["Water"] },
  { id: "room-05", name: "Studio 5B", property: "Mabini Residences", price: 10500, status: "Occupied", listed: true, tone: "sand", type: "Apartment", inclusions: ["Water", "Wifi", "Aircon"] },
  { id: "room-06", name: "Garden room", property: "Acacia House", price: 7200, status: "Vacant", listed: false, tone: "clay", type: "House", inclusions: ["Water", "Electricity"] },
  { id: "room-07", name: "Room 07 · Shared bath", property: "Willow Boarding House", price: 3900, status: "Occupied", listed: true, tone: "sand", type: "Boarding house", inclusions: ["Water", "Wifi"] },
  { id: "room-08", name: "Studio 8C", property: "Mabini Residences", price: 8900, status: "Vacant", listed: true, tone: "stone", type: "Apartment", inclusions: ["Water", "Electricity", "Aircon"] },
  { id: "room-09", name: "Front bedroom", property: "Acacia House", price: 6800, status: "Occupied", listed: true, tone: "clay", type: "House", inclusions: ["Water", "Wifi"] },
  { id: "room-10", name: "Room 10 · Upper floor", property: "Willow Boarding House", price: 4700, status: "Vacant", listed: false, tone: "stone", type: "Boarding house", inclusions: ["Water", "Electricity"] },
  { id: "room-11", name: "Studio 11A", property: "Mabini Residences", price: 11200, status: "Under maintenance", listed: false, tone: "sand", type: "Apartment", inclusions: ["Water", "Wifi", "Aircon"] },
  { id: "room-12", name: "Garden suite", property: "Acacia House", price: 8400, status: "Vacant", listed: true, tone: "clay", type: "House", inclusions: ["Water", "Wifi", "Electricity"] },
];

export const dashboardCopy = {
  overview: { title: "Rooms", subtitle: "Manage your rooms, availability, and listings in one place." },
  verification: { title: "Verification", subtitle: "Review the steps for confirming your landlord account.", message: "Your verification checklist will be available here soon.", action: "Go to overview" },
  rooms: { title: "Rooms", subtitle: "Your room workspace will be available here soon.", message: "Manage room details and availability from your overview.", action: "View overview" },
  listings: { title: "Listings", subtitle: "Keep track of the rooms renters can discover.", message: "Your listings workspace is coming soon.", action: "View rooms" },
  inquiries: { title: "Inquiries", subtitle: "Stay on top of conversations with prospective renters.", message: "Your inquiry inbox is coming soon.", action: "View rooms" },
  tenants: { title: "Tenants and rent", subtitle: "Keep tenant details and rent activity together.", message: "Tenant and rent tools are coming soon.", action: "View overview" },
  help: { title: "Help", subtitle: "Find guidance for managing your rental spaces.", message: "Help resources are being prepared.", action: "Back to overview" },
  settings: { title: "Settings", subtitle: "Manage your account preferences.", message: "Account settings are coming soon.", action: "Back to overview" },
} as const;

export const dashboardFilterOptions = {
  statuses: ["Vacant", "Occupied", "Under maintenance"] as const,
  types: ["Boarding house", "Apartment", "House"] as const,
  properties: ["Willow Boarding House", "Mabini Residences", "Acacia House"],
  inclusions: ["Water", "Wifi", "Electricity", "Aircon"],
  tabs: ["All", "Vacant", "Occupied", "Unavailable"] as const,
};

export const dashboardStatusCopy = {
  unverified: { title: "Confirm your email", message: "Confirm your email address to continue setting up your landlord account." },
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

export const dashboardUiCopy = {
  addRoom: "Add room",
  filters: "Filters",
  searchRooms: "Search rooms",
  searchLabel: "Search rooms by name or property",
  allRooms: "All rooms",
  clearFilters: "Clear filters",
  filterPanel: "Room filters",
  typeCounts: { "Boarding house": 8, Apartment: 10, House: 6 },
  listed: "Listed",
  draft: "Draft",
  viewDetails: "View room details",
  closeDetails: "Close room details",
  expandDetails: "Expand room details",
  roomDetail: "Room detail",
  description: { title: "Description", subtitle: "Price, size, and rules" },
  inclusionDetails: { title: "Inclusions", subtitle: "Water, wifi, and more" },
  photos: { title: "Photos", subtitle: "Manage room images" },
  listing: { title: "Listing", subtitle: "Publish or hide" },
  stats: [
    { id: "inquiries", label: "Inquiries", value: "12", icon: "chat" },
    { id: "views", label: "Views", value: "340", icon: "eye" },
    { id: "days", label: "Days listed", value: "18", icon: "clock" },
  ] as const,
  saveChanges: "Save changes",
  saveConfirmation: "Room changes saved locally.",
  status: { Vacant: "Vacant", Occupied: "Occupied", "Under maintenance": "Maintenance" },
  showResults: "Showing",
  ofRooms: "of 24 rooms",
  previous: "Previous",
  next: "Next",
  noRooms: "No rooms match these filters.",
  statusGroups: "Status",
  typeGroup: "Property type",
  propertyGroup: "Property",
  priceGroup: "Price range",
  inclusionsGroup: "Inclusions",
  priceFrom: "From",
  priceTo: "To",
  minimumPrice: "Minimum price per month",
  maximumPrice: "Maximum price per month",
  maxPrice: "Maximum price per month",
} as const;
