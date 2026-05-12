import { AVATAR_BG } from "@/app/data";
import { initials } from "@/lib/utils";




export function PriorityBadge({ priorite }: { priorite: string }) {
  const cfg: Record<string, string> = {
    urgente: "bg-rose-100 text-rose-700 border-rose-200",
    haute:   "bg-orange-100 text-orange-700 border-orange-200",
    normale: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${cfg[priorite]||cfg.normale}`}>{priorite || 'normale'}</span>;
}

export function AvatarCircle({ name, idx, size="w-9 h-9", text="text-sm" }: { name: string; idx: number; size?: string; text?: string }) {
  const c = AVATAR_BG[idx % AVATAR_BG.length];
  return <div className={`${size} ${c} rounded-xl flex items-center justify-center font-bold ${text} shrink-0`}>{initials(name)}</div>;
}

export const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: any[]; label: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color || p.fill }} className="flex justify-between gap-3">
          <span>{p.name}</span><span className="font-semibold">{p.value?.toLocaleString("fr-FR")}</span>
        </div>
      ))}
    </div>
  );
};
