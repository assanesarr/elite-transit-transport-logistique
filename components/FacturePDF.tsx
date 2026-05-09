// @ts-nocheck
import { fmtDT, resteApayer, tauxPaiement, totalPaye } from '@/lib/utils';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';

// Styles adaptés pour A4
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  topBar: {
    height: 4,
    backgroundColor: '#0f172a',
    marginBottom: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    flex: 1,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#0f172a',
    padding: 20,
    marginTop: 4,
  },
  headLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'extrabold',
    color: '#0f172a',
  },
  companyInfo: {
    color: 'white',
  },
  companySub: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'extrabold',
    color: '#1e3a8a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 6,
  },
  companyDetails: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  factureTitle: {
    fontSize: 18,
    fontWeight: 'extrabold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  factureNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  date: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  badgeGreen: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  badgeOrange: {
    backgroundColor: '#fed7aa',
    color: '#9b4d0c',
  },
  docTag: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'flex-end',
  },
  docType: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#94a3b8',
    marginBottom: 3,
  },
  docNum: {
    fontSize: 18,
    fontWeight: 'extrabold',
    color: 'white',
    fontFamily: 'Courier',
  },
  docDate: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  parties: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    gap: 15,
  },
  party: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#94a3b8',
    marginBottom: 5,
  },
  partyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  partyInfo: {
    fontSize: 9,
    color: '#475569',
    marginTop: 3,
    lineHeight: 1.4,
  },
  objet: {
    padding: 8,
    backgroundColor: '#fef3c7',
    borderBottom: '1px solid #fde68a',
    fontSize: 10,
  },
  objetStrong: {
    fontWeight: 'bold',
    color: '#92400e',
  },
  body: {
    padding: 15,
    flex: 1,
  },
  table: {
    width: '100%',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e2e8f0',
    minHeight: 28,
  },
  tableHeader: {
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
  },
  tableCell: {
    padding: 6,
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableCellBody: {
    padding: 5,
    fontSize: 9,
  },
  tableCellEven: {
    backgroundColor: '#f8fafc',
  },
  col1: { width: '6%' },
  col2: { width: '34%' },
  col3: { width: '8%' },
  col4: { width: '10%' },
  col5: { width: '20%', textAlign: 'right' },
  col6: { width: '22%', textAlign: 'right' },
  textRight: {
    textAlign: 'right',
  },
  textBold: {
    fontWeight: 'bold',
  },
  monospace: {
    fontFamily: 'Courier',
  },
  totals: {
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 10,
  },
  totalsBox: {
    width: 260,
  },
  totRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    fontSize: 10,
  },
  totRowGrand: {
    backgroundColor: '#1e3a8a',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 6,
    marginTop: 5,
    fontSize: 12,
    padding: 7,
  },
  versementSection: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  versementTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  versementTable: {
    width: '100%',
    marginBottom: 5,
  },
  versementHeader: {
    backgroundColor: '#0c4a6e',
    flexDirection: 'row',
  },
  versementCell: {
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: 'white',
  },
  versementCellBody: {
    padding: 4,
    fontSize: 8,
  },
  colDate: { width: '25%' },
  colMontant: { width: '25%', textAlign: 'right' },
  colMode: { width: '25%', textAlign: 'center' },
  colRef: { width: '25%', textAlign: 'center' },
  restantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    marginTop: 5,
    backgroundColor: '#e0f2fe',
    borderRadius: 4,
  },
  conditions: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    padding: 10,
    fontSize: 9,
    color: '#475569',
    marginBottom: 12,
  },
  conditionsH4: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stamp: {
    border: '1.5px solid #f59e0b',
    color: '#92400e',
    padding: 5,
    borderRadius: 5,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  stampPaye: {
    border: '1.5px solid #16a34a',
    color: '#16a34a',
    padding: 5,
    borderRadius: 5,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTop: '1px solid #e2e8f0',
    fontSize: 8,
    color: '#94a3b8',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: '#94a3b8',
  },
  watermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    transform: 'rotate(-45deg)',
  },
  watermarkText: {
    fontSize: 60,
    color: 'rgba(220, 38, 38, 0.15)',
    fontWeight: 'extrabold',
    textTransform: 'uppercase',
    letterSpacing: 10,
    fontFamily: 'Helvetica-Bold',
  },
  watermarkPaye: {
    fontSize: 60,
    color: 'rgba(34, 197, 94, 0.15)',
    fontWeight: 'extrabold',
    textTransform: 'uppercase',
    letterSpacing: 10,
    fontFamily: 'Helvetica-Bold',
  },
  watermarkAcompte: {
    fontSize: 60,
    color: 'rgba(245, 158, 11, 0.15)',
    fontWeight: 'extrabold',
    textTransform: 'uppercase',
    letterSpacing: 10,
    fontFamily: 'Helvetica-Bold',
  },
  statusBadge: {
    position: 'absolute',
    top: 100,
    right: 40,
    backgroundColor: '#dc2626',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 4,
    zIndex: 100,
  },
  statusBadgePaye: {
    backgroundColor: '#16a34a',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tamponBox: {
    alignItems: 'center',
    width: '45%',
  },
  tamponCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  tamponText: {
    fontSize: 8,
    color: '#0f172a',
    textAlign: 'center',
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  tamponInnerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  signatureBox: {
    alignItems: 'center',
    width: '45%',
  },
  signatureLine: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
    marginBottom: 8,
    paddingTop: 30,
  },
  signatureText: {
    fontSize: 9,
    color: '#475569',
    marginTop: 5,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 3,
  },
  tamponImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  signatureImage: {
    width: 120,
    height: 40,
    marginBottom: 5,
  },
  progressBar: {
    marginTop: 8,
    marginBottom: 5,
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
});

