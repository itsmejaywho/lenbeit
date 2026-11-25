"use client";

import { useState } from "react";
import { Dropdown } from "../../../components/ui/Dropdown";
import {
  BellIcon,
  HelpIcon,
  LogoutIcon,
  SettingsIcon,
  UserIcon,
} from "../../../components/ui/icons";

const accountMenu = [
  { id: "profile", label: "Profile", icon: <UserIcon /> },
  { id: "notification", label: "Notification", icon: <BellIcon /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  { id: "help", label: "Help", icon: <HelpIcon /> },
  {
    id: "logout",
    label: "Logout",
    icon: <LogoutIcon />,
    variant: "danger" as const,
    dividerBefore: true,
  },
];

const selectOptions = [
  { id: "option-1", label: "Select an option" },
  { id: "option-2", label: "Second option" },
  { id: "option-3", label: "Third option" },
];

export default function DropdownDemoPage() {
  const [selectedOption, setSelectedOption] = useState("option-1");

  return (
    <main className="dropdown-demo">
      {/* Development-only reference page. This demo can be deleted. */}
      <Dropdown
        aria-label="Account menu"
        placeholder="Select an option"
        trigger="Select an option"
        items={accountMenu}
      />
      <label className="dropdown-demo-select">
        Select-style example
        <Dropdown
          aria-label="Example selection"
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Choose an option"
          items={selectOptions}
        />
      </label>
    </main>
  );
}
