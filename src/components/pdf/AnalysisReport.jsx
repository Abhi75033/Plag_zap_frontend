import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register nice fonts if possible, or use standard ones
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#7c3aed', // Purple-600
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7c3aed'
  },
  date: {
    fontSize: 10,
    color: '#6b7280'
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 8
  },
  scoreItem: {
    alignItems: 'center'
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase'
  },
  contentContainer: {
    marginBottom: 30
  },
  contentTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#374151'
  },
  contentText: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.5,
    textAlign: 'justify'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10
  },
  certificateBadge: {
    position: 'absolute',
    top: 150,
    left: '30%',
    width: 200,
    height: 200,
    opacity: 0.1,
    transform: 'rotate(-45deg)'
  }
});

const AnalysisReport = ({ result, text, userName }) => {
  // Safety checks for null/undefined values
  if (!result || !text) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Report data not available</Text>
        </Page>
      </Document>
    );
  }

  const aiScore = result.aiScore || 0;
  const plagiarismScore = result.plagarismScore || result.overallScore || 0;
  const isClean = aiScore < 10 && plagiarismScore < 10;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>PlagZap</Text>
          <View>
             <Text style={styles.date}>Date: {new Date().toLocaleDateString()}</Text>
             <Text style={styles.date}>ID: {result.id || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.title}>Content Authenticity Report</Text>

        {/* Scores */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreItem}>
            <Text style={{...styles.scoreValue, color: aiScore > 50 ? '#ef4444' : '#10b981'}}>
              {aiScore}%
            </Text>
            <Text style={styles.scoreLabel}>AI Probability</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={{...styles.scoreValue, color: result.overallScore > 50 ? '#ef4444' : '#10b981'}}>
               {result.overallScore}%
            </Text>
            <Text style={styles.scoreLabel}>Plagiarism Risk</Text>
          </View>
        </View>

        {/* Certificate Badge Background */}
        {isClean && (
          <View style={{position: 'absolute', top: 200, left: 100, opacity: 0.1, transform: 'rotate(-30deg)'}}>
             <Text style={{fontSize: 80, color: '#10b981', fontWeight: 'bold'}}>VERIFIED</Text>
             <Text style={{fontSize: 80, color: '#10b981', fontWeight: 'bold'}}>HUMAN</Text>
          </View>
        )}

        {/* Content Preview */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentTitle}>Analyzed Content Snippet</Text>
          <Text style={styles.contentText}>
            {text.substring(0, 2000)}
            {text.length > 2000 ? '...' : ''}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This report was generated automatically by PlagZap. scan ID: {result.id}</Text>
          <Text>Generated for user: {userName || 'Guest'}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default AnalysisReport;
