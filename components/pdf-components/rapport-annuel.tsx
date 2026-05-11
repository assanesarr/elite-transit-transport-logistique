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

// Styles avec largeurs fixes (pas de pourcentages dynamiques)
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
    header: {
        marginBottom: 15,
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: '#0f172a',
        paddingHorizontal: 12,
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
        marginTop: 12
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
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#f8fafc',
        padding: 8,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#1e3a8a',
        borderRadius: 4,
        gap: 15,
        flexWrap: 'wrap',
    },
    statItem: {
        flex: 1,
        minWidth: 90,
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
    monthSection: {
        marginTop: 10,
        marginBottom: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    monthHeader: {
        backgroundColor: '#334155',
        paddingVertical: 6,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    monthName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'white',
    },
    monthStats: {
        fontSize: 8,
        color: '#cbd5e1',
    },
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
    monthTotalRow: {
        flexDirection: 'row',
        backgroundColor: '#fef3c7',
        paddingVertical: 5,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#fde68a',
    },
    monthTotalLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#92400e',
    },
    monthTotalValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#92400e',
        fontFamily: 'Courier',
    },
    // Largeurs fixes pour les colonnes (en points)
    colDossierName: { width: 110 },
    colClient: { width: 90 },
    colMontant: { width: 70, textAlign: 'right' },
    colVersement: { width: 70, textAlign: 'right' },
    colReste: { width: 70, textAlign: 'right' },
    colStatutDossier: { width: 60, textAlign: 'center' },

    statusSold: {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
        padding: 2,
        borderRadius: 3,
        textAlign: 'center',
        fontSize: 6,
        fontWeight: 'bold',
        width: 50,
    },
    statusPartial: {
        backgroundColor: '#fed7aa',
        color: '#f59e0b',
        padding: 2,
        borderRadius: 3,
        textAlign: 'center',
        fontSize: 6,
        fontWeight: 'bold',
        width: 50,
    },
    statusPending: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: 2,
        borderRadius: 3,
        textAlign: 'center',
        fontSize: 6,
        fontWeight: 'bold',
        width: 50,
    },
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
    chartContainer: {
        marginTop: 15,
        backgroundColor: '#f8fafc',
        padding: 10,
        borderRadius: 4,
    },
    chartTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 8,
    },
    barItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    barLabel: {
        width: 45,
        fontSize: 6.5,
        color: '#64748b',
    },
    barTrack: {
        width: 200,
        height: 15,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    barFill: {
        height: 15,
        backgroundColor: '#3b82f6',
        borderRadius: 2,
        justifyContent: 'center',
        paddingLeft: 4,
    },
    barValue: {
        fontSize: 6,
        color: 'white',
        fontWeight: 'bold',
    },
    progressBar: {
        marginTop: 5,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
    },
    progressFill: {
        height: 4,
        backgroundColor: '#16a34a',
        borderRadius: 2,
    },
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

// Utilitaires sécurisés
const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
};

const safePercentage = (value, total) => {
    const safeTotal = safeNumber(total);
    if (safeTotal === 0) return 0;
    const pct = (safeNumber(value) / safeTotal) * 100;
    if (isNaN(pct) || !isFinite(pct)) return 0;
    return Math.min(Math.max(pct, 0), 100);
};

const formatMoney = (amount) => {
    const safeAmount = safeNumber(amount);
    return `${safeAmount.toLocaleString('fr-FR').replace(/\u202F/g, " ")} FCFA`;
};

