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

const RepoMetadata = ({ data, isMetadata, repoId }: any) => {
  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [url, setUrl] = useState(data?.thumbnail);
  const [cost, setCost] = useState(data?.cost);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>{isMetadata ? "Edit metadata" : "Add metadata"}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] text-black">
          <DialogHeader>
            <DialogTitle>
              {isMetadata ? "Edit metadata" : "Add metadata"}
            </DialogTitle>

            <DialogDescription>
              Make changes to your profile here. Click save when youre done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                title
              </Label>
              <Input
                id="title"
                placeholder="xyz course"
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                description
              </Label>
              <Input
                id="description"
                placeholder="course description"
                className="col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Cost
              </Label>
              <Input
                id="cost"
                defaultValue="0"
                className="col-span-3"
                value={cost}
                onChange={(e) => setCost(+e.target.value)}
              />
            </div>

            <UploadButton
              endpoint="imageUploader"
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

                if (isMetadata) {
                  if (url.length) {
                    await axios.put(`/api/metadata/${repoId}`, {
                      title,
                      description,
                      url,
                      cost,
                    });
                  } else {
                    await axios.put(`/api/metadata/${repoId}`, {
                      title,
                      description,
                      cost,
                    });
                  }
                } else {
                  await axios.post(`/api/metadata`, {
                    title,
                    description,
                    url,
                    cost,
                    repoId,
                  });
                }

                toast.dismiss("saving");
                toast.success("Changes saved");
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

export default RepoMetadata;
