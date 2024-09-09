import { HydrateClient } from "~/trpc/server";
import GoogleMapComponent from "./_components/map/map";

export default function Home() {
  return (
    <HydrateClient>
      <main className="items-center justify-center bg-gradient-to-b from-[#D3B1C2] to-[#C197D2]">
        {/* Map container taking full viewport height */}
        <div className="w-full h-[calc(100dvh)]">
          <GoogleMapComponent />
        </div>
      </main>
    </HydrateClient>
  );
}
