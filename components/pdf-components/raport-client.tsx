// @ts-nocheck
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import { ReportHeader } from './ReportHeader';

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
    // Section infos client
    clientInfoSection: {
        backgroundColor: '#f8fafc',
        padding: 10,
        marginBottom: 15,
        borderLeftWidth: 3,
        borderLeftColor: '#1e3a8a',
        borderRadius: 4,
    },
    clientInfoTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 5,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    clientInfoRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    clientInfoLabel: {
        width: 80,
        fontSize: 8,
        color: '#64748b',
    },
    clientInfoValue: {
        flex: 1,
        fontSize: 8,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    // Section stats client
    clientStatsBar: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 8,
        marginBottom: 15,
        borderRadius: 4,
        gap: 10,
    },
    clientStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    clientStatLabel: {
        fontSize: 6.5,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 3,
    },
    clientStatValue: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1e3a8a',
    },
    // Tableau des dossiers
    table: {
        width: '100%',
        marginBottom: 15,
    },
    tableHeader: {
        backgroundColor: '#1e3a8a',
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 6,
    },
    tableHeaderCell: {
        fontSize: 7.5,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    tableRowEven: {
        backgroundColor: '#f8fafc',
    },
    tableCell: {
        fontSize: 7.5,
        color: '#475569',
    },
    // Colonnes du tableau
    colName: { width: '25%' },
    colMontant: { width: '18%', textAlign: 'right' },
    colVersements: { width: '18%', textAlign: 'right' },
    colReste: { width: '18%', textAlign: 'right' },
    colStatut: { width: '21%', textAlign: 'center' },

    // Styles pour les statuts
    statusPaid: {
        color: '#16a34a',
        fontWeight: 'bold',
    },
    statusPartial: {
        color: '#f59e0b',
        fontWeight: 'bold',
    },
    statusPending: {
        color: '#dc2626',
        fontWeight: 'bold',
    },

    // Section des versements détaillés
    versementSection: {
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#f0f9ff',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#bae6fd',
        padding: 10,
    },
    versementTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#0369a1',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    versementSubTable: {
        width: '100%',
        marginBottom: 10,
    },
    versementHeader: {
        backgroundColor: '#0c4a6e',
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    versementHeaderCell: {
        fontSize: 6.5,
        fontWeight: 'bold',
        color: 'white',
    },
    versementRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0f2fe',
        paddingVertical: 4,
        paddingHorizontal: 5,
    },
    versementRowEven: {
        backgroundColor: '#f8fafc',
    },
    versementCell: {
        fontSize: 7,
        color: '#334155',
    },
    colDate: { width: '20%' },
    colDossier: { width: '35%' },
    colMontantVers: { width: '20%', textAlign: 'right' },
    colMode: { width: '25%', textAlign: 'center'},

    // Section récapitulative client
    recapSection: {
        backgroundColor: '#fef3c7',
        borderRadius: 6,
        padding: 10,
        marginTop: 10,
    },
    recapTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    recapRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#fde68a',
    },
    recapRowLast: {
        borderBottomWidth: 0,
        marginTop: 5,
        paddingTop: 5,
        backgroundColor: '#fde68a',
        borderRadius: 4,
        paddingHorizontal: 5,
    },
    recapLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#78350f',
    },
    recapValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#92400e',
        fontFamily: 'Courier',
    },
    recapValueGrand: {
        fontSize: 10,
        fontWeight: 'extrabold',
        color: '#78350f',
        fontFamily: 'Courier',
    },

    // Barre de progression
    progressBar: {
        marginTop: 8,
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#16a34a',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 7,
        color: '#64748b',
        marginTop: 4,
        textAlign: 'center',
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

// Composant des informations du client
const ClientInfo = ({ client }) => (
    <View style={styles.clientInfoSection}>
        <Text style={styles.clientInfoTitle}>Informations Client</Text>
        <View style={styles.clientInfoRow}>
            <Text style={styles.clientInfoLabel}>Nom complet :</Text>
            <Text style={styles.clientInfoValue}>{client.name}</Text>
        </View>
        {client.phone && (
            <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Téléphone :</Text>
                <Text style={styles.clientInfoValue}>{client.phone}</Text>
            </View>
        )}
        {client.email && (
            <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Email :</Text>
                <Text style={styles.clientInfoValue}>{client.email}</Text>
            </View>
        )}
        {client.adresse && (
            <View style={styles.clientInfoRow}>
                <Text style={styles.clientInfoLabel}>Adresse :</Text>
                <Text style={styles.clientInfoValue}>{client.adresse}</Text>
            </View>
        )}
    </View>
);

// Composant des statistiques du client
const ClientStats = ({ client }) => (
    <View style={styles.clientStatsBar}>
        <View style={styles.clientStatItem}>
            <Text style={styles.clientStatLabel}>Nombre de dossiers</Text>
            <Text style={styles.clientStatValue}>{client.stats.nbDossiers}</Text>
        </View>
        <View style={styles.clientStatItem}>
            <Text style={styles.clientStatLabel}>Montant total</Text>
            <Text style={styles.clientStatValue}>
                {client.stats.totalMontant.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
            </Text>
        </View>
        <View style={styles.clientStatItem}>
            <Text style={styles.clientStatLabel}>Total versé</Text>
            <Text style={styles.clientStatValue}>
                {client.stats.totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
            </Text>
        </View>
        <View style={styles.clientStatItem}>
            <Text style={styles.clientStatLabel}>Restant dû</Text>
            <Text style={styles.clientStatValue}>
                {client.stats.totalReste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
            </Text>
        </View>
    </View>
);

// Composant du tableau des dossiers
const DossiersTable = ({ dossiers }) => {
    const getStatusStyle = (reste, versements) => {
        if (reste <= 0) return { text: 'SOLDÉ', style: styles.statusPaid };
        if (versements > 0) return { text: 'PARTIELLEMENT PAYÉ', style: styles.statusPartial };
        return { text: 'NON PAYÉ', style: styles.statusPending };
    };

    return (
        <View style={styles.table}>
            {/* En-tête */}
            <View style={styles.tableHeader}>
                <View style={[styles.tableHeaderCell, styles.colName]}>
                    <Text>Désignation du dossier</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colMontant]}>
                    <Text>Montant (FCFA)</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colVersements]}>
                    <Text>Versements (FCFA)</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colReste]}>
                    <Text>Restant (FCFA)</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colStatut]}>
                    <Text>Statut</Text>
                </View>
            </View>

            {/* Corps du tableau */}
            {dossiers.map((dossier, idx) => {
                const totalDossier = Number(dossier.montant_total);
                const versements = (dossier.versement || []).reduce((sum, v) => sum + Number(v.montant), 0);
                const reste = totalDossier - versements;
                const status = getStatusStyle(reste, versements);

                return (
                    <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowEven]}>
                        <View style={[styles.tableCell, styles.colName]}>
                            <Text>{dossier.dossierName || dossier.reference || `Dossier ${idx + 1}`}</Text>
                        </View>
                        <View style={[styles.tableCell, styles.colMontant]}>
                            <Text style={{ fontFamily: 'Courier' }}>
                                {totalDossier.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                            </Text>
                        </View>
                        <View style={[styles.tableCell, styles.colVersements]}>
                            <Text style={{ fontFamily: 'Courier', color: '#16a34a' }}>
                                {versements.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                            </Text>
                        </View>
                        <View style={[styles.tableCell, styles.colReste]}>
                            <Text style={{ fontFamily: 'Courier', color: reste > 0 ? '#dc2626' : '#16a34a' }}>
                                {reste.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                            </Text>
                        </View>
                        <View style={[styles.tableCell, styles.colStatut, status.style]}>
                            <Text>{status.text}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

// Composant des versements détaillés
const VersementsDetail = ({ dossiers }) => {
    // Collecter tous les versements avec leur dossier d'origine
    const allVersements = [];

    dossiers.forEach(dossier => {
        const versements = dossier.versement || [];
        versements.forEach(vers => {
            allVersements.push({
                ...vers,
                dossierName: dossier.dossierName || dossier.reference || 'Sans nom',
                date: vers.date || vers.createdAt,
            });
        });
    });

    if (allVersements.length === 0) {
        return (
            <View style={styles.versementSection}>
                <Text style={styles.versementTitle}>Historique des versements</Text>
                <Text style={{ textAlign: 'center', color: '#64748b', padding: 10 }}>
                    Aucun versement enregistré pour ce client
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.versementSection}>
            <Text style={styles.versementTitle}>Historique détaillé des versements</Text>

            <View style={styles.versementSubTable}>
                {/* En-tête */}
                <View style={styles.versementHeader}>
                    <View style={[styles.versementHeaderCell, styles.colDate]}>
                        <Text>DATE</Text>
                    </View>
                    <View style={[styles.versementHeaderCell, styles.colDossier]}>
                        <Text>DOSSIER</Text>
                    </View>
                    <View style={[styles.versementHeaderCell, styles.colMontantVers]}>
                        <Text>MONTANT (FCFA)</Text>
                    </View>
                    <View style={[styles.versementHeaderCell, styles.colMode]}>
                        <Text>MODE DE PAIEMENT</Text>
                    </View>
                </View>

                {/* Corps */}
                {allVersements.map((vers, idx) => (
                    <View key={idx} style={[styles.versementRow, idx % 2 === 1 && styles.versementRowEven]}>
                        <View style={[styles.versementCell, styles.colDate]}>
                            <Text>{new Date(vers.date).toLocaleDateString('fr-FR')}</Text>
                        </View>
                        <View style={[styles.versementCell, styles.colDossier]}>
                            <Text>{vers.dossierName}</Text>
                        </View>
                        <View style={[styles.versementCell, styles.colMontantVers]}>
                            <Text style={{ fontFamily: 'Courier', fontWeight: 'bold', color: '#16a34a' }}>
                                {Number(vers.montant).toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                            </Text>
                        </View>
                        <View style={[styles.versementCell, styles.colMode]}>
                            <Text>{vers.mode || 'Espèces'}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Composant récapitulatif client
const ClientRecap = ({ client }) => {
    const tauxPaiement = client.stats.totalMontant > 0
        ? Math.round((client.stats.totalVersements / client.stats.totalMontant) * 100)
        : 0;

    return (
        <View style={styles.recapSection}>
            <Text style={styles.recapTitle}>RÉCAPITULATIF FINANCIER</Text>

            <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Nombre total de dossiers :</Text>
                <Text style={styles.recapValue}>{client.stats.nbDossiers}</Text>
            </View>

            <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Montant total facturé :</Text>
                <Text style={styles.recapValue}>
                    {client.stats.totalMontant.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Total des versements :</Text>
                <Text style={styles.recapValue}>
                    {client.stats.totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={styles.recapRowLast}>
                <Text style={styles.recapLabel}>Restant à payer :</Text>
                <Text style={styles.recapValueGrand}>
                    {client.stats.totalReste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={{ marginTop: 10 }}>
                <Text style={styles.progressText}>
                    Taux de paiement : {tauxPaiement}%
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(tauxPaiement, 100)}%` }]} />
                </View>
            </View>

            {client.stats.totalReste <= 0 && (
                <Text style={{
                    marginTop: 8,
                    textAlign: 'center',
                    fontSize: 8,
                    fontWeight: 'bold',
                    color: '#16a34a'
                }}>
                    Ce client a soldé tous ses dossiers
                </Text>
            )}
        </View>
    );
};

// Composant principal du rapport pour un seul client
export const ClientReportPDF = ({ client, entreprise }) => {
    // Calculer les statistiques du client
    const clientStats = {
        nbDossiers: client.dossiers.length,
        totalMontant: 0,
        totalVersements: 0,
        totalReste: 0,
    };

    client.dossiers.forEach(dossier => {
        const montantDossier = Number(dossier.montant_total);
        const versementsDossier = (dossier.versement || []).reduce((sum, v) => sum + Number(v.montant), 0);

        clientStats.totalMontant += montantDossier;
        clientStats.totalVersements += versementsDossier;
    });

    clientStats.totalReste = clientStats.totalMontant - clientStats.totalVersements;

    const enrichedClient = {
        ...client,
        stats: clientStats,
    };

    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const title =  `FICHE CLIENT \n ${client.name}`
 

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.topBar} />

                <View style={styles.header}>
                    <ReportHeader entreprise={entreprise} title={title} subtitle={currentDate} logoUrl={'/logo.jpeg'} />
                </View>

                <ClientInfo client={enrichedClient} />
                <ClientStats client={enrichedClient} />
                <DossiersTable dossiers={client.dossiers} />
                <VersementsDetail dossiers={client.dossiers} />
                <ClientRecap client={enrichedClient} />

                {/* Pied de page */}
                <View style={styles.footer} fixed>
                    <Text>© {entreprise.nom} · NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}</Text>
                    {/* <Text>Document confidentiel</Text> */}
                </View>

                <Text style={styles.pageNumber} fixed>
                    Page 1 / 1
                </Text>
            </Page>
        </Document>
    );
};

// Fonction pour générer et ouvrir le rapport d'un client
export const printClientReport = async (client, entreprise) => {
    try {
        const blob = await pdf(
            <ClientReportPDF
                client={client}
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

// Fonction pour télécharger le rapport d'un client
export const downloadClientReport = async (client, entreprise, fileName) => {
    try {
        const blob = await pdf(
            <ClientReportPDF
                client={client}
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
export const GenerateClientReport = async (client, entreprise) => {
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

    const fileName = `fiche_client_${client.name}_${new Date().toLocaleDateString('fr-FR')}.pdf`;

    // Pour ouvrir dans une nouvelle fenêtre
    // await printClientReport(client, entreprise);

    // Ou pour télécharger directement
    await downloadClientReport(client, entreprise, fileName);
};

// Exemple d'appel
// const handleViewClientReport = () => {
//   const selectedClient = {
//     name: "Jean Dupont",
//     phone: "+221 77 123 45 67",
//     email: "jean.dupont@email.com",
//     adresse: "Dakar, Sénégal",
//     dossiers: [
//       {
//         id: 1,
//         dossierName: "Transport Maritime",
//         reference: "TRANS-001",
//         montant_total: 1500000,
//         versement: [
//           { date: "2024-01-15", montant: 500000, mode: "Virement" },
//           { date: "2024-02-10", montant: 300000, mode: "Espèces" }
//         ]
//       },
//       {
//         id: 2,
//         dossierName: "Douane Import",
//         reference: "DOU-002",
//         montant_total: 850000,
//         versement: [
//           { date: "2024-01-20", montant: 850000, mode: "Chèque" }
//         ]
//       }
//     ]
//   };

//   generateClientReport(selectedClient);
// };