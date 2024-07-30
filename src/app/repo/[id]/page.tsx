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
import React, { useEffect } from "react";

const RepoPage = ({ params }: { params: { id: string } }) => {
  const [repo, setRepo] = React.useState<any>(null);
  const [selectedSection, setSelectedSection] = React.useState(0);
  const [sections, setSections] = React.useState([]);

  useEffect(() => {
    fetch(`/api/metadata/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setRepo(data);
        setSections(data.sections);
      });
  }, [params.id]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-screen flex items-center"
    >
      <ResizablePanel className="px-6 gap-y-4">
        <span className="text-lg font-semibold">{repo?.title}</span>

        {sections?.length && (
          <Player
            url={(sections[selectedSection] as any)?.url || repo?.repo?.url}
          />
        )}

        {!sections?.length && <div className="h-96">No sections found</div>}

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
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="text-black" />

      <ResizablePanel>
        <div className="flex flex-col items-center h-screen">
          <div className="border-b-2 border-white flex items-center justify-between px-3 py-2 mb-4 w-full">
            <TutorialSectionForm repoId={params.id} setSections={setSections} />
            <Button>Action</Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sections?.map((section: any, idx: number) => (
              <div
                key={section.id}
                className={`flex items-center justify-between px-3 py-2 ${
                  selectedSection === idx ? "bg-gray-800" : ""
                }`}
                onClick={() => setSelectedSection(idx)}
              >
                <span>{section.title}</span>
                <span>{section.url}</span>
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default RepoPage;
