import { getServerSession } from "next-auth/next";
import { options1 } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";

const AddRepoPage = async () => {
  const session = await getServerSession(options1);

  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div>
      <Link
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`}
      >
        Add Repo
      </Link>
      {
        <Link
          href={`https://github.com/apps/tutsandtemps
        /installations/new`}
        >
          Start by giving us access
        </Link>
      }
    </div>
  );
};

export default AddRepoPage;
