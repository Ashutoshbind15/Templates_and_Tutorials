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
import { revalidatePath } from "next/cache";
import axios from "axios";

const RepoMetadata = ({ repoId }: { repoId: number }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [isMetadata, setIsMetadata] = useState(false);

  console.log(isMetadata);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/metadata/${repoId}`);
        const data = res.data;

        console.log("Metadata: ", data);

        if (res.status === 200) {
          setTitle(data.title);
          setDescription(data.description);
          setUrl(data.url);
          setIsMetadata(true);
        }
      } catch (error) {}
    };

    fetchData();
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            {isMetadata ? "Edit metadata" : "Add metadata"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
                defaultValue="Pedro Duarte"
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
                defaultValue="@peduarte"
                className="col-span-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={async () => {
                console.log("Save changes");

                console.log("Title: ", title);
                console.log("Description: ", description);
                console.log("Url: ", url);

                if (isMetadata) {
                  await axios.put(`/api/metadata/${repoId}`, {
                    title,
                    description,
                    url,
                  });
                } else {
                  await axios.post(`/api/metadata`, {
                    title,
                    description,
                    url,
                    repoId,
                  });
                }

                toast("Changes saved");
                revalidatePath("/editrepo");
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
