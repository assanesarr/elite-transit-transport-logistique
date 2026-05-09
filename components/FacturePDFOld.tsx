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
  // logo: {
  //   width: 40,
  //   height: 40,
  //   backgroundColor: '#f59e0b',
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginRight: 12,
  // },
  logoText: {
    fontSize: 22,
    fontWeight: 'extrabold',
    color: '#0f172a',
  },
  companyInfo: {
    color: 'white',
  },
  // companyName: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  companySub: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 2,
  },
  // Header
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
    // backgroundColor: '#0f172a',
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
    backgroundColor: '#1e3a8a', //'#0f172a',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 6,
    marginTop: 5,
    fontSize: 12,
    padding: 7,
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
  // Styles pour le filigrane
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
  // Badge de statut
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
  // Styles pour le tampon et signature
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
});

// Composant d'en-tête réutilisable
const PageHeader = ({ f, entreprise, num, now, isPaid }) => (
  <>
    {/* <View style={styles.topBar} />
    <View style={styles.head}>
      <View style={styles.headLeft}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>T</Text>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>{entreprise.nom}</Text>
          <Text style={styles.companySub}>
            {entreprise.adresse} · {entreprise.ville}
          </Text>
          <Text style={styles.companySub}>
            NINEA: {entreprise.ninea} · Agr. DGD: {entreprise.agrement || "—"}
          </Text>
        </View>
      </View>
      <View style={styles.docTag}>
        <Text style={styles.docType}>
          {isPaid ? "FACTURE" : "FACTURE PROFORMA"}
        </Text>
        <Text style={styles.docNum}>{num}</Text>
        <Text style={styles.docDate}>Émise le {now}</Text>
      </View>
    </View> */}
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image src="/logo.jpeg" style={styles.logo} />
        <Text style={styles.companyDetails}>
          {entreprise.nom}{'\n'}
          {entreprise.adresse} · {entreprise.ville}, {entreprise.pays}{'\n'}
          NINEA: {entreprise.ninea} · RC: {entreprise.rc}{'\n'}
          Email: {entreprise.email} ·
          Tel: {entreprise.telephone} ·
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={styles.factureTitle}>{!isPaid ? 'PRO FORMA' : 'FACTURE'}</Text>
        <Text style={styles.factureNumber}>{f.reference}</Text>
        <Text style={styles.date}>Date: {fmtDT(f.createdAt)}</Text>
        {/* <View style={[styles.badge, styles.badgeBlue]}>
          <Text>ID GIE: {f.membreGIE}</Text>
        </View> */}
        {!isPaid && (
          <View style={[styles.badge, styles.badgeOrange]}>
            <Text>PRO FORMA - En attente de paiement</Text>
          </View>
        )}
        {f.statut === 'solde' && (
          <View style={[styles.badge, styles.badgeGreen]}>
            <Text>✅ FACTURE PAYÉE</Text>
          </View>
        )}
      </View>
    </View>
  </>
);

// Composant d'informations parties
const PartiesInfo = ({ entreprise, client }) => (
  <View style={styles.parties}>
    {/* <View style={styles.party}>
      <Text style={styles.partyLabel}>Émetteur</Text>
      <Text style={styles.partyName}>{entreprise.nom}</Text>
      <Text style={styles.partyInfo}>
        {entreprise.adresse}{"\n"}
        {entreprise.ville}{"\n"}
        Tél: {entreprise.tel || "—"} · {entreprise.email || "—"}
      </Text>
    </View> */}
    <View style={styles.party}>
      <Text style={styles.partyLabel}>Facturé à</Text>
      <Text style={styles.partyName}>{client?.name || "—"}</Text>
      <Text style={styles.partyInfo}>
        TEL: {client?.phone || ""}{"\n"}
        {client?.adresse || ""} {client?.ville || ""}{"\n"}
        {/* NINEA: {client?.ninea || "—"} */}
      </Text>
    </View>
  </View>
);

// Composant d'objet
const ObjetInfo = ({ dossier }) => (
  <View style={styles.objet}>
    <Text>
      <Text style={styles.objetStrong}>Objet : </Text>
      {dossier.description} · B/L: {dossier.bl || "—"} · Port: {dossier.port || "—"}
    </Text>
  </View>
);

// Composant de tableau avec pagination
const PrestationsTable = ({ dossier, prestations, startIndex, endIndex }) => {
  const pagePrestations = prestations.slice(startIndex, endIndex);

  return (
    <View style={styles.table}>
      {/* En-tête */}
      <View style={styles.tableHeader}>
        <View style={[styles.tableCell, styles.col1]}><Text>#</Text></View>
        <View style={[styles.tableCell, styles.col2]}><Text>Désignation</Text></View>
        <View style={[styles.tableCell, styles.col3]}><Text>Qté</Text></View>
        <View style={[styles.tableCell, styles.col4]}><Text>Unité</Text></View>
        <View style={[styles.tableCell, styles.col5]}><Text>PU HT (FCFA)</Text></View>
        <View style={[styles.tableCell, styles.col6]}><Text>Total HT (FCFA)</Text></View>
      </View>

      {/* Corps */}
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
      }) : dossier.versement.map((p, idx) => {
        const globalIndex = startIndex + idx;
        return (
          <View key={globalIndex} style={[styles.tableRow, globalIndex % 2 === 1 && styles.tableCellEven]}>
            <View style={[styles.tableCellBody, styles.col1]}><Text>{globalIndex + 1}</Text></View>
            <View style={[styles.tableCellBody, styles.col2]}><Text>{dossier.dossierName}</Text></View>
            <View style={[styles.tableCellBody, styles.col3]}><Text>1</Text></View>
            <View style={[styles.tableCellBody, styles.col4]}><Text>Forfait</Text></View>
            <View style={[styles.tableCellBody, styles.col5, styles.monospace, styles.textRight]}>
              <Text>{p.montant.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
            </View>
            <View style={[styles.tableCellBody, styles.col6, styles.monospace, styles.textRight, styles.textBold]}>
              <Text>{p.montant.toLocaleString("fr-FR").replace(/\u202F/g, " ")}</Text>
            </View>
          </View>
        )
      })
      }
    </View>
  );
};

