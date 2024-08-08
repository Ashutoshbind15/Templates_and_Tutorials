import prisma from "@/app/lib/prisma";
import { Card, CardContent, CardTitle } from "../uilib/ui/card";
import Image from "next/image";

const RepoPreview = async ({ repo }: any) => {
  return (
    <Card className="p-2 gap-y-4">
      <CardTitle className="text-center mb-4">{repo?.title}</CardTitle>
      <CardContent className="flex flex-col items-center mb-4">
        <Image
          src={repo?.thumbnail}
          alt={repo?.title}
          width={400}
          height={200}
        />
        <div>{repo?.description}</div>
      </CardContent>
    </Card>
  );
};

export default RepoPreview;
