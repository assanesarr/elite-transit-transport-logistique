'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Données initiales de l'entreprise
const initialEntrepriseData = {
  nom: "Elite Transit Transport Logistique Suarl",
  slogan: "",
  adresse: "19, Boulevard Djily Mbaye Immeuble Fahd 5 eme Etage",
  ville: "Dakar",
  telephone: "+221 33 822 48 67",
  email: "elitetransit16@gmail.com",
  site: "",
  ninea: "005553020",
  rc: "SN-DKR-2015-13017",
  agrement: "",
}

type EntrepriseData = typeof initialEntrepriseData

export default function Entreprises() {
  const [entreprise, setEntreprise] = useState<EntrepriseData>(initialEntrepriseData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof EntrepriseData, string>>>({})
  const [isModified, setIsModified] = useState(false)

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem('entrepriseData')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setEntreprise(parsedData)
      } catch (error) {
        console.error('Erreur chargement données:', error)
      }
    }
  }, [])

  // Vérifier si des modifications ont été faites
  useEffect(() => {
    const savedData = localStorage.getItem('entrepriseData')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setIsModified(JSON.stringify(entreprise) !== JSON.stringify(parsedData))
    } else {
      setIsModified(JSON.stringify(entreprise) !== JSON.stringify(initialEntrepriseData))
    }
  }, [entreprise])

  // Fonction pour mettre à jour un champ
  const setConf = (field: keyof EntrepriseData, value: string) => {
    setEntreprise(prev => ({
      ...prev,
      [field]: value
    }))
    // Effacer l'erreur du champ
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EntrepriseData, string>> = {}
    
    if (!entreprise.nom.trim()) newErrors.nom = 'La raison sociale est requise'
    if (!entreprise.email.trim()) newErrors.email = "L'email est requis"
    if (entreprise.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entreprise.email)) {
      newErrors.email = "Email invalide"
    }
    if (!entreprise.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!entreprise.adresse.trim()) newErrors.adresse = "L'adresse est requise"
    if (!entreprise.ville.trim()) newErrors.ville = 'La ville est requise'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulation d'appel API (à remplacer par votre endpoint réel)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Sauvegarde dans localStorage
      localStorage.setItem('entrepriseData', JSON.stringify(entreprise))
      
      // Afficher le message de succès
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      console.log('Données sauvegardées:', entreprise)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Une erreur est survenue lors de la sauvegarde')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Réinitialiser le formulaire
  const handleReset = () => {
    if (confirm('Voulez-vous vraiment annuler toutes les modifications non sauvegardées ?')) {
      const savedData = localStorage.getItem('entrepriseData')
      if (savedData) {
        setEntreprise(JSON.parse(savedData))
      } else {
        setEntreprise(initialEntrepriseData)
      }
      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Toast de succès */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium">Informations enregistrées avec succès !</p>
            </div>
          </div>
        </div>
      )}

      <div className="lg:col-span-2 space-y-4">
        {/* Identité de la société */}
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-50">
            <CardTitle className="text-sm font-semibold text-slate-700">Identité de la société</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Raison sociale <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={entreprise.nom} 
                  onChange={e => setConf("nom", e.target.value)} 
                  className={`rounded-xl font-semibold text-slate-800 ${errors.nom ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Entrez la raison sociale"
                />
                {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Slogan</label>
                <Input 
                  value={entreprise.slogan} 
                  onChange={e => setConf("slogan", e.target.value)} 
                  className="rounded-xl"
                  placeholder="Entrez le slogan de l'entreprise"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={entreprise.adresse} 
                  onChange={e => setConf("adresse", e.target.value)} 
                  className={`rounded-xl ${errors.adresse ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Entrez l'adresse complète"
                />
                {errors.adresse && <p className="text-xs text-red-500 mt-1">{errors.adresse}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Ville <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={entreprise.ville} 
                  onChange={e => setConf("ville", e.target.value)} 
                  className={`rounded-xl ${errors.ville ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Entrez la ville"
                />
                {errors.ville && <p className="text-xs text-red-500 mt-1">{errors.ville}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={entreprise.telephone} 
                  onChange={e => setConf("telephone", e.target.value)} 
                  className={`rounded-xl ${errors.telephone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="+221 XX XXX XX XX"
                />
                {errors.telephone && <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="email" 
                  value={entreprise.email} 
                  onChange={e => setConf("email", e.target.value)} 
                  className={`rounded-xl ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="contact@entreprise.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Site web</label>
                <Input 
                  value={entreprise.site} 
                  onChange={e => setConf("site", e.target.value)} 
                  className="rounded-xl"
                  placeholder="https://www.elitetransit.sn"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identifiants légaux */}
        <Card className="rounded-2xl border-slate-100 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-50">
            <CardTitle className="text-sm font-semibold text-slate-700">Identifiants légaux</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">NINEA</label>
                <Input 
                  value={entreprise.ninea} 
                  onChange={e => setConf("ninea", e.target.value)} 
                  className="rounded-xl font-mono text-sm"
                  placeholder="NINEA"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">RCCM</label>
                <Input 
                  value={entreprise.rc} 
                  onChange={e => setConf("rc", e.target.value)} 
                  className="rounded-xl font-mono text-sm"
                  placeholder="RCCM"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Agrément DGD</label>
                <Input 
                  value={entreprise.agrement} 
                  onChange={e => setConf("agrement", e.target.value)} 
                  className="rounded-xl font-mono text-sm"
                  placeholder="Numéro d'agrément"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting || !isModified}
            className="rounded-xl"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !isModified}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </div>
      </div>

      {/* Aperçu en temps réel */}
      <div>
        <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden sticky top-6">
          <div className="bg-linear-to-r from-slate-900 to-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-slate-900 font-black text-lg">
                  {entreprise.nom ? entreprise.nom.charAt(0).toUpperCase() : 'E'}
                </span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{entreprise.nom || 'Nom non défini'}</p>
                <p className="text-slate-400 text-xs">{entreprise.slogan || 'Transport & Logistique'}</p>
              </div>
            </div>
          </div>
          <CardContent className="p-4 space-y-2 text-xs text-slate-500">
            <div className="flex items-start gap-2">
              <span className="text-slate-400">📍</span>
              <span className="flex-1">{entreprise.adresse || 'Adresse non définie'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">🏙</span>
              <span>{entreprise.ville || 'Ville non définie'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">📞</span>
              <span>{entreprise.telephone || 'Téléphone non défini'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">✉</span>
              <span className="truncate">{entreprise.email || 'Email non défini'}</span>
            </div>
            {entreprise.site && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400">🌐</span>
                <span className="truncate">{entreprise.site}</span>
              </div>
            )}
            <div className="border-t border-slate-100 pt-3 mt-3 space-y-1 font-mono">
              {entreprise.ninea && (
                <div className="flex justify-between">
                  <span className="text-slate-400">NINEA :</span>
                  <span className="text-slate-700 font-medium">{entreprise.ninea}</span>
                </div>
              )}
              {entreprise.rc && (
                <div className="flex justify-between">
                  <span className="text-slate-400">RCCM :</span>
                  <span className="text-slate-700 font-medium">{entreprise.rc}</span>
                </div>
              )}
              {entreprise.agrement && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Agrément :</span>
                  <span className="text-slate-700 font-medium">{entreprise.agrement}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}