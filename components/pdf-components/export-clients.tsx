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
import { ReportHeader } from './ReportHeader';

// Styles inspirés de la facture
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
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
    marginBottom: 20,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    // padding: 15,
    marginBottom: 15,
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
    fontSize: 14,
    fontWeight: 'extrabold',
    color: 'white',
    marginBottom: 4,
  },
  companySub: {
    fontSize: 7,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 1.3,
  },
  headRight: {
    alignItems: 'flex-end',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'extrabold',
    color: 'white',
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 9,
    color: '#94a3b8',
  },
  // Section stats
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 10,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: '#1e3a8a',
    borderRadius: 4,
    gap: 20,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  // Tableau
  table: {
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
  },
  tableHeader: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingVertical: 6,
    paddingHorizontal: 5,
    minHeight: 28,
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  tableCell: {
    fontSize: 8,
    color: '#334155',
  },
  // Colonnes
  colName: { width: '23%' },
  colDossiers: { width: '10%' },
  colStatut: { width: '12%' },
  colVersements: { width: '18%', textAlign: 'right' },
  colNetAPayer: { width: '18%', textAlign: 'right' },
  colReste: { width: '19%', textAlign: 'right' },

  // Styles pour les statuts
  statusPaid: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  statusInProgress: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  statusNew: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },

  // Section total sur dernière page
  totalSection: {
    marginTop: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bae6fd',
    padding: 12,
  },
  totalTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 10,
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

  // Pied de page
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    fontSize: 7,
    color: '#94a3b8',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 25,
    right: 30,
    fontSize: 7,
    color: '#94a3b8',
  },
});


const Statusbar = ({ stats }) => {

  return (
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
    </View>
  )
}

