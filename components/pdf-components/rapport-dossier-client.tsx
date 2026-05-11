// @ts-nocheck
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet
} from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';
import { ReportHeader } from './ReportHeader';


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
        // paddingVertical: 0,
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
        marginTop: 12,
        alignItems: 'flex-end',
    },
    reportTitle: {
        fontSize: 11,
        fontWeight: 'extrabold',
        color: 'white',
        marginBottom: 3,
        textAlign: 'right',
    },
    reportSubtitle: {
        fontSize: 8,
        color: '#94a3b8',
        textAlign: 'right',
    },
    // Section infos dossier
    infoSection: {
        backgroundColor: '#f8fafc',
        padding: 10,
        marginBottom: 15,
        borderLeftWidth: 3,
        borderLeftColor: '#1e3a8a',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    infoRow: {
        flexDirection: 'row',
        width: '50%',
        marginBottom: 5,
    },
    infoLabel: {
        width: 100,
        fontSize: 7.5,
        color: '#64748b',
    },
    infoValue: {
        flex: 1,
        fontSize: 7.5,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    // Section statut
    statusSection: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10,
    },
    statusCard: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 6.5,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 3,
    },
    statusValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusNew: { color: '#f59e0b' },
    statusEnCours: { color: '#3b82f6' },
    statusCloture: { color: '#8b5cf6' },
    statusSolde: { color: '#16a34a' },
    statusAttenteDoc: { color: '#ef4444' },

    // Section montants
    montantsSection: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10,
    },
    montantCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
    },
    montantCardBlue: {
        backgroundColor: '#eff6ff',
        borderColor: '#bfdbfe',
    },
    montantCardGreen: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    montantCardOrange: {
        backgroundColor: '#fff7ed',
        borderColor: '#fed7aa',
    },
    montantCardGray: {
        backgroundColor: '#f1f5f9',
        borderColor: '#cbd5e1',
    },
    montantLabel: {
        fontSize: 7,
        color: '#64748b',
        marginBottom: 5,
    },
    montantValue: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Courier',
    },
    montantValueBlue: { color: '#1e40af' },
    montantValueGreen: { color: '#16a34a' },
    montantValueOrange: { color: '#ea580c' },
    montantValueGray: { color: '#16a34a' },

    // Barre de progression
    progressSection: {
        marginBottom: 15,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#16a34a',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 7,
        color: '#64748b',
        marginTop: 4,
        textAlign: 'center',
    },

    // Tableau des prestations
    prestationsTable: {
        width: '100%',
        marginBottom: 15,
    },
    tableHeader: {
        backgroundColor: '#1e3a8a',
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 6,
    },
    tableHeaderCell: {
        fontSize: 7,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingVertical: 5,
        paddingHorizontal: 6,
    },
    tableRowEven: {
        backgroundColor: '#f8fafc',
    },
    tableCell: {
        fontSize: 7.5,
        color: '#475569',
    },
    colPrestation: { width: '60%' },
    colMontantPrest: { width: '40%', textAlign: 'right' },

    // Tableau des versements
    versementsTable: {
        width: '100%',
        marginBottom: 15,
    },
    colDate: { width: '15%' },
    colMontant: { width: '20%', textAlign: 'right' },
    colMode: { width: '20%', textAlign: 'center' },
    colRef: { width: '25%' },
    colMethod: { width: '20%' },

    // Tableau des décaissements par catégorie
    decaissementsTable: {
        width: '100%',
        marginBottom: 15,
    },
    colPayementDate: { width: '15%' },
    colPayementMontant: { width: '15%', textAlign: 'right' },
    colPayementCategorie: { width: '25%', textAlign: 'center' },
    colPayementMode: { width: '20%', textAlign: 'center' },
    colPayementRef: { width: '25%' },

    // Section récapitulative
    recapSection: {
        backgroundColor: '#fef3c7',
        borderRadius: 6,
        padding: 10,
        marginTop: 10,
    },
    recapSectionSold: {
        backgroundColor: '#f0fdf4',
        borderRadius: 6,
        padding: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    recapTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    recapTitleSold: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#16a34a',
        marginBottom: 8,
        textTransform: 'uppercase',
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
    recapRowSold: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#bbf7d0',
    },
    recapRowSoldLast: {
        borderBottomWidth: 0,
        marginTop: 5,
        paddingTop: 5,
        backgroundColor: '#bbf7d0',
        borderRadius: 4,
        paddingHorizontal: 5,
    },
    recapLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#78350f',
    },
    recapLabelSold: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#166534',
    },
    recapValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#92400e',
        fontFamily: 'Courier',
    },
    recapValueSold: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#16a34a',
        fontFamily: 'Courier',
    },
    recapValueGrand: {
        fontSize: 10,
        fontWeight: 'extrabold',
        color: '#78350f',
        fontFamily: 'Courier',
    },
    recapValueGrandSold: {
        fontSize: 10,
        fontWeight: 'extrabold',
        color: '#16a34a',
        fontFamily: 'Courier',
    },
    soldBadge: {
        backgroundColor: '#16a34a',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 5,
    },
    soldBadgeText: {
        color: 'white',
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
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

// Composant d'en-tête avec nom du dossier et BL
// const ReportHeader = ({ entreprise, dossier, currentDate, logoUrl }) => {
//     // Construction du titre
//     let title = dossier.dossierName || dossier.reference;
//     if (dossier.bl) {
//         title += `\n BL: ${dossier.bl}`;
//     }

//     return (
//         <View style={styles.head}>
//             <View style={styles.headLeft}>
//                 {logoUrl && (
//                     <Image src={logoUrl} style={styles.logo} />
//                 )}
//                 <View style={styles.companyInfo}>
//                     <Text style={styles.companyName}>{entreprise.nom}</Text>
//                     <Text style={styles.companySub}>
//                         {entreprise.adresse} · {entreprise.ville}, {entreprise.pays}
//                     </Text>
//                     <Text style={styles.companySub}>
//                         NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}
//                     </Text>
//                     <Text style={styles.companySub}>
//                         Tel: {entreprise.telephone} · Email: {entreprise.email}
//                     </Text>
//                 </View>
//             </View>
//             <View style={styles.headRight}>
//                 <Text style={styles.reportTitle}>{title}</Text>
//                 <Text style={styles.reportSubtitle}>Établi le {currentDate}</Text>
//             </View>
//         </View>
//     );
// };

// Composant informations dossier
const DossierInfo = ({ dossier, client }) => (
    <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informations du dossier</Text>

        <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Client :</Text>
                <Text style={styles.infoValue}>{client?.name || 'Non spécifié'}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Référence :</Text>
                <Text style={styles.infoValue}>{dossier.reference}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nom du dossier :</Text>
                <Text style={styles.infoValue}>{dossier.dossierName || 'Sans nom'}</Text>
            </View>

            {dossier.bl && (
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>BL :</Text>
                    <Text style={styles.infoValue}>{dossier.bl}</Text>
                </View>
            )}

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type :</Text>
                <Text style={styles.infoValue}>{dossier.type || 'Non spécifié'}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date d'ouverture :</Text>
                <Text style={styles.infoValue}>
                    {dossier.dateOuverture ? new Date(dossier.dateOuverture).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date échéance :</Text>
                <Text style={styles.infoValue}>
                    {dossier.dateEcheance ? new Date(dossier.dateEcheance).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                </Text>
            </View>

            {dossier.port && (
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Port :</Text>
                    <Text style={styles.infoValue}>{dossier.port}</Text>
                </View>
            )}

            {dossier.responsable && (
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Responsable :</Text>
                    <Text style={styles.infoValue}>{dossier.responsable}</Text>
                </View>
            )}
        </View>
    </View>
);

// Composant statut
const DossierStatus = ({ dossier }) => {
    const getStatutStyle = (statut) => {
        switch (statut) {
            case 'solde': return styles.statusSolde;
            case 'en_cours': return styles.statusEnCours;
            case 'cloture': return styles.statusCloture;
            case 'nouveau': return styles.statusNew;
            case 'attente_doc': return styles.statusAttenteDoc;
            default: return {};
        }
    };

    const getStatutText = (statut) => {
        switch (statut) {
            case 'solde': return 'SOLDÉ';
            case 'en_cours': return 'EN COURS';
            case 'cloture': return 'CLÔTURÉ';
            case 'nouveau': return 'NOUVEAU';
            case 'attente_doc': return 'ATTENTE DOCUMENTS';
            default: return statut?.toUpperCase() || 'NON DÉFINI';
        }
    };

    return (
        <View style={styles.statusSection}>
            <View style={styles.statusCard}>
                <Text style={styles.statusLabel}>Statut du dossier</Text>
                <Text style={[styles.statusValue, getStatutStyle(dossier.statut)]}>
                    {getStatutText(dossier.statut)}
                </Text>
            </View>
            <View style={styles.statusCard}>
                <Text style={styles.statusLabel}>Priorité</Text>
                <Text style={[styles.statusValue, { color: dossier.priorite === 'haute' ? '#dc2626' : '#f59e0b' }]}>
                    {dossier.priorite?.toUpperCase() || 'NORMALE'}
                </Text>
            </View>
        </View>
    );
};

// Composant montants
const DossierMontants = ({ dossier, totalVersements, reste, tauxPaiement }) => {
    const isSold = reste <= 0;

    return (
        <View style={styles.montantsSection}>
            <View style={[styles.montantCard, styles.montantCardBlue]}>
                <Text style={styles.montantLabel}>Montant total du dossier</Text>
                <Text style={[styles.montantValue, styles.montantValueBlue]}>
                    {dossier.montant_total.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={[styles.montantCard, styles.montantCardGreen]}>
                <Text style={styles.montantLabel}>Total versé</Text>
                <Text style={[styles.montantValue, styles.montantValueGreen]}>
                    {totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            {!isSold ? (
                <View style={[styles.montantCard, styles.montantCardOrange]}>
                    <Text style={styles.montantLabel}>Restant à payer</Text>
                    <Text style={[styles.montantValue, styles.montantValueOrange]}>
                        {reste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                    </Text>
                </View>
            ) : (
                <View style={[styles.montantCard, styles.montantCardGray]}>
                    <Text style={styles.montantLabel}>✅ Dossier soldé</Text>
                    <Text style={[styles.montantValue, styles.montantValueGray]}>
                        COMPLÈTEMENT PAYÉ
                    </Text>
                </View>
            )}
        </View>
    );
};

// Composant prestations
const PrestationsTable = ({ prestations }) => {
    if (!prestations || prestations.length === 0) {
        return null;
    }

    const totalPrestations = prestations.reduce((sum, p) => sum + (p.montant || 0), 0);

    return (
        <View style={styles.prestationsTable}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Prestations</Text>

            <View style={styles.tableHeader}>
                <View style={[styles.tableHeaderCell, styles.colPrestation]}>
                    <Text>Désignation</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colMontantPrest]}>
                    <Text>Montant (FCFA)</Text>
                </View>
            </View>

            {prestations.map((prestation, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowEven]}>
                    <View style={[styles.tableCell, styles.colPrestation]}>
                        <Text>{prestation.label || 'Prestation'}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colMontantPrest]}>
                        <Text style={{ fontFamily: 'Courier' }}>
                            {(prestation.montant || 0).toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                        </Text>
                    </View>
                </View>
            ))}

            <View style={[styles.tableRow, { backgroundColor: '#f0fdf4', fontWeight: 'bold' }]}>
                <View style={[styles.tableCell, styles.colPrestation]}>
                    <Text style={{ fontWeight: 'bold' }}>TOTAL PRESTATIONS</Text>
                </View>
                <View style={[styles.tableCell, styles.colMontantPrest]}>
                    <Text style={{ fontFamily: 'Courier', fontWeight: 'bold', color: '#16a34a' }}>
                        {totalPrestations.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Composant versements
const VersementsTable = ({ versements }) => {
    if (!versements || versements.length === 0) {
        return (
            <View style={styles.versementsTable}>
                <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Versements effectués</Text>
                <View style={{ padding: 10, backgroundColor: '#f8fafc', borderRadius: 4, alignItems: 'center' }}>
                    <Text style={{ color: '#64748b' }}>Aucun versement enregistré</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.versementsTable}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Versements effectués</Text>

            <View style={styles.tableHeader}>
                <View style={[styles.tableHeaderCell, styles.colDate]}>
                    <Text>Date</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colMontant]}>
                    <Text>Montant (FCFA)</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colMode]}>
                    <Text>Mode</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colRef]}>
                    <Text>Référence</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colMethod]}>
                    <Text>Méthode</Text>
                </View>
            </View>

            {versements.map((vers, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowEven]}>
                    <View style={[styles.tableCell, styles.colDate]}>
                        <Text>{new Date(vers.date).toLocaleDateString('fr-FR')}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colMontant]}>
                        <Text style={{ fontFamily: 'Courier', color: '#16a34a' }}>
                            {vers.montant.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                        </Text>
                    </View>
                    <View style={[styles.tableCell, styles.colMode]}>
                        <Text>{vers.mode || '-'}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colRef]}>
                        <Text>{vers.ref || '-'}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colMethod]}>
                        <Text>{vers.method || '-'}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

