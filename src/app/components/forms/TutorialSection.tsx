"use client";

import { useEffect, useState } from "react";
import { Button } from "../uilib/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../uilib/ui/dialog";
import { Input } from "../uilib/ui/input";
import { Label } from "../uilib/ui/label";
import { UploadButton } from "@/app/lib/uploadthing";

import { toast } from "sonner";
import axios from "axios";

const TutorialSectionForm = ({
  repoId,
  setSections,
}: {
  repoId: string;
  setSections: any;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add section</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] text-black">
          <DialogHeader>
            <DialogTitle>New section</DialogTitle>

            <DialogDescription>
              Create a new section for your tutorial here.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                placeholder="xyz section"
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                placeholder="section description"
                className="col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <UploadButton
              endpoint="videoUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                setUrl(res[0].url);
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
              className="ut-button:bg-zinc-950 ut-readying:bg-zinc-950"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={async () => {
                toast.loading("saving changes", {
                  id: "saving",
                  duration: 10000,
                });

                const { data } = await axios.post(`/api/tutorial/section`, {
                  title,
                  description,
                  url,
                  repoId,
                });

                setSections((sec: any) => [...sec, data]);

                toast.dismiss("saving");
                toast.success("Changes saved");

                setOpen(false);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorialSectionForm;
