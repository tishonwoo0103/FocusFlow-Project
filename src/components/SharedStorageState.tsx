import { RefreshCw, UploadCloud } from "lucide-react";
import type { CollaboratorId } from "@/types";

type SharedStorageStateProps = {
  actor: CollaboratorId;
  setActor: (actor: CollaboratorId) => void;
  error: string | null;
  needsBootstrap: boolean;
  pendingKeys: Set<string>;
  retry: () => void;
  bootstrap: () => Promise<void>;
};

export function SharedStorageState({ actor, setActor, error, needsBootstrap, pendingKeys, retry, bootstrap }: SharedStorageStateProps) {
  return (
    <div className="space-y-3">
      <label className="flex min-h-10 items-center gap-3">
        <span className="label whitespace-nowrap">Updating as</span>
        <select className="select w-auto min-w-28" value={actor} onChange={(event) => setActor(event.target.value as CollaboratorId)}>
          <option value="tishon">Tishon</option>
          <option value="mia">Mia</option>
        </select>
      </label>

      {needsBootstrap ? (
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <p className="text-sm font-bold text-slate-950">Shared tasks need their one-time setup.</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">Tishon should import the current schedule and browser progress before Mia starts.</p>
          <button className="btn mt-3" disabled={actor !== "tishon" || pendingKeys.has("bootstrap")} onClick={() => void bootstrap().catch(() => undefined)}>
            <UploadCloud aria-hidden="true" className="h-4 w-4" />
            {pendingKeys.has("bootstrap") ? "Importing..." : "Import Local Tasks"}
          </button>
        </div>
      ) : null}

      {error ? (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-red-800">{error === "Shared storage unavailable" ? error : "Shared task update failed"}</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
          <button className="btn-secondary shrink-0" onClick={retry}>
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
            Retry
          </button>
        </div>
      ) : null}
    </div>
  );
}
