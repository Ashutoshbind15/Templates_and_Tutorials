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
import { useRouter } from "next/navigation";

const RepoMetadata = ({ data, isMetadata, repoId }: any) => {
  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [url, setUrl] = useState(data?.thumbnail);
  const [cost, setCost] = useState(data?.cost);
  const [metaExists, setMetaExists] = useState(isMetadata);
  const [open, setOpen] = useState(false);

  const [tagsText, setTagsText] = useState("");
  const [tags, setTags] = useState(data?.tags);

  const removeTag = (tag: string) => {
    setTags(tags.filter((t: any) => t !== tag));
  };

  const rtr = useRouter();

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tagsText" className="text-right">
                tagsText
              </Label>
              <Input
                id="tagsText"
                defaultValue="0"
                className="col-span-3"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Add tags here"
              />
              <Button
                onClick={() => {
                  setTags([...tags, tagsText]);
                  setTagsText("");
                }}
              >
                Add
              </Button>
            </div>

            <div>
              <Label htmlFor="tags" className="text-right">
                tags
              </Label>
              <div className="flex gap-2 flex-wrap">
                {tags?.map((tag: string) => (
                  <div
                    key={tag}
                    className="flex items-center bg-gray-200 p-2 rounded-md space-x-2"
                  >
                    <span className="text-gray-700">{tag}</span>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full focus:outline-none"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
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
              className="ut-button:bg-zinc-950 ut-readying:bg-zinc-950 w-1/3 self-start ml-3"
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
                    const { data } = await axios.put(
                      `/api/metadata/${repoId}`,
                      {
                        title,
                        description,
                        url,
                        cost,
                        tags,
                      }
                    );

                    setCost(data.cost);
                    setDescription(data.description);
                    setTitle(data.title);
                  } else {
                    const { data } = await axios.put(
                      `/api/metadata/${repoId}`,
                      {
                        title,
                        description,
                        cost,
                        tags,
                      }
                    );

                    setCost(data.cost);
                    setDescription(data.description);
                    setTitle(data.title);
                  }
                } else {
                  const { data } = await axios.post(`/api/metadata`, {
                    title,
                    description,
                    url,
                    cost,
                    repoId,
                    tags,
                  });

                  setCost(data.cost);
                  setDescription(data.description);
                  setTitle(data.title);
                  setMetaExists(true);
                  setOpen(false);
                }

                toast.dismiss("saving");
                toast.success("Changes saved");

                rtr.push(`/repo/${repoId}`);
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
