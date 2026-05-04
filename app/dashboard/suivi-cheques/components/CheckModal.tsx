// @ts-nocheck
import { useState, useEffect } from "react";

const today = () => new Date().toISOString().split("T")[0];
const nextYear = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
};

const EMPTY = {
  date: today(),
  banque: "",
  numero: "",
  destinataire: "",
  montant: "",
  description: "",
  validite: nextYear(),
};

export default function CheckModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial || EMPTY);
    setErrors({});
  }, [initial]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.date) e.date = true;
    if (!form.banque.trim()) e.banque = true;
    if (!form.numero.trim()) e.numero = true;
    if (!form.destinataire.trim()) e.destinataire = true;
    if (!form.montant || isNaN(Number(form.montant)) || Number(form.montant) <= 0)
      e.montant = true;
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({ ...form, montant: Number(form.montant) });
  };

  const field = (id, label, props = {}, full = false) => (
    <div className={full ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}
        {props.required !== false && (
          <span className="text-red-400 ml-0.5">*</span>
        )}
      </label>
      {props.textarea ? (
        <textarea
          value={form[id]}
          onChange={set(id)}
          placeholder={props.placeholder}
          rows={3}
          className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition resize-none ${
            errors[id]
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-200"
          }`}
        />
      ) : (
        <input
          type={props.type || "text"}
          value={form[id]}
          onChange={set(id)}
          placeholder={props.placeholder}
          min={props.min}
          className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition ${
            errors[id]
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-200"
          }`}
        />
      )}
      {errors[id] && (
        <p className="text-xs text-red-500 mt-1">Champ requis</p>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {initial ? "Modifier le chèque" : "Nouveau chèque"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            {field("date", "Date d'émission", { type: "date" })}
            {field("banque", "Banque", { placeholder: "Ex: BHS, CBAO, Ecobank..." })}
            {field("numero", "Numéro de chèque", { placeholder: "Ex: 0012345" })}
            {field("destinataire", "Destinataire", { placeholder: "Nom ou société" })}
            {field("montant", "Montant (FCFA)", { type: "number", placeholder: "0", min: "0" })}
            {field("validite", "Date de validité", { type: "date", required: false })}
            {field(
              "description",
              "Description",
              { textarea: true, placeholder: "Motif, référence facture...", required: false },
              true
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="text-xs text-red-500 mt-3 bg-red-50 px-3 py-2 rounded-lg">
              Veuillez remplir tous les champs obligatoires.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            {initial ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
