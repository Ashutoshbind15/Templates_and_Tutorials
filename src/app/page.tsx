import SignInC from "./components/auth/SignInC";
import SignOut from "./components/auth/SingOut";
import PostForm from "./components/forms/Post";
import { getServerSession } from "next-auth/next";
import prisma from "./lib/prisma";
import { options1 } from "./api/auth/[...nextauth]/options";
import Post from "./components/posts/Post";
import { App } from "octokit";
import Repo from "./components/repos/Repo";

export default async function Home() {
  const posts = await prisma.post.findMany({});
  const sess = await getServerSession(options1);
  const repos = await prisma.repo.findMany({
    include: {
      owner: true,
    },
  });
  console.log(repos);

  let data;

  if (sess && sess.user) {
    const githubacc = await prisma.account.findMany({
      where: {
        userId: sess.user.id,
        provider: "github",
      },
    });

    if (githubacc.length > 0) {
      const installationId = githubacc[0].installationIds[0];

      const app = new App({
        appId: process.env.GITHUB_APP_ID as string,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY as string,
      });

      let octo;
      if (installationId?.length)
        octo = await app.getInstallationOctokit(+installationId);

      if (installationId) {
        const res = await octo?.request("GET /installation/repositories");
        data = res?.data;
        // console.log(data?.repositories);
      } else {
        console.log("err");
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Prisma and nextauth</div>
      {posts.map((post: any) => (
        <Post
          description={post.content || "desc"}
          title={post.title}
          id={post.id.toString()}
          key={post.id}
        />
      ))}

      <div className="p-2 border-2 border-white">
        {repos.map((repo: any) => (
          <Repo repo={repo} key={repo.id} />
        ))}
      </div>

      <PostForm />
      <SignInC />
      <SignOut />
    </main>
  );
}
