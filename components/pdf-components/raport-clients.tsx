// @ts-nocheck
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';

// Styles inspirés de la facture
const styles = StyleSheet.create({
    page: {
        padding: 25,
        fontFamily: 'Helvetica',
        fontSize: 8,
        color: '#1e293b',
        backgroundColor: '#ffffff',
        position: 'relative',
    },
    topBar: {
        height: 4,
        backgroundColor: '#0f172a',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    // En-tête principal
    header: {
        marginBottom: 15,
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#0f172a',
        paddingHorizontal: 12,
        // padding: 12,
        marginBottom: 12,
    },
    headLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
     logo: {
        width: 70,
        height: 70,
        objectFit: 'contain',
        marginRight: 4
    },
    companyInfo: {
        color: 'white',
    },
    companyName: {
        fontSize: 13,
        fontWeight: 'extrabold',
        color: 'white',
        marginBottom: 3,
    },
    companySub: {
        fontSize: 6.5,
        color: '#94a3b8',
        marginTop: 1,
        lineHeight: 1.3,
    },
    headRight: {
        alignItems: 'flex-end',
    },
    reportTitle: {
        fontSize: 14,
        fontWeight: 'extrabold',
        color: 'white',
        marginBottom: 3,
    },
    reportSubtitle: {
        fontSize: 8,
        color: '#94a3b8',
    },
    // Section stats
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        padding: 8,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#1e3a8a',
        borderRadius: 4,
        gap: 15,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 6.5,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    statValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    // Section client
    clientSection: {
        marginTop: 10,
        marginBottom: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    clientHeader: {
        backgroundColor: '#334155',
        paddingVertical: 6,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clientName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    clientStats: {
        fontSize: 8,
        color: '#cbd5e1',
    },
    // Sous-tableau des dossiers
    subTable: {
        width: '100%',
    },
    subTableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e2e8f0',
        paddingVertical: 4,
        paddingHorizontal: 6,
    },
    subTableHeaderCell: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#334155',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    subTableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    subTableRowEven: {
        backgroundColor: '#f8fafc',
    },
    subTableCell: {
        fontSize: 7.5,
        color: '#475569',
    },
    clientTotalRow: {
        flexDirection: 'row',
        backgroundColor: '#fef3c7',
        paddingVertical: 5,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#fde68a',
    },
    clientTotalLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#92400e',
    },
    clientTotalValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#92400e',
        fontFamily: 'Courier',
    },
    // Colonnes pour la sous-table
    colDossierName: { width: '30%' },
    colMontant: { width: '17%', textAlign: 'right' },
    colVersement: { width: '17%', textAlign: 'right' },
    colReste: { width: '17%', textAlign: 'right' },
    colStatutDossier: { width: '19%', textAlign: 'center' },

    // Styles pour les statuts de dossier
    statusDossierPaid: {
        color: '#16a34a',
        fontWeight: 'bold',
    },
    statusDossierPartial: {
        color: '#f59e0b',
        fontWeight: 'bold',
    },
    statusDossierPending: {
        color: '#dc2626',
        fontWeight: 'bold',
    },

    // Section total sur dernière page
    totalSection: {
        marginTop: 20,
        backgroundColor: '#f0f9ff',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#bae6fd',
        padding: 10,
    },
    totalTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0369a1',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#e0f2fe',
    },
    totalRowLast: {
        borderBottomWidth: 0,
        marginTop: 5,
        paddingTop: 5,
        backgroundColor: '#e0f2fe',
        borderRadius: 4,
        paddingHorizontal: 5,
    },
    totalLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#334155',
    },
    totalValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#0369a1',
        fontFamily: 'Courier',
    },
    totalValueGrand: {
        fontSize: 11,
        fontWeight: 'extrabold',
        color: '#1e3a8a',
        fontFamily: 'Courier',
    },
    // Barre de progression
    progressBar: {
        marginTop: 5,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#16a34a',
        borderRadius: 2,
    },
    // Pied de page
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 25,
        right: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 6,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        fontSize: 6.5,
        color: '#94a3b8',
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        right: 25,
        fontSize: 6.5,
        color: '#94a3b8',
    },
});

