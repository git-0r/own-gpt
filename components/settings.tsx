import { useStore } from "@/app/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsIcon } from "lucide-react";
import { ChangeEvent } from "react";

export default function Settings() {
  const { url, setURL } = useStore((state) => state.api);
  const setServerUrl = (e: ChangeEvent<HTMLInputElement>) => {
    setURL(e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="absolute top-0 right-0">
        <Button
          variant="outline"
          className="rounded-full p-2.5 z-10"
          title="settings"
        >
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-grotesk">
        <DialogHeader>
          <DialogTitle>Edit settings</DialogTitle>
          <DialogDescription>
            Make changes to your settings here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              URL
            </Label>
            <Input
              id="name"
              value={url}
              placeholder="http://localhost:11434/api/chat"
              className="col-span-3"
              onChange={setServerUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
