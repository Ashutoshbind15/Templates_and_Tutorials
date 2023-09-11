import { options1 } from "./api/auth/[...nextauth]/options";
import SignInC from "./components/auth/SignInC";
import { getServerSession } from "next-auth/next";
import prisma from "./lib/prisma";
import SignOut from "./components/auth/SingOut";
import Post from "./components/posts/Post";
import PostForm from "./components/forms/Post";
import { App } from "octokit";

const getPosts = async () => {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });
  const json = await res.json();
  return json;
};

export default async function Home() {
  const posts = await getPosts();
  await prisma.post.deleteMany({});
  const sess = await getServerSession(options1);

  if (sess && sess.user) {
    const githubacc = await prisma.account.findMany({
      where: {
        userId: sess.user.id,
        provider: "github",
      },
    });

    if (githubacc.length > 0) {
      const installationId = githubacc[0].installationId;

      const app = new App({
        appId: process.env.GITHUB_APP_ID as string,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
      });

      let octo;
      if (installationId?.length)
        octo = await app.getInstallationOctokit(+installationId);

      try {
        if (installationId) {
          const res = await octo?.request("GET /installation/repositories");
          console.log(res?.data?.total_count);
        }
      } catch (error) {
        console.log("Error in auth, old refresh token");
        console.log(error);
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Prisma and nextauth</div>
      {posts.map((post: any) => (
        <Post id={post.id} title={post.title} description={post.content} />
      ))}

      <PostForm />
      <SignInC />
      <SignOut />
    </main>
  );
}
