import type { RoomStatus, RoomType } from "./dashboard-placeholder";

export const roomTypeLabels: Record<RoomType, string> = {
  bedspace: "Bedspace",
  private_room: "Private room",
  studio: "Studio",
  apartment_unit: "Apartment unit",
  whole_house: "Whole house",
};

export const roomStatusLabels: Record<RoomStatus, string> = {
  vacant: "Vacant",
  occupied: "Occupied",
  maintenance: "Maintenance",
};

export const listingStatusLabels = {
  draft: "Draft",
  published: "Published",
  archived: "Archived",
} as const;

export const bathroomLabels = { private: "Private", shared: "Shared" } as const;
export const furnishingLabels = { unfurnished: "Unfurnished", semi: "Semi-furnished", furnished: "Furnished" } as const;