// Composant des totaux
const TotalsSection = ({ montantTotal, tva = false }: { montantTotal: number, tva?: boolean }) => {
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
const ConditionsSection = ({ isPaid }) => {
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
const Watermark = ({ isPaid }) => {
  if (isPaid) {
    return (
      <View style={styles.watermark} fixed>
        <Text style={styles.watermarkPaye}>PAYÉ</Text>
      </View>
    );
  }
  return (
    <View style={styles.watermark} fixed>
      <Text style={styles.watermarkText}>PRO FORMA</Text>
    </View>
  );
};

// Composant badge de statut
const StatusBadge = ({ isPaid }) => {
  if (isPaid) {
    return (
      <View style={[styles.statusBadge, styles.statusBadgePaye]} fixed>
        <Text style={styles.statusText}>✓ FACTURE RÉGLÉE</Text>
      </View>
    );
  }
  return (
    <View style={styles.statusBadge} fixed>
      <Text style={styles.statusText}>PRO FORMA - EN ATTENTE DE PAIEMENT</Text>
    </View>
  );
};

// Composant Tampon et Signature
const StampAndSignature = ({ entreprise, signature, tamponImage }) => {
  return (
    <View style={styles.signatureSection}>
      {/* Tampon de l'entreprise */}
      <View style={styles.tamponBox}>
        {tamponImage ? (
          <Image src={tamponImage} style={styles.tamponImage} />
        ) : (
          <View style={styles.tamponCircle}>
            <Text style={styles.tamponInnerText}>{entreprise.nom?.charAt(0) || "E"}</Text>
            <Text style={styles.tamponText}>CACHET</Text>
            <Text style={styles.tamponText}>ENTREPRISE</Text>
          </View>
        )}
        <Text style={styles.tamponText}>Cachet de l'entreprise</Text>
        <Text style={styles.tamponText}>{entreprise.nom}</Text>
      </View>

      {/* Signature */}
      <View style={styles.signatureBox}>
        {signature ? (
          <Image src={signature} style={styles.signatureImage} />
        ) : (
          <View style={styles.signatureLine} />
        )}
        <Text style={styles.signatureText}>Signature précédée de la mention</Text>
        <Text style={styles.signatureText}>"Bon pour accord"</Text>
        <Text style={styles.signatureName}>
          {entreprise.responsable || "Le Responsable"}
        </Text>
        <Text style={styles.signatureText}>
          {entreprise.responsableTitre || "Gérant"}
        </Text>
      </View>
    </View>
  );
};

// Composant principal avec pagination
export const FacturePDF = ({
  dossier,
  client,
  entreprise,
  isPaid = false,
  signature = null, // Image de signature en base64 ou URL
  tamponImage = null // Image du tampon en base64 ou URL
}) => {
  const now = new Date().toLocaleDateString("fr-FR");
  const num = "FAC-" + dossier.reference || dossier.dossierName;
  const prestations = dossier.prestations || [];
  const linesPerPage = 10; // 10 lignes max par page
  const totalPages = Math.ceil(prestations.length / linesPerPage);
  const paye = totalPaye(dossier);
  const reste = resteApayer(dossier);
  const taux = tauxPaiement(dossier);
  // Fonction pour rendre une page
  const renderPage = (pageNumber) => {
    const startIndex = (pageNumber - 1) * linesPerPage;
    const endIndex = Math.min(startIndex + linesPerPage, prestations.length);
    // const isLastPage = pageNumber === totalPages;

    return (
      <Page key={pageNumber} size="A4" style={styles.page} wrap>
        {/* Filigrane sur toutes les pages */}
        {paye >= dossier.montant_total && <Watermark isPaid={isPaid} />}
        {/* <StatusBadge isPaid={isPaid} /> */}

        <PageHeader f={dossier} entreprise={entreprise} num={num} now={now} isPaid={isPaid} />
        <View style={styles.content}>
          {pageNumber === 1 && (
            <>
              <PartiesInfo entreprise={entreprise} client={client} />
              {/* <ObjetInfo dossier={dossier} /> */}
            </>
          )}

          <View style={styles.body}>
            <PrestationsTable
              dossier={dossier}
              prestations={prestations}
              startIndex={startIndex}
              endIndex={endIndex}
            />

            {/* Afficher les totaux et conditions seulement sur la dernière page */}

            <TotalsSection montantTotal={dossier.montant_total} />
            {reste <= 0 && <ConditionsSection isPaid={isPaid} />}
            {/* Ajout du tampon et signature sur la dernière page */}
            {/* <StampAndSignature
              entreprise={entreprise}
              signature={signature}
              tamponImage={tamponImage}
            /> */}

          </View>
        </View>

        {/* Pied de page fixe en bas */}
        <View style={styles.footer} fixed>
          <Text>© {entreprise.nom} · NINEA: {entreprise.ninea}</Text>
          <Text>{num} · {now}</Text>
        </View>
        <Text style={styles.pageNumber} fixed>
          Page {pageNumber} / {totalPages}
        </Text>
      </Page>
    );
  };

  return (
    <Document>
      {Array.from({ length: 1 }, (_, i) => renderPage(i + 1))}
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
  // setTimeout(() => {
  //   w.focus();
  //   w.print();
  // }, 400);
};