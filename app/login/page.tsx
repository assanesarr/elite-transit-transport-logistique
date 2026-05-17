import { Truck, Lock, ChevronRight, TrendingUp, PackageCheck, Route, Clock, Ship, Box, Anchor, Navigation, Globe, Shield, Zap, FileCheck, ClipboardCheck, Stamp, Building2, FileText, AlertCircle } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Composants SVG personnalisés pour le dédouanement
const CustomsIcon = ({ className = "size-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="8" width="18" height="12" rx="1" stroke="currentColor" fill="none"/>
    <path d="M7 12H17" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 16H14" stroke="currentColor" strokeWidth="2"/>
    <circle cx="19" cy="16" r="1.5" fill="currentColor"/>
    <path d="M8 4L12 8L16 4" stroke="currentColor" fill="none"/>
  </svg>
)

const DocumentIcon = ({ className = "size-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" fill="none"/>
    <polyline points="14 2 14 8 20 8" stroke="currentColor" fill="none"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor"/>
    <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor"/>
  </svg>
)

const TariffIcon = ({ className = "size-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" fill="none"/>
    <path d="M12 7v5l3 3" stroke="currentColor"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
  </svg>
)



function FooterVersionApp() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const appName = process.env.APP_NAME;
  const lastUpdate = process.env.NEXT_PUBLIC_UPDATED_AT
  
  return (
    <footer className="relative border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-cyan-600/5 via-blue-600/5 to-indigo-600/5"></div>
      
      <div className="container mx-auto px-4 py-3 relative z-10">
        {/* Version desktop */}
        <div className="hidden md:flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
            </div>
            <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
              {appName || "CustomsClear Pro"}
            </span>
            <span className="text-slate-600 text-[11px]">•</span>
            <span className="text-[10px] text-slate-500">© {new Date().getFullYear()} Tous droits réservés</span>
          </div>
          
          <div className="flex items-center gap-4 text-slate-500">
            <a href="/legal/mentions-legales" className="hover:text-cyan-400 transition-all duration-300 inline-flex items-center gap-1 text-[11px]">
              <Shield className="size-3" />
              Mentions légales
            </a>
            <a href="/legal/conditions" className="hover:text-cyan-400 transition-all duration-300 inline-flex items-center gap-1 text-[11px]">
              <FileCheck className="size-3" />
              Conditions
            </a>
            <a href="/legal/confidentialite" className="hover:text-cyan-400 transition-all duration-300 inline-flex items-center gap-1 text-[11px]">
              <Lock className="size-3" />
              Confidentialité
            </a>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-slate-500">
              <Clock className="size-3" />
              <span className="text-[10px] text-slate-500">MAJ: {lastUpdate || new Date().toLocaleDateString('fr-FR')}</span>
              <Zap className="size-3 text-cyan-400" />
              <span className="font-mono text-cyan-400 text-[10px]">v{version || "2.5.0"}</span>
            </div>
          </div>
        </div>
        
        {/* Version tablette */}
        <div className="hidden sm:flex md:hidden flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
            </div>
            <span className="uppercase font-semibold tracking-wider text-slate-300 text-[11px]">
              {appName || "CustomsClear Pro"}
            </span>
            <span className="text-[10px] text-slate-500">© {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href="/legal/mentions-legales" className="hover:text-cyan-400 transition-all duration-300 inline-flex items-center gap-1 text-[10px] text-slate-500">
              <Shield className="size-3" />
              Mentions
            </a>
            <a href="/legal/conditions" className="hover:text-cyan-400 transition-all duration-300 inline-flex items-center gap-1 text-[10px] text-slate-500">
              <FileCheck className="size-3" />
              CGU
            </a>
            <a href="/legal/confidentialite" className="hover:text-cyan-400 transition-all duration-300 inline-flex items-center gap-1 text-[10px] text-slate-500">
              <Lock className="size-3" />
              Confidentialité
            </a>
            <div className="flex items-center gap-2">
              <Clock className="size-2.5 text-slate-500" />
              <span className="text-[9px] text-slate-500">{lastUpdate || new Date().toLocaleDateString('fr-FR')}</span>
              <Zap className="size-2.5 text-cyan-400" />
              <span className="font-mono text-cyan-400 text-[9px]">v{version || "2.5.0"}</span>
            </div>
          </div>
        </div>
        
        {/* Version mobile */}
        <div className="flex sm:hidden flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping opacity-75"></div>
            </div>
            <span className="uppercase font-semibold tracking-wider text-slate-300 text-[10px]">
              {appName || "CustomsClear Pro"}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a href="/legal/mentions-legales" className="text-cyan-400 transition-all duration-300 text-[9px]">
              Mentions
            </a>
            <a href="/legal/conditions" className="text-cyan-400 transition-all duration-300 text-[9px]">
              CGU
            </a>
            <a href="/legal/confidentialite" className="text-cyan-400 transition-all duration-300 text-[9px]">
              Confid.
            </a>
            <div className="flex items-center gap-1.5">
              <Clock className="size-2 text-slate-500" />
              <span className="text-[8px] text-slate-500">{lastUpdate || new Date().toLocaleDateString('fr-FR')}</span>
              <Zap className="size-2 text-cyan-400" />
              <span className="font-mono text-cyan-400 text-[8px]">v{version || "2.5.0"}</span>
            </div>
          </div>
          
          <div className="text-[8px] text-slate-500">
            © {new Date().getFullYear()} Tous droits réservés
          </div>
        </div>
      </div>
    </footer>
  )
}

export default async function LoginPage() {
  const user = (await auth())?.user

  if(user) {
    redirect("/dashboard")
  }
  
  // Métriques spécifiques au dédouanement de conteneurs
  const metrics = [
    { label: "Déclarations traitées", value: "128.5K", icon: FileText, trend: "+23%", suffix: "courant 2026" },
    { label: "Délai moyen", value: "2.4h", icon: Clock, trend: "-32%", suffix: "dédouanement" },
    // { label: "Taux de conformité", value: "99.7%", icon: ClipboardCheck, trend: "+1.2%", suffix: "douane" },
    // { label: "Économies réalisées", value: "€8.2M", icon: TrendingUp, trend: "+18%", suffix: "droits optimisés" },
  ]

  const statsSecondRow = [
    { label: "Bureaux de douane", value: "45", icon: Building2, trend: "connectés" },
    { label: "Pays couverts", value: "67", icon: Globe, trend: "+12" },
    { label: "Codes SH", value: "12.4K", icon: TariffIcon, trend: "mis à jour" },
    { label: "Agréments", value: "100%", icon: Stamp, trend: "conforme" },
  ]

  const features = [
    { icon: CustomsIcon, text: "Dématérialisation 100%" },
    { icon: DocumentIcon, text: "Gestion documents" },
    { icon: ClipboardCheck, text: "Conformité douane" },
    { icon: Stamp, text: "Signature électronique" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col">
      

      <div className="relative container mx-auto px-4 flex-1 flex items-center justify-center py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl w-full">
          {/* Left Side - Brand & Metrics */}
          <div className="hidden lg:flex flex-col justify-between space-y-8 animate-in slide-in-from-left duration-700">
            <div className="space-y-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center gap-3">
                  <div className="bg-linear-to-br from-cyan-500 to-blue-600 p-3 rounded-2xl shadow-xl">
                    <Stamp className="size-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">Elite Transit Transport</h1>
                    <p className="text-sm text-slate-400">Dédouanement intelligent de conteneurs</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  <CustomsIcon className="size-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400 font-medium">Solution de dédouanement certifiée</span>
                </div> */}
                <h2 className="text-5xl font-bold leading-tight text-white">
                  Déclarez en douane 
                  <span className="bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"> en quelques clics</span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Automatisez vos déclarations douanières, suivez vos dossiers en temps réel et optimisez vos coûts de dédouanement pour tous vos conteneurs.
                </p>
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700 group hover:border-cyan-500/50 transition-all duration-300">
                    <feature.icon className="size-3.5 text-cyan-400" />
                    <span className="text-xs text-slate-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Première rangée de métriques */}
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, idx) => (
                <div key={idx} className="group relative overflow-hidden bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition duration-300"></div>
                  <metric.icon className="size-5 text-cyan-400 mb-2" />
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    <div className="text-[10px] text-emerald-400">{metric.trend}</div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{metric.label}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{metric.suffix}</div>
                </div>
              ))}
            </div>

            {/* Seconde rangée de métriques */}
            <div className="grid grid-cols-4 gap-3">
              {statsSecondRow.map((stat, idx) => (
                <div key={idx} className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-3 border border-slate-700 text-center">
                  <stat.icon className="size-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-[9px] text-slate-400">{stat.label}</div>
                  <div className="text-[8px] text-emerald-400 mt-0.5">{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto animate-in slide-in-from-right duration-700">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-slate-700">
                

                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
                      <FileCheck className="size-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-4">Espace déclarant</h2>
                  <p className="text-slate-400 mt-2 text-sm">
                    Connectez-vous pour accéder à vos dossiers
                  </p>
                </div>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterVersionApp />

     
    </div>
  )
}