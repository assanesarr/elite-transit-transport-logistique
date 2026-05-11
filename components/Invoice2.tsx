// @ts-nocheck
import React, { useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Line,
  Svg,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// ─── Fonts ──────────────────────────────────────────────
// Note: Vous devrez enregistrer les polices personnalisées si vous les utilisez
// Font.register({
//   family: "Cormorant",
//   src: "https://fonts.gstatic.com/s/cormorant/v18/H4c2BXROHaLnCgkHlwUjOQnC6t6n.ttf",
// });
// Font.register({
//   family: "DM Mono",
//   src: "https://fonts.gstatic.com/s/dmmono/v13/aFTU7PB1QTsUX8KYthSQBLyEbg.ttf",
// });

// ─── Palette ────────────────────────────────────────────
const C = {
  ink: "#0d0d0d",
  charcoal: "#1a1a1a",
  warmGray: "#f7f5f0",
  muted: "#8a8580",
  accent: "#b8860b",
  accentLight: "#f5e6c8",
  white: "#ffffff",
  border: "#e0dcd5",
  softBg: "#faf8f4",
};

// ─── Styles ─────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.ink,
    backgroundColor: C.white,
    position: "relative",
  },

  // ── Top accent bar ──
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: C.accent,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    marginTop: 10,
  },
  brand: {
    fontFamily: "Helvetica", // Changé pour éviter l'erreur de police
    fontSize: 32,
    fontWeight: 600,
    color: C.charcoal,
    letterSpacing: 2,
  },
  brandSub: {
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: C.muted,
    letterSpacing: 3,
    marginTop: 4,
    textTransform: "uppercase",
  },
  invoiceTitle: {
    fontFamily: "Helvetica",
    fontSize: 42,
    fontWeight: 300,
    color: C.accent,
    textAlign: "right",
    letterSpacing: 4,
  },
  invoiceMeta: {
    textAlign: "right",
    marginTop: 8,
  },
  invoiceMetaLabel: {
    fontSize: 7,
    color: C.muted,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  invoiceMetaValue: {
    fontSize: 10,
    color: C.charcoal,
    marginTop: 2,
  },

  // ── Divider ──
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 30,
  },
  dividerAccent: {
    borderBottomWidth: 2,
    borderBottomColor: C.accent,
    width: 60,
    marginBottom: 30,
  },

  // ── Addresses section ──
  addresses: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  addressBlock: {
    width: "45%",
  },
  addressLabel: {
    fontSize: 7,
    color: C.accent,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 10,
    fontWeight: 600,
  },
  addressName: {
    fontFamily: "Helvetica",
    fontSize: 14,
    fontWeight: 600,
    color: C.charcoal,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.6,
  },

  // ── Table ──
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.charcoal,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 0,
  },
  tableHeaderText: {
    color: C.white,
    fontSize: 7,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRowAlt: {
    backgroundColor: C.softBg,
  },
  colDesc: { width: "45%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  cellDesc: {
    fontSize: 9,
    color: C.charcoal,
  },
  cellDescSub: {
    fontSize: 7.5,
    color: C.muted,
    marginTop: 3,
  },
  cell: {
    fontSize: 9,
    color: C.charcoal,
  },

  // ── Totals ──
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 50,
  },
  totalsBox: {
    width: "45%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  totalRowSub: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  totalLabel: {
    fontSize: 8,
    color: C.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  totalValue: {
    fontSize: 9,
    color: C.charcoal,
  },
  totalRowFinal: {
    backgroundColor: C.charcoal,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  totalLabelFinal: {
    fontSize: 8,
    color: C.white,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  totalValueFinal: {
    fontFamily: "Helvetica",
    fontSize: 18,
    fontWeight: 600,
    color: C.accentLight,
  },

  // ── Payment info ──
  paymentSection: {
    marginBottom: 40,
  },
  paymentTitle: {
    fontSize: 7,
    color: C.accent,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 10,
    fontWeight: 600,
  },
  paymentGrid: {
    flexDirection: "row",
  },
  paymentItem: {
    marginRight: 30, // Remplace 'gap' qui n'est pas supporté
  },
  paymentLabel: {
    fontSize: 7,
    color: C.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  paymentValue: {
    fontSize: 9,
    color: C.charcoal,
    marginTop: 2,
  },

  // ── Footer ──
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
  },
  footerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 16,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerNote: {
    fontSize: 7,
    color: C.muted,
    lineHeight: 1.6,
    maxWidth: "60%",
  },
  footerLegal: {
    fontSize: 6.5,
    color: C.muted,
    textAlign: "right",
    lineHeight: 1.8,
  },
  accentDot: {
    width: 6,
    height: 6,
    backgroundColor: C.accent,
    borderRadius: 3,
    marginBottom: 8,
  },
});

// ─── Data ───────────────────────────────────────────────
const invoice = {
  number: "FAC-2026-0042",
  date: "10 mai 2026",
  dueDate: "10 juin 2026",
  from: {
    name: "Atelier Lumière SARL",
    address: "27 Rue des Arts",
    city: "75003 Paris, France",
    email: "contact@atelier-lumiere.fr",
    siret: "842 391 056 00017",
  },
  to: {
    name: "Maison Rivière & Fils",
    address: "14 Avenue Jean Jaurès",
    city: "69007 Lyon, France",
    email: "compta@riviere-fils.fr",
  },
  items: [
    {
      desc: "Design d'identité visuelle complète",
      sub: "Logo, charte graphique, déclinaisons",
      qty: 1,
      price: 4800,
    },
    {
      desc: "Développement site web responsive",
      sub: "Front-end & back-end, CMS sur mesure",
      qty: 1,
      price: 12500,
    },
    {
      desc: "Photographie produits",
      sub: "60 photos retouchées HD",
      qty: 60,
      price: 45,
    },
    {
      desc: "Consultation stratégie digitale",
      sub: "Audit, recommandations, roadmap",
      qty: 8,
      price: 150,
    },
    {
      desc: "Maintenance mensuelle (Mai 2026)",
      sub: "Hébergement, mises à jour, support",
      qty: 1,
      price: 350,
    },
  ],
  tva: 20,
  iban: "FR76 3000 4028 3700 0100 0258 152",
  bic: "BNPAFRPP",
};

// ─── Helpers ────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n) + " €";

// ─── Composant PDF ──────────────────────────────────────────
const Facture = () => {
  const subtotal = invoice.items.reduce(
    (acc, it) => acc + it.qty * it.price,
    0
  );
  const tvaAmount = subtotal * (invoice.tva / 100);
  const total = subtotal + tvaAmount;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Accent bar */}
        <View style={s.topBar} />

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brand}>ATELIER</Text>
            <Text style={[s.brand, { marginTop: -6 }]}>LUMIÈRE</Text>
            <Text style={s.brandSub}>Design & Création digitale</Text>
          </View>
          <View>
            <Text style={s.invoiceTitle}>FACTURE</Text>
            <View style={s.invoiceMeta}>
              <Text style={s.invoiceMetaLabel}>N°</Text>
              <Text style={s.invoiceMetaValue}>{invoice.number}</Text>
              <Text style={[s.invoiceMetaLabel, { marginTop: 6 }]}>
                Date d'émission
              </Text>
              <Text style={s.invoiceMetaValue}>{invoice.date}</Text>
              <Text style={[s.invoiceMetaLabel, { marginTop: 6 }]}>
                Échéance
              </Text>
              <Text style={s.invoiceMetaValue}>{invoice.dueDate}</Text>
            </View>
          </View>
        </View>

        <View style={s.dividerAccent} />

        {/* Addresses */}
        <View style={s.addresses}>
          <View style={s.addressBlock}>
            <Text style={s.addressLabel}>Émetteur</Text>
            <Text style={s.addressName}>{invoice.from.name}</Text>
            <Text style={s.addressLine}>{invoice.from.address}</Text>
            <Text style={s.addressLine}>{invoice.from.city}</Text>
            <Text style={s.addressLine}>{invoice.from.email}</Text>
            <Text style={[s.addressLine, { marginTop: 4 }]}>
              SIRET : {invoice.from.siret}
            </Text>
          </View>
          <View style={s.addressBlock}>
            <Text style={s.addressLabel}>Destinataire</Text>
            <Text style={s.addressName}>{invoice.to.name}</Text>
            <Text style={s.addressLine}>{invoice.to.address}</Text>
            <Text style={s.addressLine}>{invoice.to.city}</Text>
            <Text style={s.addressLine}>{invoice.to.email}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={s.table}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, s.colDesc]}>Description</Text>
            <Text style={[s.tableHeaderText, s.colQty]}>Qté</Text>
            <Text style={[s.tableHeaderText, s.colPrice]}>Prix unitaire</Text>
            <Text style={[s.tableHeaderText, s.colTotal]}>Montant</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View
              key={i}
              style={[s.tableRow, i % 2 === 0 ? {} : s.tableRowAlt]}
            >
              <View style={s.colDesc}>
                <Text style={s.cellDesc}>{item.desc}</Text>
                <Text style={s.cellDescSub}>{item.sub}</Text>
              </View>
              <Text style={[s.cell, s.colQty]}>{item.qty}</Text>
              <Text style={[s.cell, s.colPrice]}>{fmt(item.price)}</Text>
              <Text style={[s.cell, s.colTotal]}>
                {fmt(item.qty * item.price)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsContainer}>
          <View style={s.totalsBox}>
            <View style={[s.totalRow, s.totalRowSub]}>
              <Text style={s.totalLabel}>Sous-total HT</Text>
              <Text style={s.totalValue}>{fmt(subtotal)}</Text>
            </View>
            <View style={[s.totalRow, s.totalRowSub]}>
              <Text style={s.totalLabel}>TVA ({invoice.tva}%)</Text>
              <Text style={s.totalValue}>{fmt(tvaAmount)}</Text>
            </View>
            <View style={s.totalRowFinal}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={s.totalLabelFinal}>Total TTC</Text>
                <Text style={s.totalValueFinal}>{fmt(total)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={s.paymentSection}>
          <View style={s.accentDot} />
          <Text style={s.paymentTitle}>Modalités de paiement</Text>
          <View style={s.paymentGrid}>
            <View style={s.paymentItem}>
              <Text style={s.paymentLabel}>IBAN</Text>
              <Text style={s.paymentValue}>{invoice.iban}</Text>
            </View>
            <View style={s.paymentItem}>
              <Text style={s.paymentLabel}>BIC</Text>
              <Text style={s.paymentValue}>{invoice.bic}</Text>
            </View>
            <View style={s.paymentItem}>
              <Text style={s.paymentLabel}>Échéance</Text>
              <Text style={s.paymentValue}>{invoice.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.footerDivider} />
          <View style={s.footerContent}>
            <Text style={s.footerNote}>
              En cas de retard de paiement, une pénalité de 3 fois le taux
              d'intérêt légal sera appliquée, ainsi qu'une indemnité
              forfaitaire de 40 € pour frais de recouvrement.
            </Text>
            <Text style={s.footerLegal}>
              Atelier Lumière SARL{"\n"}
              Capital social : 10 000 €{"\n"}
              TVA intra. : FR 12 842391056
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// ─── Composant d'aperçu avec téléchargement ──────────────────────────
export const InvoicePDF = () => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        Chargement de l'aperçu PDF...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 10, textAlign: 'center', borderBottom: '1px solid #ccc' }}>
        <PDFDownloadLink
          document={<Facture />}
          fileName={`facture_${invoice.number}.pdf`}
          style={{
            padding: '10px 20px',
            backgroundColor: '#b8860b',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 4,
            fontSize: 14,
            display: 'inline-block'
          }}
        >
          {({ loading }) => (loading ? 'Génération du PDF...' : 'Télécharger la facture PDF')}
        </PDFDownloadLink>
      </div>
      <PDFViewer style={{ flex: 1, width: '100%' }}>
        <Facture />
      </PDFViewer>
    </div>
  );
};

export default Facture;