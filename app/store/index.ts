import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface State {
  chat: {
    messages: Message[];
    addMessage: (newMessage: Message) => void;
    error: string;
    setError: (error: string) => void;
  };
  currentResponse: {
    value: string;
    set: (value: string) => void;
    reset: () => void;
    append: (chunk: string) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
  };
  api: {
    url: string;
    setURL: (url: string) => void;
  };
}

export const useStore = create<State>()(
  devtools((set) => ({
    chat: {
      messages: [],
      addMessage: (newMessage) =>
        set((state) => ({
          chat: {
            ...state.chat,
            messages: [...state.chat.messages, newMessage],
          },
        })),
      error: "",
      setError: (error) => set((state) => ({ chat: { ...state.chat, error } })),
    },
    currentResponse: {
      value: "",
      set: (value) =>
        set((state) => ({
          currentResponse: { ...state.currentResponse, value },
        })),
      reset: () =>
        set((state) => ({
          currentResponse: { ...state.currentResponse, value: "" },
        })),
      append: (chunk) =>
        set((state) => ({
          currentResponse: {
            ...state.currentResponse,
            value: state.currentResponse.value + chunk,
          },
        })),
      isLoading: false,
      setIsLoading: (value) =>
        set((state) => ({
          currentResponse: { ...state.currentResponse, isLoading: value },
        })),
    },
    api: {
      url: "http://localhost:11434/api/chat",
      setURL: (url) =>
        set((state) => ({ ...state, api: { ...state.api, url } })),
    },
  }))
);
