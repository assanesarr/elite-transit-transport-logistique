// @ts-nocheck
import {
    Document,
    Page,
    Text,
    View,
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
    // Table header (répété sur chaque page)
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#0f172a',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 10,
        marginBottom: 5,
        borderRadius: 4,
    },
    tableHeaderCell: {
        fontSize: 8,
        fontWeight: 'bold',
        color: 'white',
    },
    colName: {
        width: '30%',
    },
    colPhone: {
        width: '20%',
    },
    colEmail: {
        width: '25%',
    },
    colAddress: {
        width: '25%',
    },
    // Lignes du tableau
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        alignItems: 'flex-start',
    },
    tableRowEven: {
        backgroundColor: '#f8fafc',
    },
    tableCell: {
        fontSize: 8,
        color: '#1e293b',
    },
    cellName: {
        width: '30%',
    },
    cellPhone: {
        width: '20%',
    },
    cellEmail: {
        width: '25%',
    },
    cellAddress: {
        width: '25%',
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
// const ReportHeader = ({ entreprise, currentDate, logoUrl }) => (
//     <>
//         <View style={styles.head} fixed>
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
//                 <Text style={styles.reportTitle}>LISTE COMPLÈTE DES CLIENTS</Text>
//                 <Text style={styles.reportSubtitle}>
//                     {currentDate}
//                 </Text>
//             </View>
//         </View>


//     </>
// );

// Composant pour une ligne client avec adresse
const ClientRow = ({ client, index }) => (
    <View style={[styles.tableRow, index % 2 === 1 && styles.tableRowEven]}>
        <View style={[styles.tableCell, styles.cellName]}>
            <Text>{client.name}</Text>
        </View>
        <View style={[styles.tableCell, styles.cellPhone]}>
            <Text>{client.phone || '-'}</Text>
        </View>
        <View style={[styles.tableCell, styles.cellEmail]}>
            <Text>{client.email || '-'}</Text>
        </View>
        <View style={[styles.tableCell, styles.cellAddress]}>
            <Text>{client.address || '-'}</Text>
        </View>
    </View>
);

// Composant principal avec pagination automatique
export const ClientSimpleReportPDF = ({ clients, entreprise }) => {
    const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Calcul du nombre de lignes par page
    // Ajusté pour l'adresse (lignes plus hautes)
    const LIGNES_PAR_PAGE = 18;
    const totalPages = Math.max(1, Math.ceil(clients.length / LIGNES_PAR_PAGE));

    // Découper les clients par page
    const getClientsForPage = (pageNumber) => {
        const startIndex = (pageNumber - 1) * LIGNES_PAR_PAGE;
        const endIndex = Math.min(startIndex + LIGNES_PAR_PAGE, clients.length);
        return clients.slice(startIndex, endIndex);
    };

    return (
        <Document>
            {Array.from({ length: totalPages }, (_, pageIndex) => {
                const pageNumber = pageIndex + 1;
                const pageClients = getClientsForPage(pageNumber);

                return (
                    <Page key={pageNumber} size="A4" style={styles.page}>
                        {/* Barre en haut fixe */}
                        <View style={styles.topBar} fixed />

                        {/* En-tête (fixe sur chaque page) */}
                        <View style={styles.header}>
                            <ReportHeader
                                title={'LISTE COMPLÈTE DES CLIENTS'}
                                entreprise={entreprise}
                                subtitle={currentDate}
                                logoUrl={'/logo.jpeg'}
                            />

                            {/* En-tête du tableau - sera répété sur chaque page grâce à 'fixed' */}
                            <View style={styles.tableHeader} fixed>
                                <View style={[styles.tableHeaderCell, styles.colName]}>
                                    <Text>NOM COMPLET</Text>
                                </View>
                                <View style={[styles.tableHeaderCell, styles.colPhone]}>
                                    <Text>TÉLÉPHONE</Text>
                                </View>
                                <View style={[styles.tableHeaderCell, styles.colEmail]}>
                                    <Text>EMAIL</Text>
                                </View>
                                <View style={[styles.tableHeaderCell, styles.colAddress]}>
                                    <Text>ADRESSE</Text>
                                </View>
                            </View>
                        </View>



                        {/* Liste des clients pour cette page */}
                        {pageClients.map((client, idx) => (
                            <ClientRow
                                key={(pageNumber - 1) * LIGNES_PAR_PAGE + idx}
                                client={client}
                                index={(pageNumber - 1) * LIGNES_PAR_PAGE + idx}
                            />
                        ))}

                        {/* Pied de page fixe */}
                        <View style={styles.footer} fixed>
                            <Text>© {entreprise.nom} · NINEA: {entreprise.ninea} · RCCM: {entreprise.rc}</Text>
                            {/* <Text>Généré le {currentDate}</Text> */}
                        </View>

                        {/* Numéro de page fixe */}
                        <Text style={styles.pageNumber} fixed>
                            Page {pageNumber} / {totalPages}
                        </Text>
                    </Page>
                );
            })}
        </Document>
    );
};

// Fonction pour ouvrir le rapport dans une nouvelle fenêtre
export const printSimpleClientReport = async (clients, entreprise) => {
    try {
        const blob = await pdf(
            <ClientSimpleReportPDF
                clients={clients}
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
export const downloadSimpleClientReport = async (clients, entreprise, fileName) => {
    try {
        const blob = await pdf(
            <ClientSimpleReportPDF
                clients={clients}
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

// Fonction principale avec gestion automatique de la pagination
export const generateSimpleClientList = async (clients, entreprise) => {
    if (!clients || clients.length === 0) {
        console.error("Aucun client à afficher");
        return;
    }

    const fileName = `liste_clients_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;

    // Pour ouvrir dans une nouvelle fenêtre
    await printSimpleClientReport(clients, entreprise);

    // OU pour télécharger directement (décommentez la ligne ci-dessous)
    // await downloadSimpleClientReport(clients, entreprise, fileName);
};

// Version avec hauteur dynamique (plus précise)
export const generateSimpleClientListDynamic = async (clients, entreprise) => {
    if (!clients || clients.length === 0) {
        console.error("Aucun client à afficher");
        return;
    }

    // Calcul dynamique basé sur le nombre de clients
    const LIGNES_PAR_PAGE = 18; // Ajusté pour A4 avec adresse
    const totalPages = Math.ceil(clients.length / LIGNES_PAR_PAGE);

    console.log(`Génération du rapport: ${clients.length} clients sur ${totalPages} page(s)`);

    // await printSimpleClientReport(clients, entreprise);


    const fileName = `liste_clients_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;

     await downloadSimpleClientReport(clients, entreprise, fileName);
};

// Exemple d'utilisation avec données de test
/*
const entreprise = {
    nom: "ELITE TRANSIT TRANSPORT LOGISTIQUE",
    adresse: "19, Boulevard Djily Mbaye",
    ville: "Dakar",
    pays: "Sénégal",
    ninea: "005553020",
    rc: "SN-DKR-2015-13017",
    telephone: "+221 33 822 48 67",
    email: "elitetransit16@gmail.com"
};

const clients = [
    {
        name: "Jean Dupont",
        telephone: "+221 77 123 45 67",
        email: "jean.dupont@email.com",
        adresse: "12 Rue de la Liberté, Dakar"
    },
    {
        name: "Marie Diop",
        telephone: "+221 78 987 65 43",
        email: "marie.diop@email.com",
        adresse: "45 Avenue Cheikh Anta Diop, Dakar"
    },
    {
        name: "Abdoulaye Fall",
        telephone: "+221 76 555 88 99",
        email: "a.fall@email.com",
        adresse: "78 Rue Mermoz, Dakar"
    }
];

// Appeler la fonction
generateSimpleClientList(clients, entreprise);
*/