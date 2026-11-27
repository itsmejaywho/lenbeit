"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckIcon, ChevronIcon } from "./icons";

const DROPDOWN_THEME = {
  colors: {
    trigger: "#FAFAFA",
    menu: "#FFFFFF",
    text: "#1A1A1A",
    border: "#D9D9D9",
    hover: "#F4F2EE",
    divider: "#E5A3A3",
    danger: "#C81E1E",
    muted: "#666666",
    focus: "#8A7460",
  },
  radius: { trigger: "10px", menu: "10px", item: "8px" },
} as const;

export type DropdownItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
  variant?: "danger";
  dividerBefore?: boolean;
};

type DropdownProps = {
  items: readonly DropdownItem[];
  variant?: "boxed" | "inline" | "icon";
  placement?: "bottom-start" | "bottom-end" | "right-end";
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  align?: "left" | "right";
  trigger?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  onBlur?: () => void;
};

type Position = { top: number; left: number; width: number; maxHeight: number };

const themeVariables = {
  "--dd-trigger": DROPDOWN_THEME.colors.trigger,
  "--dd-menu": DROPDOWN_THEME.colors.menu,
  "--dd-text": DROPDOWN_THEME.colors.text,
  "--dd-border": DROPDOWN_THEME.colors.border,
  "--dd-hover": DROPDOWN_THEME.colors.hover,
  "--dd-divider": DROPDOWN_THEME.colors.divider,
  "--dd-danger": DROPDOWN_THEME.colors.danger,
  "--dd-muted": DROPDOWN_THEME.colors.muted,
  "--dd-focus": DROPDOWN_THEME.colors.focus,
  "--dd-trigger-radius": DROPDOWN_THEME.radius.trigger,
  "--dd-menu-radius": DROPDOWN_THEME.radius.menu,
  "--dd-item-radius": DROPDOWN_THEME.radius.item,
} as CSSProperties;