// Composant d'en-tête
const ReportHeader = ({ stats, entreprise, currentDate, annee }) => (
    <>
        <View style={styles.head}>
            <View style={styles.headLeft}>

                <Image src={'/logo.jpeg'} style={styles.logo} />

                <View style={styles.companyInfo}>
                    <Text style={styles.companyName}>{entreprise.nom || 'Entreprise'}</Text>
                    <Text style={styles.companySub}>
                        {entreprise.adresse || ''} {entreprise.ville ? `· ${entreprise.ville}` : ''} {entreprise.pays ? `, ${entreprise.pays}` : ''}
                    </Text>
                    <Text style={styles.companySub}>
                        NINEA: {entreprise.ninea || '---'} · RCCM: {entreprise.rc || '---'}
                    </Text>
                    {entreprise.telephone && (
                        <Text style={styles.companySub}>
                            Tel: {entreprise.telephone} {entreprise.email ? `· Email: ${entreprise.email}` : ''}
                        </Text>
                    )}
                </View>
            </View>
            <View style={styles.headRight}>
                <Text style={styles.reportTitle}>RAPPORT ANNUEL {annee}</Text>
                <Text style={styles.reportSubtitle}>
                    Synthèse complète de l'activité
                </Text>
                <Text style={styles.reportSubtitle}>
                    Généré le {currentDate}
                </Text>
            </View>
        </View>

        <View style={styles.statsBar}>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Chiffre d'affaires</Text>
                <Text style={styles.statValue}>{formatMoney(stats.caTotal)}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Encaissements</Text>
                <Text style={styles.statValue}>{formatMoney(stats.totalPaye)}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Décaissements</Text>
                <Text style={styles.statValue}>{formatMoney(stats.totalDecaisse)}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Marge nette</Text>
                <Text style={styles.statValue}>{formatMoney(stats.margeNette)}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total dossiers</Text>
                <Text style={styles.statValue}>{stats.totalDossiers || 0}</Text>
            </View>
        </View>
    </>
);

// Composant Badge sécurisé
const StatusBadge = ({ status }) => {
    let badgeStyle = styles.statusPending;
    let text = 'EN ATTENTE';

    if (status === 'soldé') {
        badgeStyle = styles.statusSold;
        text = 'SOLDÉ';
    } else if (status === 'partiel') {
        badgeStyle = styles.statusPartial;
        text = 'PARTIEL';
    }

    return (
        <View style={badgeStyle}>
            <Text>{text}</Text>
        </View>
    );
};

