import { options1 } from "./api/auth/[...nextauth]/options";
import SignInC from "./components/auth/SignInC";
import { getServerSession } from "next-auth/next";
import prisma from "./lib/prisma";
import { signOut } from "next-auth/react";
import SignOut from "./components/auth/SingOut";
import Post from "./components/posts/Post";
import PostForm from "./components/forms/Post";

const getPosts = async () => {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });
  const json = await res.json();
  return json;
};

export default async function Home() {
  const posts = await getPosts();
  console.log(posts);
  await prisma.post.deleteMany({});
  const sess = await getServerSession(options1);

  if (sess && sess.user) {
    const ghtok = await prisma.account.findMany({
      where: {
        userId: sess.user.id,
        provider: "github",
      },
    });

    if (ghtok.length > 0) {
      const accessToken = ghtok[0].access_token;
      console.log(accessToken);
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
