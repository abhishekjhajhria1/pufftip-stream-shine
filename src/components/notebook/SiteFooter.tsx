import { Link } from "@tanstack/react-router";
import { SmokeCurl } from "./primitives";

export function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t-2 border-dashed border-ink/30 bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-full border-2 border-ink font-hand text-xl rotate-doodle-3">P</span>
            <span className="font-hand text-3xl text-ink">pufftip</span>
            <SmokeCurl className="h-7 w-5" />
          </div>
          <p className="mt-3 max-w-xs font-label text-sm text-ink-soft">
            crypto tips for streamers — every tip arrives with a smoke on the house. built by night-owls, for night-owls.
          </p>
        </div>
        <div>
          <div className="font-hand text-2xl text-ink">explore</div>
          <ul className="mt-2 space-y-1 font-label text-sm text-ink">
            <li><Link to="/explore" className="hover:text-marker-red">streamers</Link></li>
            <li><Link to="/dashboard" className="hover:text-marker-red">dashboard preview</Link></li>
            <li><Link to="/obs" className="hover:text-marker-red">obs setup</Link></li>
            <li><Link to="/pricing" className="hover:text-marker-red">fees</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-hand text-2xl text-ink">notes</div>
          <p className="mt-2 font-label text-sm text-ink-soft">
            built on solana. no signups required to browse. demo mode means no real money moves until you connect a real wallet.
          </p>
        </div>
      </div>
      <div className="border-t border-dashed border-ink/20 px-6 py-4 text-center font-label text-xs text-ink-soft">
        © {new Date().getFullYear()} pufftip — drawn by hand, mostly. *
      </div>
    </footer>
  );
}