// Composant pour les dossiers du mois
const MonthDossiersTable = ({ dossiers }) => {
    const getDossierStatus = (dossier) => {
        const total = safeNumber(dossier.montant_total);
        const versements = safeNumber(dossier.versements);
        const reste = total - versements;

        if (reste <= 0) return 'soldé';
        if (versements > 0) return 'partiel';
        return 'impayé';
    };

    if (!dossiers || dossiers.length === 0) {
        return (
            <View style={styles.subTable}>
                <View style={[styles.subTableRow, { justifyContent: 'center' }]}>
                    <Text style={{ textAlign: 'center', color: '#94a3b8' }}>Aucun dossier ce mois</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.subTable}>
            <View style={styles.subTableHeader}>
                <View style={styles.colDossierName}>
                    <Text style={styles.subTableHeaderCell}>Dossier</Text>
                </View>
                <View style={styles.colClient}>
                    <Text style={styles.subTableHeaderCell}>Client</Text>
                </View>
                <View style={styles.colMontant}>
                    <Text style={[styles.subTableHeaderCell, { textAlign: 'right' }]}>Montant</Text>
                </View>
                <View style={styles.colVersement}>
                    <Text style={[styles.subTableHeaderCell, { textAlign: 'right' }]}>Versé</Text>
                </View>
                <View style={styles.colReste}>
                    <Text style={[styles.subTableHeaderCell, { textAlign: 'right' }]}>Reste</Text>
                </View>
                <View style={styles.colStatutDossier}>
                    <Text style={[styles.subTableHeaderCell, { textAlign: 'center' }]}>Statut</Text>
                </View>
            </View>

            {dossiers.map((dossier, idx) => {
                const total = safeNumber(dossier.montant_total);
                const versements = safeNumber(dossier.versements);
                const reste = total - versements;
                const status = getDossierStatus(dossier);

                return (
                    <View
                        key={idx}
                        style={[styles.subTableRow, idx % 2 === 1 && styles.subTableRowEven]}
                    >
                        <View style={styles.colDossierName}>
                            <Text style={styles.subTableCell}>{dossier.reference || `Dossier ${idx + 1}`}</Text>
                        </View>
                        <View style={styles.colClient}>
                            <Text style={styles.subTableCell}>{dossier.clientNom || '—'}</Text>
                        </View>
                        <View style={styles.colMontant}>
                            <Text style={[styles.subTableCell, { fontFamily: 'Courier', textAlign: 'right' }]}>
                                {formatMoney(total)}
                            </Text>
                        </View>
                        <View style={styles.colVersement}>
                            <Text style={[styles.subTableCell, { fontFamily: 'Courier', color: '#16a34a', textAlign: 'right' }]}>
                                {formatMoney(versements)}
                            </Text>
                        </View>
                        <View style={styles.colReste}>
                            <Text style={[styles.subTableCell, { fontFamily: 'Courier', color: reste > 0 ? '#dc2626' : '#16a34a', textAlign: 'right' }]}>
                                {formatMoney(reste)}
                            </Text>
                        </View>
                        <View style={styles.colStatutDossier}>
                            <StatusBadge status={status} />
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

// Composant pour un mois
const MonthSection = ({ month, index }) => {
    const ca = safeNumber(month.ca);
    const encaisse = safeNumber(month.encaisse);
    const decaisse = safeNumber(month.decaisse);
    const marge = encaisse - decaisse;
    const reste = ca - encaisse;
    const tauxRecouvrement = ca > 0 ? Math.round((encaisse / ca) * 100) : 0;

    return (
        <View style={styles.monthSection} wrap={false}>
            <View style={styles.monthHeader}>
                <Text style={styles.monthName}>
                    {index + 1}. {month.nom || `Mois ${index + 1}`}
                </Text>
                <Text style={styles.monthStats}>
                    {month.dossiers?.length || 0} dossier(s) | CA: {formatMoney(ca)}
                </Text>
            </View>
            
            {/* Indicateurs financiers du mois */}
            <View style={{ 
                flexDirection: 'row', 
                backgroundColor: '#f8fafc', 
                padding: 6, 
                marginHorizontal: 0,
                borderBottomWidth: 1,
                borderBottomColor: '#e2e8f0'
            }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 6, color: '#64748b' }}>ENCAISSÉ</Text>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#16a34a' }}>
                        {formatMoney(encaisse)}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 6, color: '#64748b' }}>DÉCAISSÉ</Text>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#dc2626' }}>
                        {formatMoney(decaisse)}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 6, color: '#64748b' }}>MARGE</Text>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: marge >= 0 ? '#16a34a' : '#dc2626' }}>
                        {formatMoney(marge)}
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: 6, color: '#64748b' }}>RECOUVREMENT</Text>
                    <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#3b82f6' }}>
                        {tauxRecouvrement}%
                    </Text>
                </View>
            </View>
            
            <MonthDossiersTable dossiers={month.dossiers || []} />
            
            <View style={styles.monthTotalRow}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.monthTotalLabel}>TOTAL MOIS</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <Text style={[styles.monthTotalValue, { color: '#16a34a' }]}>
                        Encaissé: {formatMoney(encaisse)}
                    </Text>
                    <Text style={[styles.monthTotalValue, { color: '#dc2626' }]}>
                        Décaissé: {formatMoney(decaisse)}
                    </Text>
                    <Text style={[styles.monthTotalValue, { color: marge >= 0 ? '#16a34a' : '#dc2626' }]}>
                        Marge: {formatMoney(marge)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Graphique à barres sécurisé
const BarChart = ({ data, title }) => {
    if (!data || data.length === 0) return null;

    return (
        <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>{title}</Text>
            {data.map((item, idx) => {
                const percentage = safePercentage(item.percentage, 100);
                const showText = percentage > 15;

                return (
                    <View key={idx} style={styles.barItem}>
                        <Text style={styles.barLabel}>{item.label.substring(0, 8)}</Text>
                        <View style={styles.barTrack}>
                            <View style={[styles.barFill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: '#3b82f6' }]}>
                                {showText && (
                                    <Text style={styles.barValue}>{Math.round(percentage)}%</Text>
                                )}
                            </View>
                        </View>
                        <Text style={{ fontSize: 6, width: 65, textAlign: 'right' }}>
                            {formatMoney(item.value)}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

// Section des totaux annuels
const TotalSummary = ({ totals }) => {
    const caTotal = safeNumber(totals.caTotal);
    const totalPaye = safeNumber(totals.totalPaye);
    const tauxRecouvrement = caTotal > 0 ? Math.round((totalPaye / caTotal) * 100) : 0;
    const safeTaux = isNaN(tauxRecouvrement) ? 0 : Math.min(Math.max(tauxRecouvrement, 0), 100);

    return (
        <View style={styles.totalSection}>
            <Text style={styles.totalTitle}>RÉCAPITULATIF ANNUEL</Text>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Chiffre d'affaires total :</Text>
                <Text style={styles.totalValue}>{formatMoney(caTotal)}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total des encaissements :</Text>
                <Text style={styles.totalValue}>{formatMoney(totalPaye)}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total des décaissements :</Text>
                <Text style={styles.totalValue}>{formatMoney(safeNumber(totals.totalDecaisse))}</Text>
            </View>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Marge brute :</Text>
                <Text style={styles.totalValue}>{formatMoney(safeNumber(totals.margeNette))}</Text>
            </View>

            <View style={[styles.totalRow, styles.totalRowLast]}>
                <Text style={styles.totalLabel}>Reste à recouvrer :</Text>
                <Text style={styles.totalValueGrand}>{formatMoney(safeNumber(totals.resteAPercevoir))}</Text>
            </View>

            <View style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 7, color: '#64748b', marginBottom: 3 }}>
                    Taux de recouvrement: {safeTaux}%
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${safeTaux}%`, backgroundColor: '#16a34a' }]} />
                </View>
            </View>

            <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: '#dcfce7', padding: 5, borderRadius: 4 }}>
                    <Text style={{ fontSize: 6, color: '#166534', textAlign: 'center' }}>
                        Dossiers soldés
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#166534', textAlign: 'center' }}>
                        {safeNumber(totals.dossiersSoldes)}
                    </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fed7aa', padding: 5, borderRadius: 4 }}>
                    <Text style={{ fontSize: 6, color: '#92400e', textAlign: 'center' }}>
                        Dossiers partiels
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#92400e', textAlign: 'center' }}>
                        {safeNumber(totals.dossiersPartiels)}
                    </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#fee2e2', padding: 5, borderRadius: 4 }}>
                    <Text style={{ fontSize: 6, color: '#991b1b', textAlign: 'center' }}>
                        Dossiers impayés
                    </Text>
                    <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#991b1b', textAlign: 'center' }}>
                        {safeNumber(totals.dossiersImpayes)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Composant principal
export const RapportAnnuelPDF = ({ moisData, stats, entreprise, annee }) => {
    const safeMoisData = Array.isArray(moisData) ? moisData : [];
    const moisParPage = 2;
    const totalPages = Math.max(1, Math.ceil(safeMoisData.length / moisParPage));
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const renderPage = (pageNumber) => {
        const startIndex = (pageNumber - 1) * moisParPage;
        const endIndex = Math.min(startIndex + moisParPage, safeMoisData.length);
        const pageMois = safeMoisData.slice(startIndex, endIndex);
        const isLastPage = pageNumber === totalPages;

        // Données pour le graphique (top 5 mois) - sécurisé
        const topMois = [...safeMoisData]
            .filter(m => safeNumber(m.ca) > 0)
            .sort((a, b) => safeNumber(b.ca) - safeNumber(a.ca))
            .slice(0, 5)
            .map(m => ({
                label: (m.nom || '').substring(0, 3),
                value: safeNumber(m.ca),
                percentage: safePercentage(m.ca, stats.caTotal)
            }));

        return (
            <Page key={pageNumber} size="A4" style={styles.page} wrap>
                <View style={styles.topBar} />

                <View style={styles.header}>
                    <ReportHeader
                        stats={stats}
                        entreprise={entreprise}
                        currentDate={currentDate}
                        annee={annee}
                    />
                </View>

                {/* Graphique des meilleurs mois sur la première page */}
                {pageNumber === 1 && topMois.length > 0 && (
                    <BarChart data={topMois} title="Top 5 mois par chiffre d'affaires" />
                )}

                {/* Mois avec leurs dossiers */}
                {pageMois.map((mois, idx) => (
                    <MonthSection key={startIndex + idx} month={mois} index={startIndex + idx} />
                ))}

                {/* Totaux sur la dernière page */}
                {isLastPage && <TotalSummary totals={stats} />}

                {/* Pied de page */}
                <View style={styles.footer} fixed>
                    <Text>© {entreprise.nom || 'Entreprise'} · NINEA: {entreprise.ninea || '---'} · RCCM: {entreprise.rc || '---'}</Text>
                    <Text>Rapport annuel {annee}</Text>
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

// Fonction de génération des données mensuelles
// Fonction de génération des données mensuelles corrigée
export const generateMonthlyReport = (dossiers, clients) => {
    const safeDossiers = Array.isArray(dossiers) ? dossiers : [];
    const safeClients = Array.isArray(clients) ? clients : [];
    
    const mois = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const moisData = mois.map((nom, index) => {
        const dossiersMois = safeDossiers.filter(d => {
            if (!d.dateOuverture && !d.createdAt) return false;
            try {
                const date = new Date(d.dateOuverture || d.createdAt);
                return date.getMonth() === index && date.getFullYear() === new Date().getFullYear();
            } catch {
                return false;
            }
        });
        
        const dossiersEnrichis = dossiersMois.map(d => {
            const client = safeClients.find(c => c.id === d.clientId);
            
            // Calcul des versements (encaissements)
            const versements = (d.versement || []).reduce((sum, v) => sum + safeNumber(v.montant), 0);
            
            // Calcul des payements (décaissements)
            const payements = (d.payements || []).reduce((sum, p) => sum + safeNumber(p.montant), 0);
            
            return {
                ...d,
                clientNom: client?.name || client?.nom || 'Client inconnu',
                versements,
                payements,
                reste: safeNumber(d.montant_total) - versements
            };
        });
        
        const ca = dossiersEnrichis.reduce((sum, d) => sum + safeNumber(d.montant_total), 0);
        const encaisse = dossiersEnrichis.reduce((sum, d) => sum + d.versements, 0);
        const decaisse = dossiersEnrichis.reduce((sum, d) => sum + d.payements, 0);
        
        return {
            nom,
            index,
            dossiers: dossiersEnrichis,
            ca,
            encaisse,
            decaisse,
            reste: ca - encaisse
        };
    });
    
    // Stats annuelles
    const totalDossiers = safeDossiers.length;
    const caTotal = moisData.reduce((sum, m) => sum + m.ca, 0);
    const totalPaye = moisData.reduce((sum, m) => sum + m.encaisse, 0);
    const totalDecaisse = moisData.reduce((sum, m) => sum + m.decaisse, 0);
    const resteAPercevoir = caTotal - totalPaye;
    const margeNette = totalPaye - totalDecaisse;
    
    // Comptage des statuts des dossiers
    let dossiersSoldes = 0;
    let dossiersPartiels = 0;
    let dossiersImpayes = 0;
    
    safeDossiers.forEach(d => {
        const total = safeNumber(d.montant_total);
        const versements = (d.versement || []).reduce((sum, v) => sum + safeNumber(v.montant), 0);
        const reste = total - versements;
        
        if (reste <= 0) dossiersSoldes++;
        else if (versements > 0) dossiersPartiels++;
        else dossiersImpayes++;
    });
    
    // Comptage par statut (nouveau, attente_doc, en_cours, cloture, solde)
    const statutsCount = {
        nouveau: 0,
        attente_doc: 0,
        en_cours: 0,
        cloture: 0,
        solde: 0
    };
    
    safeDossiers.forEach(d => {
        if (d.statut && statutsCount.hasOwnProperty(d.statut)) {
            statutsCount[d.statut]++;
        }
    });
    
    const stats = {
        caTotal,
        totalPaye,
        totalDecaisse,
        margeNette,
        resteAPercevoir,
        totalDossiers,
        dossiersSoldes,
        dossiersPartiels,
        dossiersImpayes,
        statutsCount
    };
    
    return { moisData, stats };
};
// Fonction d'export
export const PrintRapportAnnuel = async (dossiers, clients, entreprise) => {
    try {
        const annee = new Date().getFullYear();
        const { moisData, stats } = generateMonthlyReport(dossiers, clients);

        const blob = await pdf(
            <RapportAnnuelPDF
                moisData={moisData}
                stats={stats}
                entreprise={entreprise || {}}
                annee={annee}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const win = window.open(url, '_blank', 'width=1024,height=900');

        if (win) {
            win.focus();
        }

        setTimeout(() => URL.revokeObjectURL(url), 500);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la génération du rapport: ' + error.message);
    }
};

// Fonction de téléchargement
export const DownloadRapportAnnuel = async (dossiers, clients, entreprise) => {
    try {
        const annee = new Date().getFullYear();
        const { moisData, stats } = generateMonthlyReport(dossiers, clients);

        const blob = await pdf(
            <RapportAnnuelPDF
                moisData={moisData}
                stats={stats}
                entreprise={entreprise || {}}
                annee={annee}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport_annuel_${annee}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 500);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du téléchargement: ' + error.message);
    }
};