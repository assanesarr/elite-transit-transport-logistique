

export default function FooterVersionApp() {
    const version = process.env.NEXT_PUBLIC_APP_VERSION;
    const appName = process.env.APP_NAME;
    const lastUpdate = process.env.NEXT_PUBLIC_UPDATED_AT
    return (
        <div className="flex justify-between items-center text-[9px] text-muted-foreground p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span className="uppercase">{appName || "TransitPro"}</span>
            </div>
            <div className="flex gap-4">
                <span>Dernière mise à jour: {lastUpdate || new Date().toLocaleDateString('fr-FR')}</span>
                <span>Version {version}</span>
            </div>
        </div>
    )
}