// Composant d'en-tête réutilisable
// Composant d'en-tête réutilisable - Version améliorée
const PageHeader = ({ f, entreprise, num, now, isPaid, hasVersements, isPartiallyPaid }) => {
  // Déterminer le type de document
  let documentType = "PRO FORMA";
  let badgeColor = styles.badgeOrange;
  let badgeText = "PRO FORMA - En attente de paiement";
  
  if (isPaid) {
    documentType = "FACTURE";
    badgeColor = styles.badgeGreen;
    badgeText = "✅ FACTURE PAYÉE";
  } else if (hasVersements && isPartiallyPaid) {
    documentType = "FACTURE AVEC ACOMPTE";
    badgeColor = styles.badgeBlue;
    badgeText = "⚠️ FACTURE PARTIELLEMENT PAYÉE";
  } else if (hasVersements && !isPartiallyPaid) {
    documentType = "FACTURE PROFORMA AVEC VERSEMENT";
    badgeColor = styles.badgeBlue;
    badgeText = "📝 VERSEMENT ENREGISTRÉ - EN ATTENTE";
  }
  
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image src="/logo.jpeg" style={styles.logo} />
        <Text style={styles.companyDetails}>
          {entreprise.nom}{'\n'}
          {entreprise.adresse} · {entreprise.ville}, {entreprise.pays}{'\n'}
          NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}{'\n'}
          Email: {entreprise.email} · Tel: {entreprise.telephone}
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.factureTitle}>{documentType}</Text>
        <Text style={styles.factureNumber}>{f.reference}</Text>
        <Text style={styles.date}>Date: {fmtDT(f.createdAt)}</Text>
        <View style={[styles.badge, badgeColor]}>
          <Text>{badgeText}</Text>
        </View>
        {/* {f.statut === 'solde' && (
          <View style={[styles.badge, styles.badgeGreen]}>
            <Text>✅ FACTURE PAYÉE</Text>
          </View>
        )} */}
      </View>
    </View>
  );
};

// Composant d'informations parties
const PartiesInfo = ({ entreprise, client }) => (
  <View style={styles.parties}>
    <View style={styles.party}>
      <Text style={styles.partyLabel}>Facturé à</Text>
      <Text style={styles.partyName}>{client?.name || "—"}</Text>
      <Text style={styles.partyInfo}>
        TEL: {client?.phone || ""}{"\n"}
        {client?.adresse || ""} {client?.ville || ""}
      </Text>
    </View>
  </View>
);

