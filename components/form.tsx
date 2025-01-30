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
import { useStore } from "@/app/store";

const FormSchema = z.object({
  content: z.string().nonempty({ message: "Required" }),
});

export default function MessageForm() {
  const apiURL = useStore((state) => state.api.url);
  const { messages, addMessage, setError } = useStore((state) => state.chat);
  const { isLoading, setIsLoading, reset, set } = useStore(
    (state) => state.currentResponse
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { content: "" },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    form.reset();

    const allMessages = [...messages];
    allMessages.push({ role: "user", content: data.content.trim() });
    addMessage({ role: "user", content: data.content.trim() });

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: allMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const decoder = new TextDecoder();
      const reader = response?.body?.getReader();
      let content = "";

      // safari doesnt support asyc iterator, using while loop instead
      while (true) {
        const { done, value } = await reader!.read();
        if (done) {
          // Do something with last chunk of data then exit reader
          addMessage({ role: "assistant", content });
          reset();

          return;
        }
        // Otherwise do something here to process current chunk
        const decodedChunk = decoder.decode(value, { stream: true });
        content += JSON.parse(decodedChunk).message.content;
        set(content);
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

  return (
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
                Rate limited to 6 requests per minute. Try again after some time
                in case of failure.
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
  );
}
