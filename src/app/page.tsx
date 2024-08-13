import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import GoogleMapComponent from "./_components/map/map";
import { Button } from "~/components/ui/button";

export default async function Home() {
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 pb-6 pt-16">
          <h1 className="font-extrabold tracking-tight text-white lg:text-[5rem]">
            Hide <span className="text-[hsl(280,100%,70%)]">and</span> Hit
          </h1>
          <h2 className="font-extrabold tracking-tight text-white lg:text-[2rem]">
            <span className="text-[hsl(280,100%,70%)]">Fuck around</span> and{" "}
            <span className="text-[hsl(280,100%,70%)]">you will find out</span>
          </h2>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Button
                variant="default"
                className="rounded-lg bg-purple-600 px-8 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:bg-purple-700"
              >
                <Link
                  href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  className="no-underline"
                >
                  {session ? "Sign out" : "Sign in"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Ensure the map container has sufficient height */}
          <div className="mx-auto my-5 h-[600px] w-full sm:h-[700px] lg:h-[800px]">
            <GoogleMapComponent />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