// Nouveau composant pour le récapitulatif des paiements
const PaymentSummary = ({ totalPaye, montantTotal, resteAPayer, tauxPaiement, hasVersements }) => {
  if (!hasVersements) return null;
  
  const isFullyPaid = resteAPayer <= 0;
  const isOverPaid = resteAPayer < 0;
  
  return (
    <View style={styles.versementSection}>
      <Text style={styles.versementTitle}>
        {isFullyPaid ? '✅ FACTURE SOLDÉE' : isOverPaid ? '⚠️ TROP-PERÇU' : '💰 RÉCAPITULATIF DES PAIEMENTS'}
      </Text>
      
      <View style={styles.restantRow}>
        <Text style={styles.textBold}>Total versé :</Text>
        <Text style={[styles.monospace, styles.textBold, { color: '#16a34a' }]}>
          {totalPaye.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
        </Text>
      </View>
      
      <View style={styles.restantRow}>
        <Text style={styles.textBold}>Montant total dû :</Text>
        <Text style={[styles.monospace, styles.textBold]}>
          {montantTotal.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
        </Text>
      </View>
      
      {isOverPaid ? (
        <View style={[styles.restantRow, { backgroundColor: '#fef3c7' }]}>
          <Text style={[styles.textBold, { color: '#dc2626' }]}>Trop-perçu :</Text>
          <Text style={[styles.monospace, styles.textBold, { color: '#dc2626' }]}>
            {Math.abs(resteAPayer).toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
          </Text>
        </View>
      ) : !isFullyPaid && (
        <View style={[styles.restantRow, { backgroundColor: '#fef3c7' }]}>
          <Text style={[styles.textBold, { color: '#92400e' }]}>Reste à payer :</Text>
          <Text style={[styles.monospace, styles.textBold, { color: '#92400e' }]}>
            {resteAPayer.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
          </Text>
        </View>
      )}

      {!isFullyPaid && (
        <>
          <View style={{ marginTop: 5 }}>
            <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 3 }}>
              Taux de paiement: {tauxPaiement}%
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(tauxPaiement, 100)}%` }]} />
            </View>
          </View>
          
          <Text style={{ fontSize: 8, color: '#f59e0b', marginTop: 5, textAlign: 'center' }}>
            ⚠️ Document valant facture d'acompte
          </Text>
        </>
      )}
    </View>
  );
};

// Nouveau composant pour afficher les versements
const VersementsSection = ({ versements, totalPaye, montantTotal, resteAPayer, tauxPaiement }) => {
  if (!versements || versements.length === 0) {
    return (
      <View style={styles.versementSection}>
        <Text style={styles.versementTitle}>📊 ÉTAT DES PAIEMENTS</Text>
        <Text style={{ fontSize: 9, color: '#64748b', textAlign: 'center' }}>
          Aucun versement enregistré
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '0%' }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.versementSection}>
      <Text style={styles.versementTitle}>HISTORIQUE DES VERSEMENTS</Text>

      <View style={styles.versementTable}>
        <View style={styles.versementHeader}>
          <View style={[styles.versementCell, styles.colDate]}>
            <Text>DATE</Text>
          </View>
          <View style={[styles.versementCell, styles.colMontant]}>
            <Text>MONTANT (FCFA)</Text>
          </View>
          <View style={[styles.versementCell, styles.colMode]}>
            <Text>MODE</Text>
          </View>
          <View style={[styles.versementCell, styles.colRef]}>
            <Text>RÉFÉRENCE</Text>
          </View>
        </View>

        {versements.map((v, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableCellEven]}>
            <View style={[styles.versementCellBody, styles.colDate]}>
              <Text>{fmtDT(v.date) || fmtDT(v.createdAt)}</Text>
            </View>
            <View style={[styles.versementCellBody, styles.colMontant, styles.textRight]}>
              <Text style={styles.monospace}>
                {v.montant.toLocaleString("fr-FR").replace(/\u202F/g, " ")}
              </Text>
            </View>
            <View style={[styles.versementCellBody, styles.colMode]}>
              <Text>{v.mode || '—'}</Text>
            </View>
            <View style={[styles.versementCellBody, styles.colRef]}>
              <Text>{v.reference || v.ref || '—'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.restantRow}>
        <Text style={styles.textBold}>Total versé :</Text>
        <Text style={[styles.monospace, styles.textBold]}>
          {totalPaye.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
        </Text>
      </View>

      <View style={styles.restantRow}>
        <Text style={styles.textBold}>Montant total :</Text>
        <Text style={[styles.monospace, styles.textBold]}>
          {montantTotal.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA
        </Text>
      </View>

      <View style={[styles.restantRow, { backgroundColor: resteAPayer > 0 ? '#fef3c7' : '#dcfce7' }]}>
        <Text style={[styles.textBold, { color: resteAPayer > 0 ? '#92400e' : '#166534' }]}>
          {resteAPayer > 0 ? 'Reste à payer :' : 'Soldé :'}
        </Text>
        <Text style={[styles.monospace, styles.textBold, { color: resteAPayer > 0 ? '#92400e' : '#166534' }]}>
          {resteAPayer > 0 ? `${resteAPayer.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA` : 'COMPLÈTEMENT PAYÉ'}
        </Text>
      </View>

      <View style={{ marginTop: 5 }}>
        <Text style={{ fontSize: 8, color: '#64748b', marginBottom: 3 }}>
          Taux de paiement: {tauxPaiement}%
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${Math.min(tauxPaiement, 100)}%` }]} />
        </View>
      </View>
    </View>
  );
};

// Composant de tableau avec pagination
const PrestationsTable = ({ dossier, prestations, startIndex, endIndex }) => {
  const pagePrestations = prestations.slice(startIndex, endIndex);

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <View style={[styles.tableCell, styles.col1]}><Text>#</Text></View>
        <View style={[styles.tableCell, styles.col2]}><Text>Désignation</Text></View>
        <View style={[styles.tableCell, styles.col3]}><Text>Qté</Text></View>
        <View style={[styles.tableCell, styles.col4]}><Text>Unité</Text></View>
        <View style={[styles.tableCell, styles.col5]}><Text>PU HT (FCFA)</Text></View>
        <View style={[styles.tableCell, styles.col6]}><Text>Total HT (FCFA)</Text></View>
      </View>

      {pagePrestations.length > 0 ? pagePrestations.map((p, idx) => {
        const globalIndex = startIndex + idx;
        return (
          <View key={globalIndex} style={[styles.tableRow, globalIndex % 2 === 1 && styles.tableCellEven]}>
            <View style={[styles.tableCellBody, styles.col1]}><Text>{globalIndex + 1}</Text></View>
            <View style={[styles.tableCellBody, styles.col2]}><Text>{p.label}</Text></View>
            <View style={[styles.tableCellBody, styles.col3]}><Text>1</Text></View>
            <View style={[styles.tableCellBody, styles.col4]}><Text>Forfait</Text></View>
            <View style={[styles.tableCellBody, styles.col5, styles.monospace, styles.textRight]}>
              <Text>{p.montant.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
            </View>
            <View style={[styles.tableCellBody, styles.col6, styles.monospace, styles.textRight, styles.textBold]}>
              <Text>{p.montant.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
            </View>
          </View>
        );
      }) : (
        <View style={styles.tableRow}>
          <View style={[styles.tableCellBody, styles.col1]}><Text>1</Text></View>
          <View style={[styles.tableCellBody, styles.col2]}><Text>{dossier.dossierName}</Text></View>
          <View style={[styles.tableCellBody, styles.col3]}><Text>1</Text></View>
          <View style={[styles.tableCellBody, styles.col4]}><Text>Forfait</Text></View>
          <View style={[styles.tableCellBody, styles.col5, styles.monospace, styles.textRight]}>
            <Text>{dossier.montant_total.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
          </View>
          <View style={[styles.tableCellBody, styles.col6, styles.monospace, styles.textRight, styles.textBold]}>
            <Text>{dossier.montant_total.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Composant des totaux
const TotalsSection = ({ montantTotal, tva = false }) => {
  const tvaApriq = tva ? Math.round(montantTotal * 0.18) : 0;
  return (
    <View style={styles.totals}>
      <View style={styles.totalsBox}>
        <View style={styles.totRow}>
          <Text>Sous-total HT</Text>
          <Text style={styles.monospace}>{montantTotal.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
        </View>
        {tva && (<View style={styles.totRow}>
          <Text>TVA (18%)</Text>
          <Text style={styles.monospace}>{tvaApriq.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
        </View>)}

        <View style={[styles.totRow, styles.totRowGrand]}>
          <Text>TOTAL TTC</Text>
          <Text style={styles.monospace}>{(montantTotal + tvaApriq).toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA</Text>
        </View>
      </View>
    </View>
  );
};

// Composant conditions et bas de page (hors footer)
// Amélioration du composant ConditionsSection
const ConditionsSection = ({ isPaid, hasVersements, isPartiallyPaid, resteAPayer }) => {
  if (isPaid) {
    return (
      <>
        <View style={styles.conditions}>
          <Text style={styles.conditionsH4}>Conditions de règlement</Text>
          <Text>
            Conformément aux termes convenus, cette facture a été intégralement réglée.
            {"\n"}
            Merci pour votre confiance et votre promptitude dans le règlement.
          </Text>
        </View>
        <View style={styles.stampPaye}>
          <Text>✓ FACTURE ACQUITTÉE</Text>
        </View>
      </>
    );
  }
  
  if (hasVersements && isPartiallyPaid) {
    return (
      <>
        {/* <View style={styles.conditions}>
          <Text style={styles.conditionsH4}>Conditions de règlement</Text>
          <Text>
            Un acompte a été versé. Le solde de {resteAPayer.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA 
            reste dû selon les conditions convenues.
            {"\n"}
            <Text style={styles.textBold}>Validité de la facture :</Text> 30 jours à compter de la date d'émission.
            {"\n"}
            En cas de retard de paiement du solde, une pénalité de 10% du montant restant sera appliquée.
          </Text>
        </View> */}
        <View style={[styles.stamp, { borderColor: '#f59e0b', color: '#92400e' }]}>
          <Text>⚠️ FACTURE AVEC ACOMPTE - SOLDE RESTANT : {resteAPayer.toLocaleString("fr-FR").replace(/\u202F/g, " ")} FCFA</Text>
        </View>
      </>
    );
  }
  
  if (hasVersements && !isPartiallyPaid) {
    return (
      <>
        <View style={styles.conditions}>
          <Text style={styles.conditionsH4}>Conditions de règlement</Text>
          <Text>
            Un versement a été enregistré sur cette proforma.
            {"\n"}
            <Text style={styles.textBold}>Validité de la proforma :</Text> 30 jours à compter de la date d'émission.
            {"\n"}
            Le solde restant devra être réglé selon les modalités convenues.
          </Text>
        </View>
        <View style={styles.stamp}>
          <Text>📝 PROFORMA AVEC VERSEMENT - EN ATTENTE DE RÈGLEMENT COMPLET</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.conditions}>
        <Text style={styles.conditionsH4}>Conditions de règlement</Text>
        <Text>
          Paiement à 30 jours date de facture. Mode de règlement : virement bancaire.
          {"\n"}
          <Text style={styles.textBold}>Validité de la proforma :</Text> 30 jours à compter de la date d'émission.
          {"\n"}
          Aucun escompte ne sera accordé pour paiement anticipé.
          {"\n"}
          En cas de retard de paiement, une pénalité de 10% du montant TTC sera appliquée.
        </Text>
      </View>
      <View style={styles.stamp}>
        <Text>DOCUMENT PROFORMA — EN ATTENTE DE RÈGLEMENT</Text>
      </View>
    </>
  );
};

// Composant filigrane
const Watermark = ({ isPaid, text = "PRO FORMA" }) => {
  if (isPaid) {
    return (
      <View style={styles.watermark} fixed>
        <Text style={styles.watermarkPaye}>PAYÉ</Text>
      </View>
    );
  }
  return (
    <View style={styles.watermark} fixed>
      <Text style={[styles.watermarkText, { color: 'rgba(245, 158, 11, 0.15)' }]}>
        {text === "ACOMPTE" ? "ACOMPTE" : "PRO FORMA"}
      </Text>
    </View>
  );
};;

// Composant principal avec pagination
// Composant principal avec pagination - Version améliorée
export const FacturePDF = ({
  dossier,
  client,
  entreprise,
  isPaid = false,
  signature = null,
  tamponImage = null
}) => {
  const now = new Date().toLocaleDateString("fr-FR");
  const num = "FAC-" + (dossier.reference || dossier.dossierName);
  const prestations = dossier.prestations || [];
  const linesPerPage = 8;
  
  const totalPages = prestations && prestations.length > 0 
    ? Math.ceil(prestations.length / linesPerPage) 
    : 1;
  
  // Calculs financiers
  const paye = totalPaye(dossier);
  const reste = resteApayer(dossier);
  const taux = tauxPaiement(dossier);
  const versements = dossier.versements || dossier.versement || [];
  const hasVersements = versements && versements.length > 0;
  const isCompletelyPaid = reste <= 0 && hasVersements;
  const isPartiallyPaid = hasVersements && reste > 0 && reste < dossier.montant_total;
  
  // Déterminer le statut réel du document
  const getDocumentStatus = () => {
    if (isCompletelyPaid) return 'paid';
    if (isPartiallyPaid) return 'partial';
    if (hasVersements) return 'deposit';
    return 'proforma';
  };
  
  const documentStatus = getDocumentStatus();

  const renderPage = (pageNumber) => {
    const startIndex = (pageNumber - 1) * linesPerPage;
    const endIndex = prestations && prestations.length > 0
      ? Math.min(startIndex + linesPerPage, prestations.length)
      : 0;
    const isLastPage = pageNumber === totalPages;

    return (
      <Page key={pageNumber} size="A4" style={styles.page} wrap>
        {/* Filigrane approprié */}
        {isCompletelyPaid && <Watermark isPaid={true} />}
        {!isCompletelyPaid && hasVersements && <Watermark isPaid={false} text="ACOMPTE" />}

        <PageHeader 
          f={dossier} 
          entreprise={entreprise} 
          num={num} 
          now={now} 
          isPaid={isCompletelyPaid}
          hasVersements={hasVersements}
          isPartiallyPaid={isPartiallyPaid}
        />
        
        <View style={styles.content}>
          {pageNumber === 1 && (
            <>
              <PartiesInfo entreprise={entreprise} client={client} />
            </>
          )}

          <View style={styles.body}>
            <PrestationsTable
              dossier={dossier}
              prestations={prestations}
              startIndex={startIndex}
              endIndex={endIndex}
            />

            {/* Afficher les sections appropriées selon le statut */}
            {isLastPage && (
              <>
                {hasVersements && (
                  <VersementsSection 
                    versements={versements}
                    totalPaye={paye}
                    montantTotal={dossier.montant_total}
                    resteAPayer={reste}
                    tauxPaiement={taux}
                    isCompletelyPaid={isCompletelyPaid}
                    isPartiallyPaid={isPartiallyPaid}
                  />
                )}
                
                <TotalsSection montantTotal={dossier.montant_total} />
                
                {/* Conditions selon le statut */}
                <ConditionsSection 
                  isPaid={isCompletelyPaid}
                  hasVersements={hasVersements}
                  isPartiallyPaid={isPartiallyPaid}
                  resteAPayer={reste}
                />
              </>
            )}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>© {entreprise.nom} · NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}</Text>
          {/* <Text>{num} · {now}</Text> */}
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

// Fonction utilitaire pour générer le blob et l'ouvrir dans une nouvelle fenêtre
export const printFacture = async (
  dossier,
  client,
  entreprise,
  isPaid = false,
  signature = null,
  tamponImage = null
) => {
  try {
    const blob = await pdf(
      <FacturePDF
        dossier={dossier}
        client={client}
        entreprise={entreprise}
        isPaid={isPaid}
        signature={signature}
        tamponImage={tamponImage}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank", "width=820,height=900");

    if (w) {
      w.focus();
    }

    // Nettoyer l'URL après un délai
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
  }
};