// @ts-nocheck
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAgentsStore } from '@/store/agentStore'

// Fonction pour formater le numéro de téléphone sénégalais
const formatSNPhone = (value: string): string => {
  let cleaned = value.replace(/\D/g, '')
  
  if (cleaned.startsWith('221') && cleaned.length > 9) {
    cleaned = '+' + cleaned
  } else if (cleaned.length >= 9) {
    if (cleaned.length === 9) {
      cleaned = '+221 ' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 5) + ' ' + cleaned.slice(5, 7) + ' ' + cleaned.slice(7)
    } else if (cleaned.length === 8) {
      cleaned = '+221 77 ' + cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 6) + ' ' + cleaned.slice(6)
    } else {
      cleaned = '+221 ' + cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 5) + ' ' + cleaned.slice(5, 7) + ' ' + cleaned.slice(7, 9)
    }
  }
  
  return cleaned
}

interface Responsable {
  id: number
  name: string
  role: string
  tel: string
  actif: boolean
}

export default function Equipe() {
  const agents = useAgentsStore(s => s.agents)
  const [responsables, setResponsables] = useState<Responsable[]>(agents)

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700">Responsables de dossiers</CardTitle>
          <button
            onClick={() => setResponsables(c => [...c, { id: Date.now(), nom: "", poste: "", tel: "", actif: true }])}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-50 transition-colors">
            + Ajouter
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-slate-100">
                {["Nom", "Poste", "Téléphone", "Statut", ""].map(h => (
                  <TableHead key={h} className="text-xs font-semibold text-slate-400 uppercase tracking-wider first:pl-5 last:pr-5">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {responsables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                    Aucun responsable. Cliquez sur "+ Ajouter" pour commencer
                  </TableCell>
                </TableRow>
              ) : (
                responsables.map((r, i) => (
                  <TableRow key={r.id} className="border-slate-50">
                    <TableCell className="pl-5">
                      <Input 
                        value={r.name} 
                        onChange={e => setResponsables(c => c.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                        className="h-8 rounded-lg text-sm border-slate-200 w-40" 
                        placeholder="Nom complet" 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={r.role} 
                        onChange={e => setResponsables(c => c.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                        className="h-8 rounded-lg text-sm border-slate-200 w-36" 
                        placeholder="Poste" 
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        value={r.email} 
                        onChange={e => setResponsables(c => c.map((x, j) => j === i ? { ...x, email: formatSNPhone(e.target.value) } : x))}
                        className="h-8 rounded-lg text-sm border-slate-200 w-36 font-mono" 
                        placeholder="+221 77..." 
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => setResponsables(c => c.map((x, j) => j === i ? { ...x, actif: !x.actif } : x))}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                          r.actif 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}>
                        {r.actif ? "Actif" : "Inactif"}
                      </button>
                    </TableCell>
                    <TableCell className="pr-5">
                      <button 
                        onClick={() => setResponsables(c => c.filter((_, j) => j !== i))}
                        className="text-slate-300 hover:text-rose-500 transition-colors text-xs">
                        ✕
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compteurs */}
      {responsables.length > 0 && (
        <div className="flex gap-4 text-xs text-slate-500 px-2">
          <span>Total: {responsables.length}</span>
          <span>•</span>
          <span className="text-emerald-600">Actifs: {responsables.filter(r => r.actif).length}</span>
          <span>•</span>
          <span className="text-slate-400">Inactifs: {responsables.filter(r => !r.actif).length}</span>
        </div>
      )}
    </div>
  )
}