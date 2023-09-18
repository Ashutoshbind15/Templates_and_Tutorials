import SignInC from "./components/auth/SignInC";
import SignOut from "./components/auth/SingOut";
import PostForm from "./components/forms/Post";
import { getServerSession } from "next-auth/next";
import prisma from "./lib/prisma";
import { options1 } from "./api/auth/[...nextauth]/options";
import Post from "./components/posts/Post";

export default async function Home() {
  const posts = await prisma.post.findMany({});
  console.log(posts);
  const sess = await getServerSession(options1);
  console.log(sess);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Prisma and nextauth</div>
      {posts.map((post) => (
        <Post
          description={post.content || "desc"}
          title={post.title}
          id={post.id.toString()}
          key={post.id}
        />
      ))}
      <PostForm />
      <SignInC />
      <SignOut />
    </main>
  );
}
