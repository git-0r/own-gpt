"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Welcome from "@/components/welcome";

type Context = { role: string; content: string }[];

const FormSchema = z.object({
  content: z.string().nonempty({ message: "Required" }),
});

export default function Home() {
  const [context, setContext] = useState<Context>([]);
  const [currentRes, setCurrentRes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<null | HTMLDivElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    form.reset();

    const newContext = [...context];
    if (currentRes) {
      newContext.push({ role: "assistant", content: currentRes });
      setCurrentRes("");
    }
    newContext.push({ role: "user", content: data.content.trim() });
    setContext(newContext);

    try {
      const response = await fetch("http://localhost:11470/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: newContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const decoder = new TextDecoder();
      const reader = response?.body?.getReader();

      // safari doesnt support asyc iterator, using while loop instead
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          // Do something with last chunk of data then exit reader
          return;
        }
        // Otherwise do something here to process current chunk
        const decodedChunk = decoder.decode(value, { stream: true });

        setCurrentRes(
          (prev) => prev + JSON.parse(decodedChunk).message.content
        );
      }
      // Exit when done
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setError(
          error.message || "Something went wrong. Please try again later."
        );
      } else {
        setError("Something went wrong!");
      }
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (currentRes && !isLoading) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentRes, isLoading]);

  return (
    <div className="grid grid-rows-8 h-screen max-w-xl m-auto p-4">
      <div className="row-span-6 overflow-scroll space-y-4">
        {context.length === 0 && !isLoading && (
          <Welcome className="size-1/2 m-auto" />
        )}
        {context.map((message) => (
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
        {isLoading && !currentRes && (
          <div className="flex flex-row gap-4">
            <Loader2 size={24} className="animate-spin" /> <p>thinking...</p>
          </div>
        )}
        {currentRes && (
          <div className="flex flex-row items-start gap-2" ref={scrollRef}>
            <Image
              src="/images/avatar.png"
              width={25}
              height={25}
              alt="assistant"
              className=""
            />
            <div>
              <Markdown className="bg-blue-600 p-2 rounded text-white">
                {currentRes}
              </Markdown>
            </div>
          </div>
        )}
        {error && <p className="text-center text-red-600">{error}</p>}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 row-span-2 border-t"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Start new conversation by sending a message.
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your thoughts here..."
                    className="resize-none bg-white"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="bg-white rounded text-center text-slate-900">
                  Rate limited to 6 requests per minute. Try again after some
                  time in case of failure.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-600/90 text-lg"
            disabled={isLoading}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
