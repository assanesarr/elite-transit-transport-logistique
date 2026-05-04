// @ts-ignore
const fmt = (n) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

// @ts-ignore
const fmtDate = (s) => {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

function ValidityBadge({ validite } : { validite: string}) {
  if (!validite)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
        —
      </span>
    );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const vDate = new Date(validite);
  // const diff = Math.round((vDate - today) / 86400000);
  const diff = Math.ceil((vDate.getTime() - today.getTime()) / 86400000);

  if (diff < 0)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
        Expiré
      </span>
    );
  if (diff <= 30)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
        {diff}j restants
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
      Valide
    </span>
  );
}

export default function CheckTable({ cheques, onEdit, onDelete }: {  cheques: any[], onEdit: Function, onDelete: Function  }) {
  if (cheques.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="text-4xl mb-3">🗒️</div>
          <p className="text-sm">Aucun chèque enregistré.</p>
          <p className="text-xs mt-1">
            Cliquez sur « Nouveau chèque » pour commencer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 w-24">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 w-28">
                Banque
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 w-28">
                N° chèque
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                Destinataire
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 w-32">
                Montant
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">
                Description
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 w-28">
                Validité
              </th>
              <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cheques.map((c, i) => (
              <tr
                key={i}
                className="hover:bg-slate-50 transition-colors duration-100"
              >
                <td className="px-4 py-3 text-slate-600">{fmtDate(c.date)}</td>
                <td className="px-4 py-3 font-medium text-slate-700">
                  {c.banque}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {c.numero}
                </td>
                <td className="px-4 py-3 text-slate-700">{c.destinataire}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-800 tabular-nums">
                  {fmt(c.montant)}
                  {/* <span className="text-xs font-normal text-slate-400 ml-1">
                    FCFA
                  </span> */}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">
                  {c.description || "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <ValidityBadge validite={c.validite} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(i)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Modifier"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => onDelete(i)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