// Composant tableau des clients
const ClientTable = ({ rows, startIndex, endIndex }) => {
  const pageRows = rows.slice(startIndex, endIndex);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Payé': return styles.statusPaid;
      case 'En cours': return styles.statusInProgress;
      case 'Nouveau': return styles.statusNew;
      default: return {};
    }
  };

  const getStatusText = (status) => {
    if (status === 'Payé') return '✓ PAYÉ';
    if (status === 'En cours') return '⌛ EN COURS';
    return '🆕 NOUVEAU';
  };

  return (
    <View style={styles.table}>
      {/* En-tête du tableau */}
      <View style={styles.tableHeader}>
        <View style={[styles.tableHeaderCell, styles.colName]}>
          <Text>Nom du client</Text>
        </View>
        <View style={[styles.tableHeaderCell, styles.colDossiers]}>
          <Text>Dossiers</Text>
        </View>
        <View style={[styles.tableHeaderCell, styles.colStatut]}>
          <Text>Statut</Text>
        </View>
        <View style={[styles.tableHeaderCell, styles.colVersements]}>
          <Text>Versements</Text>
        </View>
        <View style={[styles.tableHeaderCell, styles.colNetAPayer]}>
          <Text>Net à payer</Text>
        </View>
        <View style={[styles.tableHeaderCell, styles.colReste]}>
          <Text>Restant dû</Text>
        </View>
      </View>

      {/* Corps du tableau */}
      {pageRows.map((row, index) => {
        const globalIndex = startIndex + index;
        return (
          <View
            key={globalIndex}
            style={[
              styles.tableRow,
              globalIndex % 2 === 1 && styles.tableRowEven
            ]}
          >
            <View style={[styles.tableCell, styles.colName]}>
              <Text>{row.name}</Text>
            </View>
            <View style={[styles.tableCell, styles.colDossiers]}>
              <Text>{row.dossiers}</Text>
            </View>
            <View style={[styles.tableCell, styles.colStatut, getStatusStyle(row.status)]}>
              <Text>{getStatusText(row.status)}</Text>
            </View>
            <View style={[styles.tableCell, styles.colVersements]}>
              <Text style={{ fontFamily: 'Courier' }}>
                {row.versements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
              </Text>
            </View>
            <View style={[styles.tableCell, styles.colNetAPayer]}>
              <Text style={{ fontFamily: 'Courier', fontWeight: 'bold' }}>
                {row.total.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
              </Text>
            </View>
            <View style={[styles.tableCell, styles.colReste]}>
              <Text style={{ fontFamily: 'Courier', color: row.reste > 0 ? '#dc2626' : '#16a34a' }}>
                {row.reste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Composant des totaux généraux (dernière page)
const TotalSummary = ({ totals }) => (
  <View style={styles.totalSection}>
    <Text style={styles.totalTitle}>RÉCAPITULATIF GÉNÉRAL</Text>

    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total des versements :</Text>
      <Text style={styles.totalValue}>
        {totals.totalVersements.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
      </Text>
    </View>

    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total net à payer :</Text>
      <Text style={styles.totalValue}>
        {totals.totalNetAPayer.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
      </Text>
    </View>

    <View style={[styles.totalRow, styles.totalRowLast]}>
      <Text style={styles.totalLabel}>Total restant dû :</Text>
      <Text style={styles.totalValueGrand}>
        {totals.totalReste.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
      </Text>
    </View>

    {totals.tauxGlobal !== undefined && (
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 7, color: '#64748b', marginBottom: 3 }}>
          Taux de recouvrement global: {totals.tauxGlobal}%
        </Text>
        <View style={{ height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
          <View
            style={{
              width: `${Math.min(totals.tauxGlobal, 100)}%`,
              height: '100%',
              backgroundColor: '#16a34a',
              borderRadius: 2
            }}
          />
        </View>
      </View>
    )}
  </View>
);

// Composant principal du rapport avec pagination
export const ClientReportPDF = ({ clients, stats, entreprise }) => {
  // Calcul des données du tableau
  const rows = clients.map((client) => {
    const total = client.dossiers.reduce(
      (sum, v) => sum + Number(v.montant_total),
      0
    );

    const versements = client.dossiers
      .flatMap((d) => d.versement || [])
      .reduce((sum, v) => sum + Number(v.montant), 0);

    const reste = total - versements;
    const statut = total === 0 && versements === 0 ? "Nouveau" : reste <= 0 ? "Payé" : "En cours";

    return {
      name: client.name,
      dossiers: `${client.dossiers.length}`,
      status: statut,
      versements,
      total,
      reste,
    };
  });

  // Calcul des totaux généraux
  const totals = rows.reduce((acc, row) => ({
    totalVersements: acc.totalVersements + row.versements,
    totalNetAPayer: acc.totalNetAPayer + row.total,
    totalReste: acc.totalReste + row.reste,
  }), { totalVersements: 0, totalNetAPayer: 0, totalReste: 0 });

  // Calcul du taux de recouvrement global
  totals.tauxGlobal = totals.totalNetAPayer > 0
    ? Math.round((totals.totalVersements / totals.totalNetAPayer) * 100)
    : 0;

  const rowsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const renderPage = (pageNumber) => {
    const startIndex = (pageNumber - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
    const isLastPage = pageNumber === totalPages;
    const title = 'RAPPORT DES CLIENTS'

    return (
      <Page key={pageNumber} size="A4" style={styles.page} wrap>
        <View style={styles.topBar} />

        <View style={styles.header}>
          <ReportHeader
            // stats={stats}
            logoUrl={'/logo.jpeg'}
            entreprise={entreprise}
            subtitle={currentDate}
            title={title}

          />
          <Statusbar stats={stats} />
        </View>

        <ClientTable
          rows={rows}
          startIndex={startIndex}
          endIndex={endIndex}
        />

        {isLastPage && <TotalSummary totals={totals} />}

        <View style={styles.footer} fixed>
          <Text>© {entreprise.nom} · NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}</Text>
          {/* <Text>Généré le {currentDate}</Text> */}
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

export const ExportTableClientPDF = async (clients, entreprise) => {
  // const entreprise = {
  //   nom: "ELITE TRANSIT TRANSPORT LOGISTIQUE",
  //   adresse: "19, Boulevard Djily Mbaye",
  //   ville: "Dakar",
  //   pays: "Sénégal",
  //   ninea: "005553020",
  //   rc: "SN-DKR-2015-13017",
  //   telephone: "+221 33 822 48 67",
  //   email: "elitetransit16@gmail.com"
  // };

  const stats = {
    totalClients: clients.length,
    totalDossiers: clients.reduce((sum, c) => sum + c.dossiers.length, 0),
    totalMontant: clients.reduce((sum, c) =>
      sum + c.dossiers.reduce((s, d) => s + Number(d.montant_total), 0), 0
    )
  };

  const fileName = `rapport_clients_${new Date().toLocaleDateString('fr-FR')}.pdf`;

  // Pour ouvrir dans une nouvelle fenêtre
  // await printClientReport(clients, stats, entreprise);

  // Ou pour télécharger directement
  await downloadClientReport(clients, stats, entreprise, fileName);
};