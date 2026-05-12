// @ts-nocheck

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner';
import { Commit } from '@/lib/utils';
import { useAgentsStore } from '@/store/agentStore';
import { useAlertStore } from '@/store/alertStore';
import { useEmployesStore } from '@/store/useEmployesStore';
import { useState } from 'react'
import { toast } from 'sonner';

const USERS_DB = [
  { id: 1, nom: "Moussa Diaw", prenom: "Moussa", email: "admin@transitpro.sn", password: "admin123", role: "Administrateur", poste: "Transitaire senior", avatar: "MD", actif: true },
  { id: 2, nom: "Awa Sarr", prenom: "Awa", email: "awa@transitpro.sn", password: "awa123", role: "Transitaire", poste: "Transitaire", avatar: "AS", actif: true },
  { id: 3, nom: "Ibou Faye", prenom: "Ibou", email: "ibou@transitpro.sn", password: "ibou123", role: "Agent douanier", poste: "Agent douanier", avatar: "IF", actif: true },
  { id: 4, nom: "Rokhaya Dieng", prenom: "Rokhaya", email: "rokhaya@transitpro.sn", password: "rok123", role: "Comptable", poste: "Comptable", avatar: "RD", actif: false },
];

export default function UsersConfig() {
 const users = useEmployesStore((state) => state.employes)
  const [loading, setLoading] = useState(false)
  const AlertOpen = useAlertStore(s => s.open)

  const [personnel, setPersonnel] = useState<any[]>(users.map(u => ({
    ...u, dept: "Transit", adresse: "", dateEmbauche: "", note: "",
  })));
  const EMPTY_PERS: any = {
    id: null, prenom: "", nom: "", poste: "", role: "Transitaire", dept: "Transit", tel: "", email: "", avatar: "", password: "", adresse: "", dateEmbauche: "", actif: true, note: "",
    name: ''
  };

  const [form, setForm] = useState<any>(EMPTY_PERS);
  const [editId, setEditId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showForm, setShowForm] = useState(false);
  const [searchP, setSearchP] = useState("");

  const ROLES_LIST = ["Administrateur", "Transitaire", "Agent douanier", "Comptable", "Commercial", "Directeur", "Stagiaire"];
  const POSTES_LIST = ["Transitaire senior", "Transitaire", "Agent douanier", "Comptable", "Commercial", "DG", "DGA", "Secrétaire", "Chauffeur", "Coursier", "Stagiaire"];
  const DEPT_LIST = ["Direction", "Transit", "Douane", "Finance", "Commercial", "Logistique", "RH", "Informatique"];



  const filteredP = personnel.filter(p =>
    !searchP || `${p.prenom} ${p.nom} ${p.poste} ${p.role}`.toLowerCase().includes(searchP.toLowerCase())
  );

// Fonction pour calculer l'avatar à partir du nom de l'entreprise
const computeAvatarFromName = (nom: string): string => {
  // Sépare le nom en mots et prend la première lettre des 2 premiers mots
  const words = nom.trim().split(/\s+/)
  if (words.length === 1) {
    // Si un seul mot, prend les 2 premières lettres
    return words[0].substring(0, 2).toUpperCase()
  }
  // Sinon, prend la première lettre des 2 premiers mots
  return (words[0][0] + words[1][0]).toUpperCase()
}

  const openAdd = () => {
    setForm({ ...EMPTY_PERS });
    setEditId(null); setErrors({});
    setShowForm(true);
    setTimeout(() => document.getElementById("pers-form-top")?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const openEdit = (p: any) => {
    setForm({ ...p });
    setEditId(p.id);
    setErrors({});
    setShowForm(true);
    setTimeout(() => document.getElementById("pers-form-top")?.scrollIntoView({ behavior: "smooth" }), 100);
  };
  const cancelForm = () => { setShowForm(false); setForm(EMPTY_PERS); setEditId(null); setErrors({}); };

  const setF = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

  const validate = () => {
    const e: { [key: string]: string } = {};
    if (!form.name.trim()) e.name = "Requis";
    // if (!form.nom.trim()) e.nom = "Requis";
    if (!form.poste.trim()) e.poste = "Requis";
    if (!form.tel) e.tel = "Requis";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide";
    const dupEmail = personnel.some(p => p.email === form.email.trim() && p.id !== editId && form.email.trim());
    if (dupEmail) e.email = "Email déjà utilisé";
    return e;
  };

  const submitForm = async () => {
    setLoading(true)
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); setLoading(false); return; }
    const avatar = form.avatar || computeAvatarFromName(form.name);
    const saved = { ...form, avatar, prenom: form.prenom.trim(), nom: form.nom.trim() };
    if (editId !== null) {
      await Commit("/api/users",
        { ...saved, id: editId, name: saved.prenom + " " + saved.nom }
      );
      setPersonnel(prev => prev.map(p => p.id === editId ? { ...saved, id: editId } : p));
    } else {
      const ref = await Commit("/api/users", saved);
      setPersonnel(prev => [...prev, { ...saved, id: ref.data.ref }]);
    }
    setLoading(false)
    cancelForm();
  };

  const toggleActif = (id: string | null) => {
    personnel.map(async (pr) => pr.id === id ? await Commit("/api/users", { ...pr, actif: !pr.actif }) : null)
    setPersonnel(prev => prev.map(p => p.id === id ? { ...p, actif: !p.actif } : p));
  }


  const deletePers = async (d: any) => {
    const res = await AlertOpen({ message: `Supprimer "${d.prenom} ${d.nom}"` })
    if (!res) return

    if (!d.id) return

    const r = await Delete(d.id)
    if (!r.ok) return toast.error("Error " + (await r.json()).message)

    setPersonnel(prev => prev.filter(p => p.id !== d.id));
  };

  const AVATAR_PALETTE = [
    "bg-blue-100 text-blue-700", "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700", "bg-indigo-100 text-indigo-700",
  ];


  return (
    <div className="space-y-5">
      {/* ══ Header ══ */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Informations personnelles</h2>
          <p className="text-slate-400 text-xs mt-0.5">{personnel.length} personnel(s) · {personnel.filter(p => p.actif).length} actifs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input value={searchP} onChange={e => setSearchP(e.target.value)}
              placeholder="Rechercher…"
              className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 w-44 bg-white" />
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <span className="text-base leading-none">＋</span>
            Nouveau personnel
          </button>
        </div>
      </div>

      {/* ══ Grille des personnel ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredP.map((p, i) => (
          <Card key={p.id} className={`rounded-2xl shadow-sm transition-all group hover:shadow-md ${!p.actif ? "opacity-60" : ""} border-slate-100`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 ${AVATAR_PALETTE[i % AVATAR_PALETTE.length]}`}>
                    {p.avatar || computeAvatarFromName(p.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm leading-tight">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.poste}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{p.role}</span>
                      {p.dept && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">{p.dept}</span>}
                    </div>
                  </div>
                </div>
                {/* Actif toggle */}
                <button onClick={() => p.role !== "admin" && toggleActif(p.id)}
                  className={`shrink-0 w-10 h-5 rounded-full transition-all relative mt-1 ${p.actif ? "bg-emerald-500" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.actif ? "left-5" : "left-0.5"}`} />
                </button>
              </div>

              {/* Infos contact */}
              <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                {p.tel && <div className="flex items-center gap-2"><span>📞</span><span>{p.tel}</span></div>}
                {p.email && <div className="flex items-center gap-2"><span>✉</span><span className="truncate">{p.email}</span></div>}
                {p.adresse && <div className="flex items-center gap-2"><span>📍</span><span className="truncate">{p.adresse}</span></div>}
                {p.dateEmbauche && <div className="flex items-center gap-2"><span>📅</span><span>Embauché le {p.dateEmbauche}</span></div>}
              </div>

              {p.note && (
                <p className="text-xs text-slate-400 italic border-l-2 border-slate-200 pl-2 mb-3 line-clamp-2">{p.note}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition-colors">
                  ✏️ Modifier
                </button>
                <button onClick={() => deletePers(p)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 flex items-center justify-center text-sm transition-colors"
                  title="Supprimer">🗑</button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredP.length === 0 && (
          <div className="col-span-3 py-16 text-center">
            <p className="text-4xl mb-3">👤</p>
            <p className="text-slate-500 font-medium mb-1">Aucun personnel trouvé</p>
            <p className="text-slate-400 text-sm mb-4">Ajoutez votre premier membre du personnel</p>
            <button onClick={openAdd} className="text-sm font-bold px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors">
              + Ajouter un personnel
            </button>
          </div>
        )}
      </div>

      {/* ══ Formulaire d'ajout / édition ══ */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className='rounded-2xl p-0 no-scrollbar max-h-screen overflow-y-auto sm:max-w-4xl'>
            <Card id="pers-form-top" className={`rounded-2xl shadow-md border-2 transition-all ${editId !== null ? "border-blue-300 bg-blue-50/20" : "border-amber-300 bg-amber-50/20"}`}>
              <CardHeader className="pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_PALETTE[(personnel.length) % AVATAR_PALETTE.length]}`}>
                      {form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??"}
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-800">
                        {editId !== null
                          ? `Modifier : ${form.prenom} ${form.nom}`
                          : "Nouveau personnel"}
                      </CardTitle>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {editId !== null ? "Mettre à jour les informations" : "Remplissez le formulaire d'inscription"}
                      </p>
                    </div>
                  </div>
                  {/* <button onClick={cancelForm}
                    className="text-slate-400 hover:text-slate-700 text-xl transition-colors leading-none" title="Fermer">
                      ✕</button> */}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* ── Colonne 1 : Identité ── */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">1</span>
                      Identité
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Prénom *</label>
                        <Input value={form.prenom} onChange={e => setF("prenom", e.target.value)}
                          placeholder="ex: Aminata"
                          className={`rounded-xl ${errors.prenom ? "border-rose-400" : ""}`} />
                        {errors.prenom && <p className="text-xs text-rose-500 mt-1">⚠ {errors.prenom}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nom *</label>
                        <Input value={form.nom} onChange={e => setF("nom", e.target.value)}
                          placeholder="ex: Diallo"
                          className={`rounded-xl ${errors.nom ? "border-rose-400" : ""}`} />
                        {errors.nom && <p className="text-xs text-rose-500 mt-1">⚠ {errors.nom}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Poste *</label>
                      <Select value={form.poste} onValueChange={v => setF("poste", v)}>
                        <SelectTrigger className={`w-full rounded-xl ${errors.poste ? "border-rose-400" : ""}`}><SelectValue placeholder="Sélectionner un poste…" /></SelectTrigger>
                        <SelectContent>
                          {POSTES_LIST.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                          <SelectItem value="__custom__">Autre (saisir manuellement)</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.poste === "__custom__" && (
                        <Input className="rounded-xl mt-2" placeholder="Saisir le poste…"
                          onChange={e => setF("poste", e.target.value)} />
                      )}
                      {errors.poste && <p className="text-xs text-rose-500 mt-1">⚠ {errors.poste}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Rôle / Accès</label>
                        <Select value={form.role} onValueChange={v => setF("role", v)}>
                          <SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>{ROLES_LIST.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Département</label>
                        <Select value={form.dept} onValueChange={v => setF("dept", v)}>
                          <SelectTrigger className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>{DEPT_LIST.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date d'embauche</label>
                        <Input type="date" value={form.dateEmbauche} onChange={e => setF("dateEmbauche", e.target.value)} className="rounded-xl text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                          Initiales avatar
                        </label>
                        <div className="flex items-center gap-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_PALETTE[(personnel.length) % AVATAR_PALETTE.length]}`}>
                            {form.avatar || (form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??")}
                          </div>
                          <Input maxLength={2}
                            value={form.avatar}
                            onChange={e => setF("avatar", e.target.value.toUpperCase())}
                            placeholder={form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??"}
                            className="rounded-xl font-mono font-bold text-center text-base w-16" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Adresse</label>
                      <Input value={form.adresse} onChange={e => setF("adresse", e.target.value)}
                        placeholder="ex: 12 Rue de Thiong, Dakar" className="rounded-xl" />
                    </div>

                    {/* Statut actif */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">Compte actif</p>
                        <p className="text-xs text-slate-400">Peut se connecter à l'application</p>
                      </div>
                      <button onClick={() => setF("actif", !form.actif)}
                        className={`w-12 h-6 rounded-full transition-all relative ${form.actif ? "bg-emerald-500" : "bg-slate-300"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.actif ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                  </div>

                  {/* ── Colonne 2 : Contact & Accès ── */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-5 h-5 bg-amber-400 rounded-lg flex items-center justify-center text-slate-900 font-black text-xs">2</span>
                      Contact & accès
                    </p>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Téléphone *</label>
                      <Input value={form.tel} onChange={e => setF("tel", e.target.value)}
                        placeholder="+221 77 000 0000"
                        className={`rounded-xl ${errors.tel ? "border-rose-400" : ""}`} />
                      {errors.tel && <p className="text-xs text-rose-500 mt-1">⚠ {errors.tel}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                      <Input type="email" value={form.email} onChange={e => setF("email", e.target.value)}
                        placeholder="prenom.nom@transitpro.sn"
                        className={`rounded-xl ${errors.email ? "border-rose-400" : ""}`} />
                      {errors.email && <p className="text-xs text-rose-500 mt-1">⚠ {errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        Mot de passe {editId === null ? "*" : "(laisser vide pour ne pas changer)"}
                      </label>
                      <Input type="password" value={form.password} onChange={e => setF("password", e.target.value)}
                        placeholder="••••••••" className="rounded-xl" />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Note interne</label>
                      <textarea
                        value={form.note}
                        onChange={e => setF("note", e.target.value)}
                        rows={3}
                        placeholder="Compétences, observations, remarques…"
                        className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none text-slate-700 placeholder-slate-400"
                      />
                    </div>

                    {/* Aperçu carte */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Aperçu de la fiche</p>
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${AVATAR_PALETTE[(personnel.length) % AVATAR_PALETTE.length]}`}>
                          {form.avatar || (form.prenom && form.nom ? computeAvatar(form.prenom, form.nom) : "??")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm">{form.prenom || "Prénom"} {form.nom || "Nom"}</p>
                          <p className="text-xs text-slate-500">{form.poste || "Poste"} · {form.dept}</p>
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{form.role}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${form.actif ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                              {form.actif ? "Actif" : "Inactif"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {(form.tel || form.email) && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                          {form.tel && <p>📞 {form.tel}</p>}
                          {form.email && <p>✉ {form.email}</p>}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button onClick={submitForm}
                        className={`flex justify-center items-center flex-1 font-bold text-sm py-3 rounded-xl transition-colors shadow-sm ${editId !== null ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-amber-400 hover:bg-amber-500 text-slate-900"}`}>
                        {loading ? <Spinner /> : editId !== null ? "✏️ Mettre à jour" : "＋ Enregistrer le personnel"}
                      </button>
                      <button onClick={cancelForm}
                        className="px-5 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition-colors font-medium">
                        Annuler
                      </button>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}




async function Delete(id: string) {
  return await fetch("/api/users/" + id, {
    method: "DELETE",
  })
}