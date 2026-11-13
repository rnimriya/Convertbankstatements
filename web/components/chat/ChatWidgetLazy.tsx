"use client";

import dynamic from "next/dynamic";

// The support chat is below-the-fold UI on every page — loading it as a
// separate client chunk (after the page's own JS) keeps its code out of the
// shared First Load bundle that every visitor pays for up front.
const ChatWidget = dynamic(
  () => import("./ChatWidget").then((m) => m.ChatWidget),
  { ssr: false }
);

export function ChatWidgetLazy() {
  return <ChatWidget />;
}
