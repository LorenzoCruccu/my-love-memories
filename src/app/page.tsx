import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import dynamic from "next/dynamic";

export default async function Home() {
  const allMarkers = await api.marker.getAllMarkers();
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  const Map = dynamic(() => import('~/app/_components/map/map'), {
    loading: () => <p>A map is loading...</p>,
    ssr: false
  });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Hide <span className="text-[hsl(280,100%,70%)]">and</span> Hit
          </h1>
            <div className="bg-white-700 mx-auto my-5 w-full h-[600px]">
              <Map 
					/>
            </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {allMarkers
                ? allMarkers.map((item, index) => (
                    <span key={index}>{item.title}</span>
                  ))
                :   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
								<p>Loading...</p>
							</div>}
            </p>

            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
          </div>

          {session?.user && <LatestPost />}
        </div>
      </main>
    </HydrateClient>
  );
}
