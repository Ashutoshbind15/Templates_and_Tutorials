import Image from "next/image";
import { Button } from "./components/uilib/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function Home() {
  return (
    <>
      <main className="p-24 bg-zinc-950 text-white">
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-gray-800 mb-20 flex flex-row justify-around items-center">
          <Image src="/images/hero.webp" alt="hero" width={400} height={200} />
          <div className="text-2xl">
            Tired of building websites for selling templates or courses? <br />
            Need a better way to access the most popular ones?
            <br />
            We got you covered.
          </div>
        </div>

        <div className="min-h-screen bg-gradient-to-bl from-gray-800 to-zinc-950 flex items-center justify-around mb-20 flex-row-reverse">
          <Image
            src={"/images/seller.webp"}
            alt="seller"
            width={400}
            height={200}
          />

          <div>
            <div className="flex flex-col items-center gap-x-4 text-lg gap-y-3 mb-8">
              <div className="flex items-center gap-x-3">
                <CheckCircle />
                <span> Automate private repo access on buyouts </span>
              </div>
              <div className="flex items-center gap-x-3">
                <CheckCircle />
                <span> Add course metadata here itself </span>
              </div>
              <div className="flex items-center gap-x-3">
                <CheckCircle />
                <span> We manage the payments for you </span>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-zinc-950 flex items-center justify-around mb-20">
          <Image
            src={"/images/buyer.webp"}
            alt="buyer"
            width={400}
            height={200}
          />

          <div>
            <div className="flex flex-col items-center gap-x-4 text-lg gap-y-3 mb-8">
              <div> Choose from a bunch of templates </div>
              <div> Get direct access on checkouts </div>
              <div> Get guided by tutorials accompanying the templates </div>
            </div>

            <div className="flex items-center justify-center gap-x-4">
              <Link href={"/repo"}>
                <Button className="bg-white text-black hover:text-white">
                  Start Buying
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
