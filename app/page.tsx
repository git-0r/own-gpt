"use client";

import MessageForm from "@/components/form";
import Settings from "@/components/settings";
import Messages from "@/components/messages";

export default function Home() {
  return (
    <div className="grid grid-rows-8 h-screen max-w-xl m-auto p-4 relative">
      <Settings />
      <Messages />
      <MessageForm />
    </div>
  );
}
