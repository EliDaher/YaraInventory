import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getLastActivity,
  LAST_ACTIVITY_KEY,
  logoutSession,
  markSessionActivity,
  readInventoryUser,
  SESSION_EVENT_KEY,
} from "@/lib/session";

const TIMEOUT_MS = 60 * 60 * 1000;
const WARNING_MS = 60 * 1000;
const ACTIVITY_WRITE_THROTTLE_MS = 3 * 1000;
const PUBLIC_ROUTES = new Set(["/", "/login", "/unauthorized", "/signup"]);

export function AutoLogoutManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabIdRef = useRef(`tab-${Date.now()}-${Math.random().toString(16)}`);
  const lastWriteAtRef = useRef(0);
  const logoutTriggeredRef = useRef(false);

  const [lastActivity, setLastActivity] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [warningOpen, setWarningOpen] = useState(false);

  const normalizedPath = useMemo(
    () => (location.pathname || "").toLowerCase(),
    [location.pathname]
  );
  const user = readInventoryUser();
  const isSessionActive = Boolean(user && !PUBLIC_ROUTES.has(normalizedPath));

  const recordActivity = useCallback(
    (broadcast = true) => {
      if (!isSessionActive) return;

      const current = Date.now();
      if (current - lastWriteAtRef.current < ACTIVITY_WRITE_THROTTLE_MS) {
        return;
      }

      lastWriteAtRef.current = current;
      markSessionActivity(current, tabIdRef.current, broadcast);
      setLastActivity(current);
      setWarningOpen(false);
      logoutTriggeredRef.current = false;
    },
    [isSessionActive]
  );

  const doLogout = useCallback(
    (reason?: string, broadcast = true) => {
      if (logoutTriggeredRef.current) return;
      logoutTriggeredRef.current = true;
      setWarningOpen(false);
      logoutSession({
        reason,
        broadcast,
        tabId: tabIdRef.current,
        navigate,
      });
    },
    [navigate]
  );

  useEffect(() => {
    if (!isSessionActive) {
      setWarningOpen(false);
      setLastActivity(null);
      return;
    }

    const initialActivity = getLastActivity() || Date.now();
    markSessionActivity(initialActivity, tabIdRef.current, false);
    setLastActivity(initialActivity);
    setNow(Date.now());
    logoutTriggeredRef.current = false;

    const onUserActivity = () => recordActivity(true);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        recordActivity(true);
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (!isSessionActive) return;

      if (event.key === LAST_ACTIVITY_KEY && event.newValue) {
        const parsed = Number(event.newValue);
        if (Number.isFinite(parsed) && parsed > 0) {
          setLastActivity(parsed);
          setWarningOpen(false);
          logoutTriggeredRef.current = false;
        }
      }

      if (event.key === SESSION_EVENT_KEY && event.newValue) {
        try {
          const payload = JSON.parse(event.newValue) as {
            type?: "stay_active" | "force_logout";
            ts?: number;
            reason?: string;
            tabId?: string;
          };

          if (payload.tabId === tabIdRef.current) {
            return;
          }

          if (payload.type === "stay_active" && Number.isFinite(payload.ts)) {
            setLastActivity(Number(payload.ts));
            setWarningOpen(false);
            logoutTriggeredRef.current = false;
          }

          if (payload.type === "force_logout") {
            doLogout(payload.reason, false);
          }
        } catch (error) {
          console.error("Failed to parse session event:", error);
        }
      }
    };

    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    events.forEach((eventName) =>
      window.addEventListener(eventName, onUserActivity, { passive: true })
    );
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(interval);
      events.forEach((eventName) =>
        window.removeEventListener(eventName, onUserActivity)
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [doLogout, isSessionActive, recordActivity]);

  useEffect(() => {
    if (!isSessionActive || !lastActivity) {
      return;
    }

    const logoutAt = lastActivity + TIMEOUT_MS;
    const warningAt = logoutAt - WARNING_MS;

    if (now >= logoutAt) {
      doLogout("session_expired", true);
      return;
    }

    if (now >= warningAt) {
      setWarningOpen(true);
    } else {
      setWarningOpen(false);
    }
  }, [doLogout, isSessionActive, lastActivity, now]);

  if (!isSessionActive || !lastActivity) {
    return null;
  }

  const countdown = Math.max(
    0,
    Math.ceil((lastActivity + TIMEOUT_MS - now) / 1000)
  );

  return (
    <AlertDialog open={warningOpen}>
      <AlertDialogContent
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expiring Soon</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logged out in {countdown} second
            {countdown === 1 ? "" : "s"} due to inactivity.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => recordActivity(true)}>
            Stay signed in
          </Button>
          <Button variant="destructive" onClick={() => doLogout(undefined, true)}>
            Log out now
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
