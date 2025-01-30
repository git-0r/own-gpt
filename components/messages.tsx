import Image from "next/image";
import Markdown from "react-markdown";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Welcome from "@/components/welcome";
import ActiveMessage from "@/components/active-message";
import { useStore } from "@/app/store";

export default function Messages() {
  const { messages, error } = useStore((state) => state.chat);
  const isLoading = useStore((state) => state.currentResponse.isLoading);

  return (
    <div className="row-span-6 overflow-scroll space-y-4">
      {messages.length === 0 && !isLoading && (
        <Welcome className="size-1/2 m-auto" />
      )}
      {messages.map((message) => (
        <div
          key={message.content}
          className={cn(
            message.role === "assistant"
              ? "flex flex-row items-start gap-2"
              : ""
          )}
        >
          {message.role === "assistant" && (
            <Image
              src="/images/avatar.png"
              width={25}
              height={25}
              alt="assistant"
              className=""
            />
          )}
          <div>
            <Markdown
              className={cn(
                message.role === "user"
                  ? "bg-slate-100 w-2/3 ml-auto p-4 rounded"
                  : "relative bg-blue-600 p-2 rounded text-white"
              )}
            >
              {message.content}
            </Markdown>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex flex-row gap-4">
          <Loader2 size={24} className="animate-spin" /> <p>thinking...</p>
        </div>
      )}
      <ActiveMessage />
      {error && <p className="text-center text-red-600">{error}</p>}
    </div>
  );
}