export function Dropdown({
  items,
  variant = "boxed",
  placement,
  id,
  label,
  value,
  onChange,
  placeholder,
  align = "left",
  trigger,
  className = "",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  onBlur,
}: DropdownProps) {
  const selectStyle = onChange !== undefined;
  const generatedId = useId();
  const menuId = `dropdown-menu-${generatedId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | HTMLAnchorElement | null>>([]);
  const [menuContainer, setMenuContainer] = useState<Element | null>(null);
  const open = menuContainer !== null;
  const [position, setPosition] = useState<Position | null>(null);
  const positioned = position !== null;
  const selectedLabel = items.find((item) => item.id === value)?.label;
  // "icon" must not produce "shared-dropdown-icon": that class is the menu-item
  // icon slot and its svg sizing would leak onto this wrapper.
  const variantClass = variant === "icon" ? "shared-dropdown-icon-variant" : `shared-dropdown-${variant}`;

  const showMenu = () => {
    setPosition(null);
    setMenuContainer(rootRef.current?.closest("dialog:modal") ?? document.body);
  };

  const updatePosition = useCallback(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;
    const rect = triggerElement.getBoundingClientRect();
    const gap = 8;
    const viewportPadding = 8;
    const menuHeight = menuRef.current?.getBoundingClientRect().height ?? 280;
    const resolvedPlacement = placement ?? (align === "right" ? "bottom-end" : "bottom-start");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const fontSize = window.innerWidth < 768 ? 16 : 14;
    if (context) context.font = `${fontSize}px ${getComputedStyle(triggerElement).fontFamily}`;
    const longestLabel = context
      ? Math.max(0, ...items.map((item) => context.measureText(item.label).width))
      : 0;
    const accessoryWidth = items.some((item) => item.icon) ? 32 : 0;
    const checkWidth = variant === "inline" && selectStyle ? 24 : 0;
    const naturalWidth = Math.ceil(longestLabel + 24 + 16 + 2 + accessoryWidth + checkWidth);
    const width = Math.min(
      window.innerWidth - viewportPadding * 2,
      Math.max(rect.width, 180, naturalWidth),
    );
    const availableBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
    const availableAbove = rect.top - gap - viewportPadding;
    const availableRight = window.innerWidth - rect.right - gap - viewportPadding;
    const availableLeft = rect.left - gap - viewportPadding;
    const flipUp = resolvedPlacement !== "right-end"
      && availableBelow < Math.min(menuHeight, 180)
      && availableAbove > availableBelow;
    const flipLeft = resolvedPlacement === "right-end"
      && availableRight < width
      && availableLeft > availableRight;
    const maxHeight = resolvedPlacement === "right-end"
      ? Math.max(44, rect.bottom - viewportPadding)
      : Math.max(44, flipUp ? availableAbove : availableBelow);
    const left = resolvedPlacement === "right-end"
      ? flipLeft ? rect.left - gap - width : rect.right + gap
      : resolvedPlacement === "bottom-end" ? rect.right - width : rect.left;
    const preferredTop = resolvedPlacement === "right-end"
      ? rect.bottom - Math.min(menuHeight, maxHeight)
      : flipUp ? rect.top - gap - Math.min(menuHeight, maxHeight) : rect.bottom + gap;
    setPosition({
      top: Math.max(viewportPadding, Math.min(preferredTop, window.innerHeight - Math.min(menuHeight, maxHeight) - viewportPadding)),
      left: Math.max(viewportPadding, Math.min(left, window.innerWidth - width - viewportPadding)),
      width,
      maxHeight,
    });
  }, [align, items, placement, selectStyle, variant]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const handleViewportChange = () => updatePosition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open, updatePosition]);

  useLayoutEffect(() => {
    if (open && positioned) itemRefs.current.find((item) => item !== null)?.focus();
  }, [open, positioned]);

  useEffect(() => {
    if (!open) return;
    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setMenuContainer(null);
      }
    };
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [open]);

  const choose = (item: DropdownItem) => {
    if (selectStyle) onChange?.(item.id);
    item.onSelect?.();
    setMenuContainer(null);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
    const current = itemRefs.current.filter(
      (item): item is HTMLButtonElement | HTMLAnchorElement => item !== null,
    );
    const currentIndex = current.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setMenuContainer(null);
      triggerRef.current?.focus();
    } else if (event.key === "Tab") {
      if (open) triggerRef.current?.focus();
      setMenuContainer(null);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (!open) showMenu();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? current.length - 1
          : event.key === "ArrowDown"
            ? currentIndex < 0 ? 0 : (currentIndex + 1) % current.length
            : currentIndex < 0 ? current.length - 1 : (currentIndex - 1 + current.length) % current.length;
      if (current[nextIndex]) current[nextIndex].focus();
      else requestAnimationFrame(() => itemRefs.current[0]?.focus());
    } else if ((event.key === "Enter" || event.key === " ") && !open) {
      event.preventDefault();
      showMenu();
    } else if ((event.key === "Enter" || event.key === " ") && open && currentIndex < 0) {
      event.preventDefault();
      itemRefs.current[0]?.focus();
    }
  };

  const triggerContent = selectStyle
    ? selectedLabel ?? placeholder ?? trigger ?? ""
    : trigger ?? placeholder ?? "";
  const customTrigger = isValidElement(triggerContent)
    ? cloneElement(triggerContent, { "aria-hidden": true } as Record<string, unknown>)
    : triggerContent;
  const portalMenu = menuContainer
    ? createPortal(
      <div
          className={`shared-dropdown-menu${variant === "inline" ? " shared-dropdown-menu-inline" : ""}`}
          id={menuId}
          ref={menuRef}
          role={selectStyle ? "listbox" : "menu"}
          aria-label={ariaLabel ?? placeholder}
          onKeyDown={(event) => {
            event.stopPropagation();
            handleKeyDown(event);
          }}
          style={{
            ...themeVariables,
            position: "fixed",
            top: position?.top ?? 0,
            left: position?.left ?? 0,
            width: position?.width,
            maxHeight: position?.maxHeight,
            visibility: position ? "visible" : "hidden",
          } as CSSProperties}
        >
          {items.map((item, index) => {
            const commonProps = {
              className: `shared-dropdown-item${item.variant === "danger" ? " shared-dropdown-item-danger" : ""}${item.dividerBefore ? " shared-dropdown-item-divider" : ""}`,
              role: selectStyle ? "option" : "menuitem",
              "aria-selected": selectStyle ? item.id === value : undefined,
              key: item.id,
              ref: (element: HTMLButtonElement | HTMLAnchorElement | null) => {
                itemRefs.current[index] = element;
              },
              onClick: () => choose(item),
            };
            const contents = (
              <>
                {item.icon && <span className="shared-dropdown-icon">{item.icon}</span>}
                <span>{item.label}</span>
                {variant === "inline" && selectStyle && item.id === value && (
                  <span className="shared-dropdown-check"><CheckIcon /></span>
                )}
              </>
            );
            return item.href && !selectStyle ? (
              <a {...commonProps} href={item.href} key={item.id}>
                {contents}
              </a>
            ) : (
              <button {...commonProps} type="button" key={item.id}>
                {contents}
              </button>
            );
          })}
        </div>,
        menuContainer,
      )
    : null;

  return (
    <div className={`shared-dropdown ${variantClass} ${className}`} ref={rootRef} style={themeVariables} onKeyDown={handleKeyDown}>
      <button
        id={id}
        aria-haspopup={selectStyle ? "listbox" : "menu"}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={`shared-dropdown-trigger${variant === "inline" ? " shared-dropdown-trigger-inline" : ""}${variant === "icon" ? " shared-dropdown-trigger-icon" : ""}`}
        onClick={(event) => { event.stopPropagation(); if (open) setMenuContainer(null); else showMenu(); }}
        onBlur={onBlur}
        ref={triggerRef}
        type="button"
      >
        {variant === "icon" ? (
          customTrigger
        ) : variant === "inline" ? (
          <span className="shared-dropdown-inline-content">
            {label && <span className="shared-dropdown-inline-label">{label}</span>}
            <span className="shared-dropdown-inline-value">{customTrigger}</span>
            <span className={`shared-dropdown-caret${open ? " shared-dropdown-caret-open" : ""}`} aria-hidden="true" />
          </span>
        ) : (
          <>
            <span className="shared-dropdown-trigger-label">{customTrigger}</span>
            <ChevronIcon className="shared-dropdown-chevron" open={open} />
          </>
        )}
      </button>
      {portalMenu}
    </div>
  );
}
