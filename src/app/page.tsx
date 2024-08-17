import { HydrateClient } from "~/trpc/server";
import GoogleMapComponent from "./_components/map/map";

export default function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#D3B1C2] to-[#C197D2]">
        {/* Map container taking full viewport height */}
        <div className="w-full h-full">
          <GoogleMapComponent />
        </div>
      </main>
    </HydrateClient>
  );
}
