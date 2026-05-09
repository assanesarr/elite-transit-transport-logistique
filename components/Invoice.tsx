import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFViewer,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60, // @react-pdf/renderer nécessite une hauteur numérique
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003087',
  },
  section: {
    marginBottom: 15,
  },
  clientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  table: {
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#003087',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#003087',
    paddingVertical: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 5,
  },
  col1: { 
    width: '45%', 
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  col2: { 
    width: '15%', 
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  col3: { 
    width: '10%', 
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  col4: { 
    width: '15%', 
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  col5: { 
    width: '15%', 
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  totals: {
    alignSelf: 'flex-end',
    width: '45%',
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    marginTop: 3,
  },
  resteAPayer: {
    backgroundColor: '#003087',
    color: 'white',
    padding: 8,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  signatureBox: {
    alignItems: 'center',
  },
  signatureLine: {
    marginTop: 50,
    fontFamily: 'Helvetica-Oblique',
  },
  tampon: {
    width: 120,
    height: 60, // Ajout d'une hauteur
  },
  verifyText: {
    fontSize: 9,
    marginTop: 5,
  },
});

const Invoice = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src="/logo.jpeg" style={styles.logo} />
        <View>
          <Text style={styles.title}>FACTURE</Text>
          <Text>N° FAC-2024-000125</Text>
          <Text>Date : 14/05/2024</Text>
        </View>
      </View>

      {/* Client & Delivery Zone */}
      <View style={styles.clientInfo}>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Client</Text>
          <Text>AFRICOM SARL</Text>
          <Text>BP 12345 Dakar - Sénégal</Text>
          <Text>Tél : +221 77 123 45 67</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Zone de livraison</Text>
          <Text>PORT AUTONOME DE DAKAR</Text>
          <Text>Sénégal</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>DÉSIGNATION</Text>
          <Text style={styles.col2}>CONTENEUR</Text>
          <Text style={styles.col3}>QTÉ</Text>
          <Text style={styles.col4}>PRIX UNIT.</Text>
          <Text style={styles.col5}>MONTANT</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.col1}>Livraison conteneur 20 pieds</Text>
          <Text style={styles.col2}>20'DC</Text>
          <Text style={styles.col3}>1</Text>
          <Text style={styles.col4}>150 000</Text>
          <Text style={styles.col5}>150 000</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.col1}>Frais de manutention</Text>
          <Text style={styles.col2}>20'DC</Text>
          <Text style={styles.col3}>1</Text>
          <Text style={styles.col4}>35 000</Text>
          <Text style={styles.col5}>35 000</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.col1}>Frais de dossier</Text>
          <Text style={styles.col2}>-</Text>
          <Text style={styles.col3}>1</Text>
          <Text style={styles.col4}>15 000</Text>
          <Text style={styles.col5}>15 000</Text>
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>TOTAL HT</Text>
          <Text>200 000</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>TVA (18%)</Text>
          <Text>36 000</Text>
        </View>
        {/* Correction: borderTop remplacé par borderTopWidth + borderTopColor */}
        <View style={[styles.totalRow, styles.totalRowBorder]}>
          <Text style={{ fontWeight: 'bold' }}>TOTAL TTC</Text>
          <Text style={{ fontWeight: 'bold' }}>236 000</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>AVANCE VERSÉE</Text>
          <Text>100 000</Text>
        </View>
      </View>

      {/* Reste à payer */}
      <View style={styles.resteAPayer}>
        <Text>RESTE À PAYER : 136 000 FCFA</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Image src="/qrcode.png" style={styles.qrCode} />
          <Text style={styles.verifyText}>
            Scannez pour vérifier l'authenticité de cette facture{'\n'}
            sur www.transco.sn/verify
          </Text>
        </View>

        <View style={styles.signatureBox}>
          <Text>Signature autorisée</Text>
          <Text style={styles.signatureLine}>A. Sarr</Text>
        </View>

        <View>
          <Image src="/tampon-transco.png" style={styles.tampon} />
        </View>
      </View>
    </Page>
  </Document>
);

// Composant pour prévisualisation (optionnel)
export const InvoicePDF = () => (
  <PDFViewer style={{ width: '100%', height: '100vh' }}>
    <Invoice />
  </PDFViewer>
);

export default Invoice;