"use client";

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const Player = ({ url }: { url: string }) => {
  return (
    <ReactPlayer
      url={url}
      controls
      width={"100%"}
      height={"560px"}
      onEnded={() => console.log("video ended")}
    />
  );
};

export default Player;
