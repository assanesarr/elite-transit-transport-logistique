import { useState, useEffect } from "react";

interface CheckModalProps {
  initial?: {
    date?: string;
    banque?: string;
    numero?: string;
    destinataire?: string;
    montant?: string | number;
    description?: string;
  } | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

interface FormData {
  date: string;
  banque: string;
  numero: string;
  destinataire: string;
  montant: string;
  description: string;
}

interface Errors {
  date?: boolean;
  banque?: boolean;
  numero?: boolean;
  destinataire?: boolean;
  montant?: boolean;
}

const today = (): string => new Date().toISOString().split("T")[0];

const EMPTY: FormData = {
  date: today(),
  banque: "",
  numero: "",
  destinataire: "",
  montant: "",
  description: "",
};

const formatMontant = (montant: string): string => {
  const num = parseFloat(montant);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("fr-FR").format(num);
};

export default function CheckModal({ initial, onSave, onClose }: CheckModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>(() => {
    if (initial) {
      return {
        date: initial.date || today(),
        banque: initial.banque || "",
        numero: initial.numero || "",
        destinataire: initial.destinataire || "",
        montant: initial.montant ? String(initial.montant) : "",
        description: initial.description || "",
      };
    }
    return EMPTY;
  });
  
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (initial) {
      setForm({
        date: initial.date || today(),
        banque: initial.banque || "",
        numero: initial.numero || "",
        destinataire: initial.destinataire || "",
        montant: initial.montant ? String(initial.montant) : "",
        description: initial.description || "",
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [initial]);

  const setField = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.date) e.date = true;
    if (!form.banque.trim()) e.banque = true;
    if (!form.numero.trim()) e.numero = true;
    if (!form.destinataire.trim()) e.destinataire = true;
    if (!form.montant || isNaN(Number(form.montant)) || Number(form.montant) <= 0)
      e.montant = true;
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { 
      setErrors(e); 
      return; 
    }
    
    setLoading(true);
    
    // Simulate async save (remove if onSave is already async)
    try {
      // await new Promise(resolve => setTimeout(resolve, 800));
      await onSave({ ...form, montant: Number(form.montant) });
    } finally {
      setLoading(false);
    }
  };

  const field = (
    id: keyof FormData,
    label: string,
    props: {
      type?: string;
      placeholder?: string;
      textarea?: boolean;
      required?: boolean;
      min?: string;
    } = {},
    full: boolean = false
  ) => (
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
          onChange={setField(id)}
          placeholder={props.placeholder}
          rows={3}
          className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition resize-none ${
            errors[id as keyof typeof errors]
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-200"
          }`}
        />
      ) : (
        <div className="relative">
          <input
            type={props.type || "text"}
            value={form[id]}
            onChange={setField(id)}
            placeholder={props.placeholder}
            min={props.min}
            className={`w-full border rounded-lg px-3 py-2 text-sm text-slate-800 bg-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition ${
              errors[id as keyof typeof errors]
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-200"
            } ${id === "montant" ? "pr-36" : ""}`}
          />
          
          {/* Aperçu du montant à droite */}
          {id === "montant" && form.montant && !isNaN(Number(form.montant)) && Number(form.montant) > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md whitespace-nowrap">
                <span className="text-[10px] font-medium text-emerald-600 uppercase">
                  Aperçu
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {formatMontant(form.montant)} FCFA
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      {errors[id as keyof typeof errors] && (
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
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            {/* Champ Montant sur 2 colonnes */}
            {field("montant", "Montant (FCFA)", { type: "number", placeholder: "0", min: "0" }, true)}
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
            disabled={loading}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Chargement...</span>
              </>
            ) : (
              initial ? "Mettre à jour" : "Enregistrer"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}