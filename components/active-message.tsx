import { useStore } from "@/app/store";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";

export default function ActiveMessage() {
  const { value: currentResponse, isLoading } = useStore(
    (state) => state.currentResponse
  );

  const scrollRef = useRef<null | HTMLDivElement>(null);

  //   TODO: This is broken 😕
  useEffect(() => {
    if (currentResponse && !isLoading) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentResponse, isLoading]);

  if (!currentResponse) return null;

  return (
    <div className="flex flex-row items-start gap-2" ref={scrollRef}>
      <Image src="/images/avatar.png" width={25} height={25} alt="assistant" />
      <div>
        <Markdown className="bg-blue-600 p-2 rounded text-white">
          {currentResponse}
        </Markdown>
      </div>
    </div>
  );
}
