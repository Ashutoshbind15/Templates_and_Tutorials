import { getServerSession } from "next-auth/next";
import { options1 } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

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
      <h1>Add Repo</h1>
    </div>
  );
};

export default AddRepoPage;