// Composant d'en-tête du rapport
const ReportHeader = ({ stats, entreprise, currentDate, logoUrl }) => (
    <>
        <View style={styles.head}>
            <View style={styles.headLeft}>
                {logoUrl && (
                    <Image src={logoUrl} style={styles.logo} />
                )}
                <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{entreprise.nom}</Text>
                    <Text style={styles.companySub}>
                        {entreprise.adresse} · {entreprise.ville}, {entreprise.pays}
                    </Text>
                    <Text style={styles.companySub}>
                        NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}
                    </Text>
                    <Text style={styles.companySub}>
                        Tel: {entreprise.telephone} · Email: {entreprise.email}
                    </Text>
                </View>
            </View>
            <View style={styles.headRight}>
                <Text style={styles.reportTitle}>RAPPORT DÉTAILLÉ DES CLIENTS</Text>
                <Text style={styles.reportSubtitle}>
                    Période: {currentDate}
                </Text>
            </View>
        </View>

        <View style={styles.statsBar}>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Clients</Text>
                <Text style={styles.statValue}>{stats.totalClients}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Dossiers</Text>
                <Text style={styles.statValue}>{stats.totalDossiers}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Montant Global</Text>
                <Text style={styles.statValue}>
                    {stats.totalMontant.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Versé</Text>
                <Text style={styles.statValue}>
                    {stats.totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Restant Global</Text>
                <Text style={styles.statValue}>
                    {stats.totalReste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>
        </View>
    </>
);

// Composant pour afficher les dossiers d'un client
const ClientDossiersTable = ({ client }) => {
    const getDossierStatus = (dossier) => {
        const totalDossier = Number(dossier.montant_total);
        const versements = (dossier.versement || []).reduce((sum, v) => sum + Number(v.montant), 0);
        const reste = totalDossier - versements;

        if (reste <= 0) return { text: 'SOLDÉ', style: styles.statusDossierPaid };
        if (versements > 0) return { text: 'PARTIEL', style: styles.statusDossierPartial };
        return { text: 'EN ATTENTE', style: styles.statusDossierPending };
    };

    return (
        <View style={styles.subTable}>
            {/* En-tête de la sous-table */}
            <View style={styles.subTableHeader}>
                <View style={[styles.subTableHeaderCell, styles.colDossierName]}>
                    <Text>Désignation du dossier</Text>
                </View>
                <View style={[styles.subTableHeaderCell, styles.colMontant]}>
                    <Text>Montant (FCFA)</Text>
                </View>
                <View style={[styles.subTableHeaderCell, styles.colVersement]}>
                    <Text>Versements (FCFA)</Text>
                </View>
                <View style={[styles.subTableHeaderCell, styles.colReste]}>
                    <Text>Restant (FCFA)</Text>
                </View>
                <View style={[styles.subTableHeaderCell, styles.colStatutDossier]}>
                    <Text>Statut</Text>
                </View>
            </View>

            {/* Lignes des dossiers */}
            {client.dossiers.map((dossier, idx) => {
                const totalDossier = Number(dossier.montant_total);
                const versements = (dossier.versement || []).reduce((sum, v) => sum + Number(v.montant), 0);
                const reste = totalDossier - versements;
                const status = getDossierStatus(dossier);

                return (
                    <View
                        key={idx}
                        style={[styles.subTableRow, idx % 2 === 1 && styles.subTableRowEven]}
                    >
                        <View style={[styles.subTableCell, styles.colDossierName]}>
                            <Text>{dossier.dossierName || dossier.reference || `Dossier ${idx + 1}`}</Text>
                        </View>
                        <View style={[styles.subTableCell, styles.colMontant]}>
                            <Text style={{ fontFamily: 'Courier' }}>
                                {totalDossier.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                            </Text>
                        </View>
                        <View style={[styles.subTableCell, styles.colVersement]}>
                            <Text style={{ fontFamily: 'Courier', color: '#16a34a' }}>
                                {versements.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                            </Text>
                        </View>
                        <View style={[styles.subTableCell, styles.colReste]}>
                            <Text style={{ fontFamily: 'Courier', color: reste > 0 ? '#dc2626' : '#16a34a' }}>
                                {reste.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                            </Text>
                        </View>
                        <View style={[styles.subTableCell, styles.colStatutDossier, status.style]}>
                            <Text>{status.text}</Text>
                        </View>
                    </View>
                );
            })}

            {/* Total du client */}
            <View style={styles.clientTotalRow}>
                <Text style={styles.clientTotalLabel}>TOTAL CLIENT</Text>
                <Text style={styles.clientTotalValue}>
                    {client.totalMontant.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA versés /{' '}
                    {client.reste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA restants
                </Text>
            </View>
        </View>
    );
};

// Composant pour afficher un client avec ses dossiers
const ClientSection = ({ client, index }) => (
    <View style={styles.clientSection} wrap={false}>
        <View style={styles.clientHeader}>
            <Text style={styles.clientName}>
                {index + 1}. {client.name}
            </Text>
            <Text style={styles.clientStats}>
                {client.dossiers.length} dossier(s) | Total: {client.totalMontant.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
            </Text>
        </View>
        <ClientDossiersTable client={client} />
    </View>
);

// Composant des totaux généraux (dernière page)
const TotalSummary = ({ totals }) => {
    const tauxRecouvrement = totals.totalNetAPayer > 0
        ? Math.round((totals.totalVersements / totals.totalNetAPayer) * 100)
        : 0;

    return (
        <View style={styles.totalSection}>
            <Text style={styles.totalTitle}>RÉCAPITULATIF GÉNÉRAL DÉTAILLÉ</Text>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Nombre total de clients :</Text>
                <Text style={styles.totalValue}>{totals.totalClients}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Nombre total de dossiers :</Text>
                <Text style={styles.totalValue}>{totals.totalDossiers}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Montant total facturé :</Text>
                <Text style={styles.totalValue}>
                    {totals.totalNetAPayer.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total des versements :</Text>
                <Text style={styles.totalValue}>
                    {totals.totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={[styles.totalRow, styles.totalRowLast]}>
                <Text style={styles.totalLabel}>Restant global à payer :</Text>
                <Text style={styles.totalValueGrand}>
                    {totals.totalReste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 7, color: '#64748b', marginBottom: 3 }}>
                    Taux de recouvrement global: {tauxRecouvrement}%
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(tauxRecouvrement, 100)}%` }]} />
                </View>
            </View>

            {/* Statistiques complémentaires */}
            <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: '#dcfce7', padding: 5, borderRadius: 4 }}>
                    <Text style={{ fontSize: 6, color: '#166534', textAlign: 'center' }}>
                        Dossiers soldés
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#166534', textAlign: 'center' }}>
                        {totals.dossiersSoldes}
                    </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fed7aa', padding: 5, borderRadius: 4 }}>
                    <Text style={{ fontSize: 6, color: '#92400e', textAlign: 'center' }}>
                        Dossiers partiels
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#92400e', textAlign: 'center' }}>
                        {totals.dossiersPartiels}
                    </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fee2e2', padding: 5, borderRadius: 4 }}>
                    <Text style={{ fontSize: 6, color: '#991b1b', textAlign: 'center' }}>
                        Dossiers impayés
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#991b1b', textAlign: 'center' }}>
                        {totals.dossiersImpayes}
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Composant principal du rapport avec pagination
export const ClientReportPDF = ({ clients, stats, entreprise }) => {
    // Enrichir les données des clients avec les calculs
    const enrichedClients = clients.map(client => {
        let totalMontant = 0;
        let totalVersements = 0;

        client.dossiers.forEach(dossier => {
            const montantDossier = Number(dossier.montant_total);
            const versementsDossier = (dossier.versement || []).reduce((sum, v) => sum + Number(v.montant), 0);

            totalMontant += montantDossier;
            totalVersements += versementsDossier;
        });

        return {
            ...client,
            totalMontant,
            totalVersements,
            reste: totalMontant - totalVersements
        };
    });

    // Calcul des totaux généraux enrichis
    const totals = enrichedClients.reduce((acc, client) => {
        // Compter les dossiers par statut
        client.dossiers.forEach(dossier => {
            const montantDossier = Number(dossier.montant_total);
            const versementsDossier = (dossier.versement || []).reduce((sum, v) => sum + Number(v.montant), 0);
            const reste = montantDossier - versementsDossier;

            if (reste <= 0) acc.dossiersSoldes++;
            else if (versementsDossier > 0) acc.dossiersPartiels++;
            else acc.dossiersImpayes++;
        });

        return {
            totalClients: acc.totalClients + 1,
            totalDossiers: acc.totalDossiers + client.dossiers.length,
            totalNetAPayer: acc.totalNetAPayer + client.totalMontant,
            totalVersements: acc.totalVersements + client.totalVersements,
            totalReste: acc.totalReste + client.reste,
            dossiersSoldes: acc.dossiersSoldes,
            dossiersPartiels: acc.dossiersPartiels,
            dossiersImpayes: acc.dossiersImpayes,
        };
    }, {
        totalClients: 0,
        totalDossiers: 0,
        totalNetAPayer: 0,
        totalVersements: 0,
        totalReste: 0,
        dossiersSoldes: 0,
        dossiersPartiels: 0,
        dossiersImpayes: 0,
    });

    const clientsParPage = 2; // Nombre de clients par page (ajustez selon besoin)
    const totalPages = Math.max(1, Math.ceil(enrichedClients.length / clientsParPage));
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const renderPage = (pageNumber) => {
        const startIndex = (pageNumber - 1) * clientsParPage;
        const endIndex = Math.min(startIndex + clientsParPage, enrichedClients.length);
        const pageClients = enrichedClients.slice(startIndex, endIndex);
        const isLastPage = pageNumber === totalPages;

        return (
            <Page key={pageNumber} size="A4" style={styles.page} wrap>
                <View style={styles.topBar} />

                <View style={styles.header}>
                    <ReportHeader
                        stats={stats}
                        entreprise={entreprise}
                        currentDate={currentDate}
                        logoUrl={'/logo.jpeg'}
                    />
                </View>

                {/* Clients avec leurs dossiers */}
                {pageClients.map((client, idx) => (
                    <ClientSection key={startIndex + idx} client={client} index={startIndex + idx} />
                ))}

                {/* Total général sur la dernière page */}
                {isLastPage && <TotalSummary totals={totals} />}

                {/* Pied de page */}
                <View style={styles.footer} fixed>
                    <Text>© {entreprise.nom} · NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}</Text>
                    <Text>Généré le {currentDate}</Text>
                </View>

                <Text style={styles.pageNumber} fixed>
                    Page {pageNumber} / {totalPages}
                </Text>
            </Page>
        );
    };

    return (
        <Document>
            {Array.from({ length: totalPages }, (_, i) => renderPage(i + 1))}
        </Document>
    );
};

// Fonction utilitaire pour générer et ouvrir le rapport
export const printClientReport = async (clients, stats, entreprise) => {
    try {
        const blob = await pdf(
            <ClientReportPDF
                clients={clients}
                stats={stats}
                entreprise={entreprise}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const w = window.open(url, "_blank", "width=1024,height=900");

        if (w) {
            w.focus();
        }

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error("Erreur lors de la génération du rapport:", error);
    }
};

// Fonction pour télécharger le rapport
export const downloadClientReport = async (clients, stats, entreprise, fileName) => {
    try {
        const blob = await pdf(
            <ClientReportPDF
                clients={clients}
                stats={stats}
                entreprise={entreprise}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error("Erreur lors du téléchargement du rapport:", error);
    }
};



// Dans votre composant
export const RaportClientDetailPDF = async (clients, entreprise) => {
    // const entreprise = {
    //     nom: "ELITE TRANSIT TRANSPORT LOGISTIQUE",
    //     adresse: "19, Boulevard Djily Mbaye",
    //     ville: "Dakar",
    //     pays: "Sénégal",
    //     ninea: "005553020",
    //     rc: "SN-DKR-2015-13017",
    //     telephone: "+221 33 822 48 67",
    //     email: "elitetransit16@gmail.com"
    // };

    // Calcul des statistiques globales
    
    const stats = {
        totalClients: clients.length,
        totalDossiers: clients.reduce((sum, c) => sum + c.dossiers.length, 0),
        totalMontant: clients.reduce((sum, c) =>
            sum + c.dossiers.reduce((s, d) => s + Number(d.montant_total), 0), 0
        ),
        totalVersements: clients.reduce((sum, c) =>
            sum + c.dossiers.reduce((s, d) =>
                s + (d.versement || []).reduce((vs, v) => vs + Number(v.montant), 0), 0
            ), 0
        ),
        totalReste: 0 // Sera calculé automatiquement
    };

    // Calcul du reste total
    stats.totalReste = stats.totalMontant - stats.totalVersements;

    const fileName = `rapport_detaille_clients_${new Date().toLocaleDateString('fr-FR')}.pdf`;

    // Pour ouvrir dans une nouvelle fenêtre
    //   await printClientReport(clients, stats, entreprise);

    // Ou pour télécharger directement
    await downloadClientReport(clients, stats, entreprise, fileName);
};