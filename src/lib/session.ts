import { NavigateFunction } from "react-router-dom";

export const INVENTORY_USER_KEY = "InventoryUser";
export const AUTH_TOKEN_KEY = "auth_token";
export const LAST_ACTIVITY_KEY = "inventory_last_activity_at";
export const SESSION_EVENT_KEY = "inventory_session_event";

export type SessionEventType = "stay_active" | "force_logout";

export type SessionEventPayload = {
  type: SessionEventType;
  ts: number;
  reason?: string;
  tabId?: string;
};

export const readInventoryUser = () => {
  try {
    const userStr = localStorage.getItem(INVENTORY_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to parse InventoryUser:", error);
    return null;
  }
};

export const getLastActivity = (): number | null => {
  const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
  const parsed = Number(raw);
  if (!raw || !Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const emitSessionEvent = (event: SessionEventPayload) => {
  localStorage.setItem(SESSION_EVENT_KEY, JSON.stringify(event));
};

export const markSessionActivity = (
  ts = Date.now(),
  tabId?: string,
  broadcast = true
) => {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(ts));
  if (broadcast) {
    emitSessionEvent({
      type: "stay_active",
      ts,
      tabId,
    });
  }
};

type LogoutOptions = {
  reason?: string;
  broadcast?: boolean;
  tabId?: string;
  navigate?: NavigateFunction;
};

export const logoutSession = ({
  reason,
  broadcast = true,
  tabId,
  navigate,
}: LogoutOptions = {}) => {
  if (broadcast) {
    emitSessionEvent({
      type: "force_logout",
      ts: Date.now(),
      reason,
      tabId,
    });
  }

  localStorage.removeItem(INVENTORY_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);

  const search = reason ? `?reason=${encodeURIComponent(reason)}` : "";
  const target = `/login${search}`;

  if (navigate) {
    navigate(target, { replace: true });
    return;
  }

  window.location.hash = `#${target}`;
};
