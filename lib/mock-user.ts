export type VerificationStatus = "not_submitted" | "pending" | "approved" | "rejected";

export type DashboardUserStatus = {
  emailVerified: boolean;
  verificationStatus: VerificationStatus;
  name: string;
};

// Replace this local demo status with the authenticated user's status when auth is connected.
export const mockUser: DashboardUserStatus = {
  emailVerified: true,
  verificationStatus: "approved",
  name: "Jordan Reyes",
};
