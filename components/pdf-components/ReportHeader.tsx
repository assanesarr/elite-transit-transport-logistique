import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
        marginRight: 4,
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
    topBar: {
        height: 4,
        backgroundColor: '#0f172a',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
});

interface ReportHeaderProps {
    entreprise: {
        nom: string;
        adresse: string;
        ville: string;
        pays: string;
        ninea: string;
        rc: string;
        telephone: string;
        email: string;
    };
    title: string;
    subtitle?: string;
    logoUrl?: string | null;
    showTopBar?: boolean;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
    entreprise,
    title,
    subtitle,
    logoUrl = null,
    showTopBar = true,
}) => {
    return (
        <>
            {showTopBar && <View style={styles.topBar} />}
            <View style={styles.head}>
                <View style={styles.headLeft}>
                    {logoUrl && <Image src={logoUrl} style={styles.logo} />}
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
                    <Text style={styles.reportTitle}>{title}</Text>
                    {subtitle && <Text style={styles.reportSubtitle}>{subtitle}</Text>}
                </View>
            </View>
        </>
    );
};