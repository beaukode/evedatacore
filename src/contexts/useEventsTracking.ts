import React from "react";
import { useBeforeUnload, useLocation, useNavigationType } from "react-router";
import { postEvents } from "@/api/evedatacore";

export type TrackingEvent = {
  key: string;
  ts: number;
};

const FLUSH_INTERVAL = 1000 * 60; // 60 seconds

let eventQueue: TrackingEvent[] | undefined = undefined;

async function flushEvents() {
  if (!eventQueue) {
    return;
  }
  const events = eventQueue;
  postEvents({ body: { events } });
  eventQueue = [];
}

function pushEventToQueue(key: string) {
  if (!eventQueue) {
    eventQueue = [];
  }
  eventQueue.push({ key, ts: Date.now() });
}

function redactNavigationPath(path: string) {
  const parts = path.split("/", 4);
  let redactedPath = parts[1];
  if (parts[2]) {
    redactedPath += `/${parts[2]}`;
  }
  if (parts[3]) {
    redactedPath += `/*`;
  }
  return redactedPath;
}

function useEventsTracking() {
  const flushTimer = React.useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const navigationType = useNavigationType();

  // Flush event when user quit the website
  useBeforeUnload(() => {
    if (eventQueue && eventQueue.length > 0) {
      const events = eventQueue;
      eventQueue = [];
      const data = new Blob(
        [
          JSON.stringify({
            events,
          }),
        ],
        {
          type: "application/json",
        }
      );
      navigator.sendBeacon("/api/events", data);
    }
  });

  const scheduleFlush = React.useCallback(() => {
    if (!flushTimer.current) {
      flushTimer.current = setTimeout(() => {
        flushEvents();
        flushTimer.current = null;
      }, FLUSH_INTERVAL);
    }
  }, []);

  React.useEffect(() => {
    if (navigationType === "PUSH") {
      pushEventToQueue(`page://${redactNavigationPath(location.pathname)}`);
      scheduleFlush();
    } else if (navigationType === "POP") {
      if (!eventQueue) {
        pushEventToQueue(`page://${redactNavigationPath(location.pathname)}`);
        scheduleFlush();
      }
    }
  }, [location, navigationType, scheduleFlush]);

  const pushEvent = React.useCallback(
    (key: string) => {
      pushEventToQueue(key);
      scheduleFlush();
    },
    [scheduleFlush]
  );

  return { pushEvent };
}

export default useEventsTracking;
