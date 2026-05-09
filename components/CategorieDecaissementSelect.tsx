// Composant pour la sélection de la catégorie de décaissement (style nouveau)
export const CategorieDecaissementSelect = ({ value, onChange, categories }: { value: string, onChange: (value: string) => void, categories: any[] }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Catégorie de décaissement
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {categories.map(cat => {
                const selected = value === cat.key
                return (
                    <button
                        key={cat.key}
                        type="button"
                        onClick={() => onChange(cat.key)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                            selected 
                                ? `${cat.bg} ${cat.border} border-2 shadow-sm` 
                                : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                    >
                        <span className="text-base block mb-1">{cat.icon}</span>
                        <span className={`text-xs font-semibold leading-tight block ${selected ? cat.color : "text-slate-700"}`}>
                            {cat.label}
                        </span>
                    </button>
                )
            })}
        </div>
        <input type="hidden" name="categorie" value={value} />
    </div>
)