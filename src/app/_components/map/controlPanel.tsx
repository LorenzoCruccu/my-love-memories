import { type Session } from "next-auth";
import Link from "next/link";
import * as React from "react";
import { Button } from "~/components/ui/button";

function ControlPanel(session:Session) {

  return (
    <div className="control-panel">
      <h3>Info</h3>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        <Button variant={"outline"}>
          {" "}
          {session ? "Sign out" : "Sign in to add markers"}
        </Button>
      </Link>
      <p></p>
    </div>
  );
}

export default React.memo(ControlPanel);