// Composant décaissements par catégorie
const PayementsTable = ({ payements }) => {
    if (!payements || payements.length === 0) {
        return (
            <View style={styles.decaissementsTable}>
                <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Décaissements par catégorie</Text>
                <View style={{ padding: 10, backgroundColor: '#f8fafc', borderRadius: 4, alignItems: 'center' }}>
                    <Text style={{ color: '#64748b' }}>Aucun décaissement enregistré</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.decaissementsTable}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>Décaissements par catégorie</Text>

            <View style={styles.tableHeader}>
                <View style={[styles.tableHeaderCell, styles.colPayementDate]}>
                    <Text>Date</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colPayementMontant]}>
                    <Text>Montant (FCFA)</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colPayementCategorie]}>
                    <Text>Catégorie</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colPayementMode]}>
                    <Text>Mode</Text>
                </View>
                <View style={[styles.tableHeaderCell, styles.colPayementRef]}>
                    <Text>Référence</Text>
                </View>
            </View>

            {payements.map((p, idx) => (
                <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowEven]}>
                    <View style={[styles.tableCell, styles.colPayementDate]}>
                        <Text>{new Date(p.date).toLocaleDateString('fr-FR')}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colPayementMontant]}>
                        <Text style={{ fontFamily: 'Courier', color: '#dc2626' }}>
                            {p.montant.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
                        </Text>
                    </View>
                    <View style={[styles.tableCell, styles.colPayementCategorie]}>
                        <Text style={{ fontWeight: 'bold', color: '#7c3aed' }}>{p.payement || 'Autre'}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colPayementMode]}>
                        <Text>{p.mode || p.method || 'Espèces'}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colPayementRef]}>
                        <Text>{p.ref || '-'}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

