"use client";

import TutorialSectionForm from "@/app/components/forms/TutorialSection";
import Player from "@/app/components/tutorials/Player";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/uilib/ui/avatar";
import { Button } from "@/app/components/uilib/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/app/components/uilib/ui/resizable";
import { UploadButton } from "@/app/lib/uploadthing";
import { VideoOffIcon } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RepoPage = ({ params }: { params: { id: string } }) => {
  const [repo, setRepo] = React.useState<any>(null);
  const [selectedSection, setSelectedSection] = React.useState(0);
  const [sections, setSections] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [ratingDescription, setRatingDescription] = React.useState("");
  const [isOwner, setIsOwner] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  console.log("isOwner", isOwner);

  const rtr = useRouter();

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  useEffect(() => {
    fetch(`/api/metadata/${params.id}`)
      .then((res) => {
        if (res.redirected) {
          const url = new URL(res.url);
          return rtr.push(url.pathname);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (!data?.error) {
          setRepo(data?.metadata);
          setSections(data?.metadata?.sections);
          setIsOwner(data?.isOwner);
        } else {
          toast.error(data?.error);
          rtr.push("/repo");
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.error("Unauthorized for this repo");
          rtr.push("/repo");
        }

        console.log("Error: ", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, rtr]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen flex items-center"
    >
      <ResizablePanel className="px-6 gap-y-4">
        <span className="text-lg font-semibold">{repo?.title}</span>

        {sections?.length ? (
          <Player
            url={(sections[selectedSection] as any)?.url || repo?.repo?.url}
          />
        ) : null}

        {!sections?.length && (
          <div className="h-96 flex flex-col items-center justify-center gap-y-8">
            <div>No sections found</div>
            <VideoOffIcon className="h-16 w-16" />
          </div>
        )}

        <div className="px-3 border-b-2 border-white mt-4">
          <div className="">
            <p>{repo?.description}</p>

            <div className="flex items-center">
              <span className="flex-1">
                {repo?.repo?.owner?.name} ({repo?.repo?.owner?.email})
              </span>

              <Avatar className="mb-3">
                <AvatarImage src={repo?.repo?.owner?.image} />
                <AvatarFallback>{repo?.repo?.owner?.name[0]}</AvatarFallback>
              </Avatar>
            </div>

            {/* <Dialog>
              <DialogTrigger asChild>
                <Button>Rate</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px] text-black">
                <DialogHeader>
                  <DialogTitle>Rate</DialogTitle>
                  <DialogDescription>
                    Rate the materials and the repo template
                  </DialogDescription>
                </DialogHeader>

                <div className="my-3 gap-y-4 flex flex-col items-center border-y-2 border-gray-400 py-6">
                  <Rating onClick={handleRating} />

                  <Input
                    value={ratingDescription}
                    onChange={(e) => setRatingDescription(e.target.value)}
                    placeholder="Add a description"
                  />
                </div>

                <Button
                  onClick={() => {
                    console.log("Rating: ", rating);
                    console.log("Description: ", ratingDescription);
                  }}
                >
                  Submit
                </Button>
              </DialogContent>
            </Dialog> */}
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="text-black" />

      <ResizablePanel>
        <div className="flex flex-col items-center h-screen">
          <div className="border-b-2 border-white flex items-center justify-between px-3 py-2 mb-4 w-full">
            {isOwner ? (
              <TutorialSectionForm
                repoId={params.id}
                setSections={setSections}
              />
            ) : (
              <p>Sections</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto w-full px-3">
            {sections?.map((section: any, idx: number) => (
              <div
                key={section.id}
                className={`flex items-center justify-between px-3 py-4 w-full border-y-2 border-gray-500 mb-2 ${
                  selectedSection === idx ? "bg-gray-800" : ""
                }`}
                onClick={() => setSelectedSection(idx)}
              >
                <div className="flex flex-col flex-1">
                  <span className="font-semibold">{section.title}</span>
                  <span className="text-sm">{section.description}</span>
                </div>

                {!section?.sectionNotesUrl?.length ? (
                  isOwner ? (
                    <div className="flex flex-col items-center">
                      <span className="my-2 underline">Add notes below</span>
                      <UploadButton
                        endpoint="notesUploader"
                        input={{ sid: section.id }}
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          console.log("Files: ", res);

                          // Update the section with the notes

                          const updatedSections = sections.map((s: any) => {
                            if (s.id === section.id) {
                              return {
                                ...s,
                                sectionNotesUrl: res[0].url,
                              };
                            }

                            return s;
                          });

                          setSections(updatedSections as any);
                          toast.success("Notes uploaded successfully");
                        }}
                      />
                    </div>
                  ) : null
                ) : (
                  <Button asChild>
                    <a
                      href={section?.sectionNotesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View notes
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RepoPage;