// Composant récapitulatif final
const FinalRecap = ({ dossier, totalVersements, totalPayements, reste, tauxPaiement }) => {
    const isSold = reste <= 0;

    if (isSold) {
        return (
            <View style={styles.recapSectionSold}>
                <Text style={styles.recapTitleSold}>✅ DOSSIER SOLDÉ</Text>

                <View style={styles.recapRowSold}>
                    <Text style={styles.recapLabelSold}>Montant total du dossier :</Text>
                    <Text style={styles.recapValueSold}>
                        {dossier.montant_total.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                    </Text>
                </View>

                <View style={styles.recapRowSold}>
                    <Text style={styles.recapLabelSold}>Total des versements (encaissements) :</Text>
                    <Text style={[styles.recapValueSold, { color: '#16a34a' }]}>
                        {totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                    </Text>
                </View>

                <View style={styles.recapRowSold}>
                    <Text style={styles.recapLabelSold}>Total des décaissements :</Text>
                    <Text style={[styles.recapValueSold, { color: '#dc2626' }]}>
                        {totalPayements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                    </Text>
                </View>

                <View style={styles.recapRowSoldLast}>
                    <Text style={styles.recapLabelSold}>Statut :</Text>
                    <Text style={styles.recapValueGrandSold}>
                        COMPLÈTEMENT SOLDÉ
                    </Text>
                </View>

                <View style={styles.soldBadge}>
                    <Text style={styles.soldBadgeText}>✓ PAYÉ INTÉGRALEMENT ✓</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.recapSection}>
            <Text style={styles.recapTitle}>RÉCAPITULATIF FINANCIER COMPLET</Text>

            <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Montant total du dossier :</Text>
                <Text style={styles.recapValue}>
                    {dossier.montant_total.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Total des versements (encaissements) :</Text>
                <Text style={[styles.recapValue, { color: '#16a34a' }]}>
                    {totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={styles.recapRow}>
                <Text style={styles.recapLabel}>Total des décaissements :</Text>
                <Text style={[styles.recapValue, { color: '#dc2626' }]}>
                    {totalPayements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
                </Text>
            </View>

            <View style={styles.recapRowLast}>
                <Text style={styles.recapLabel}>Restant à payer :</Text>
                <Text style={styles.recapValueGrand}>
                    {reste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
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
        </View>
    );
};

// Composant principal
export const DossierReportPDF = ({ dossier, client, entreprise }) => {
    // Calculer les totaux
    const totalVersements = (dossier.versement || []).reduce((sum, v) => sum + Number(v.montant), 0);
    const totalPayements = (dossier.payements || []).reduce((sum, p) => sum + Number(p.montant), 0);
    const reste = dossier.montant_total - totalVersements;
    const tauxPaiement = dossier.montant_total > 0
        ? Math.round((totalVersements / dossier.montant_total) * 100)
        : 0;

    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    let title = dossier.dossierName || dossier.reference;
    if (dossier.bl) {
        title += `\n BL: ${dossier.bl}`;
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.topBar} />

                <View style={styles.header}>
                    <ReportHeader entreprise={entreprise} title={title} subtitle={currentDate} logoUrl={"/logo.jpeg"} />
                </View>

                <DossierInfo dossier={dossier} client={client} />
                {/* <DossierStatus dossier={dossier} /> */}
                <DossierMontants
                    dossier={dossier}
                    totalVersements={totalVersements}
                    reste={reste}
                    tauxPaiement={tauxPaiement}
                />

                <PrestationsTable prestations={dossier.prestations} />
                <VersementsTable versements={dossier.versement} />
                <PayementsTable payements={dossier.payements} />
                <FinalRecap
                    dossier={dossier}
                    totalVersements={totalVersements}
                    totalPayements={totalPayements}
                    reste={reste}
                    tauxPaiement={tauxPaiement}
                />

                <View style={styles.footer} fixed>
                    <Text>© {entreprise.nom} · NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}</Text>
                    <Text>Référence: {dossier.reference}</Text>
                </View>

                <Text style={styles.pageNumber} fixed>
                    Page 1 / 1
                </Text>
            </Page>
        </Document>
    );
};

// Fonctions d'export
export const printDossierReport = async (dossier, client, entreprise) => {
    try {
        const blob = await pdf(
            <DossierReportPDF
                dossier={dossier}
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

export const downloadDossierReport = async (dossier, client, entreprise, fileName) => {
    try {
        const blob = await pdf(
            <DossierReportPDF
                dossier={dossier}
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
export const GenerateDossierReport = async (dossier, client, entreprise) => {
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

    const fileName = `dossier_${dossier.reference}_${client.name}.pdf`;

    // Pour ouvrir dans une nouvelle fenêtre
    //   await printDossierReport(dossier, client, entreprise);

    // Ou pour télécharger directement
    await downloadDossierReport(dossier, client, entreprise, fileName);
};

// Exemple d'appel avec vos données
const handleViewDossierReport = () => {
    const dossier = {
        id: "1",
        dossierName: "Importation Matériel",
        reference: "IMP-2024-001",
        clientId: "client-1",
        type: "Importation",
        description: "Importation de matériel électronique",
        dateOuverture: "2024-01-10",
        dateEcheance: "2024-03-10",
        priorite: "haute",
        responsable: "M. Diallo",
        port: "Dakar",
        bl: "BL-2024-001",
        montant_total: 2500000,
        versement: [
            { date: "2024-01-15", montant: 1000000, method: "Virement", mode: "Banque", ref: "VIR-001" },
            { date: "2024-02-10", montant: 500000, method: "Espèces", mode: "Cash", ref: "ESP-001" }
        ],
        payements: [
            { date: "2024-01-20", montant: 300000, ref: "PAY-001", method: "Virement", mode: "Banque", payement: "Frais de douane", note: "Paiement douane" },
            { date: "2024-01-25", montant: 200000, ref: "PAY-002", method: "Espèces", mode: "Cash", payement: "Transport", note: "Transport local" },
            { date: "2024-02-01", montant: 150000, ref: "PAY-003", method: "Chèque", mode: "Chèque", payement: "Frais administratifs", note: "Documents" }
        ],
        statut: "en_cours",
        createdAt: "2024-01-10",
        prestations: [
            { label: "Frais de douane", montant: 800000 },
            { label: "Transport maritime", montant: 1200000 },
            { label: "Transport terrestre", montant: 300000 },
            { label: "Frais de dossier", montant: 200000 }
        ]
    };

    const client = {
        name: "Jean Dupont",
        phone: "+221 77 123 45 67",
        email: "jean.dupont@email.com",
        adresse: "Dakar, Sénégal"
    };

    generateDossierReport(dossier, client);
};