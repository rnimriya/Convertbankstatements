import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

interface Transaction {
  date: string;
  description: string;
  amount: number;
  balance: number | null;
  category: string | null;
}

interface BillingDecision {
  billing_type: string;
  pages_charged: number;
  payment_required: boolean;
  message: string;
}

interface ProcessResult {
  success: boolean;
  file_name: string;
  page_count: number;
  transaction_count: number;
  bank_name: string | null;
  billing: BillingDecision;
  transactions: Transaction[];
  export_urls: Record<string, string>;
  processing_ms: number;
}

const FORMAT_LABELS: Record<string, string> = {
  csv: "CSV",
  xlsx: "Excel (.xlsx)",
  ofx: "OFX (QuickBooks)",
  qfx: "QFX (Quicken)",
};

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [sharingFormat, setSharingFormat] = useState<string | null>(null);

  if (!params.data) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>No result data found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let result: ProcessResult;
  try {
    result = JSON.parse(params.data as string);
  } catch (e) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Failed to parse transaction data.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async (format: string, dataUrl: string) => {
    setSharingFormat(format);
    try {
      const parts = dataUrl.split(";base64,");
      const base64Content = parts[1] ?? parts[0];
      const extension = format;
      const cleanFileName = result.file_name.replace(/[^a-zA-Z0-9]/g, "_").replace(/_pdf$/, "");
      const filename = `${cleanFileName}_transactions.${extension}`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      // Write base64 string directly to Expo cache filesystem
      await FileSystem.writeAsStringAsync(fileUri, base64Content, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Launch native sharing sheet
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: format === "csv" ? "text/csv" : "application/octet-stream",
          dialogTitle: `Share ${filename}`,
        });
      } else {
        Alert.alert("Sharing unavailable", "Native sharing sheet is not supported on this device.");
      }
    } catch (error) {
      Alert.alert("Sharing failed", error instanceof Error ? error.message : "Could not export document.");
    } finally {
      setSharingFormat(null);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Hero Card */}
      <View style={styles.successCard}>
        <View style={styles.successHeader}>
          <Ionicons name="checkmark-circle" size={28} color="#10b981" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.successTitle}>Processing complete!</Text>
            <Text style={styles.fileName}>{result.file_name}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{result.page_count}</Text>
            <Text style={styles.statLabel}>Pages</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>{result.transaction_count}</Text>
            <Text style={styles.statLabel}>Txns</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statVal}>
              {(result.processing_ms / 1000).toFixed(1)}s
            </Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
        </View>

        {result.bank_name && (
          <Text style={styles.bankLabel}>
            Detected: <Text style={styles.bankName}>{result.bank_name}</Text>
          </Text>
        )}

        <Text style={styles.billingMessage}>
          {result.billing.message}
        </Text>

        {/* Export/Share Buttons */}
        {Object.keys(result.export_urls).length > 0 && (
          <View style={styles.downloadsContainer}>
            <Text style={styles.downloadsHeader}>Export Downloads</Text>
            {Object.entries(result.export_urls).map(([fmt, url]) => (
              <TouchableOpacity
                key={fmt}
                style={styles.exportBtn}
                onPress={() => handleShare(fmt, url)}
                disabled={sharingFormat !== null}
              >
                <View style={styles.exportBtnLeft}>
                  <Ionicons name="document-text" size={20} color="#059669" />
                  <Text style={styles.exportBtnText}>
                    {FORMAT_LABELS[fmt] ?? fmt.toUpperCase()}
                  </Text>
                </View>
                <Ionicons name="share-social-outline" size={18} color="#64748b" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Transaction Preview */}
      {result.transactions && result.transactions.length > 0 && (
        <View style={styles.previewContainer}>
          <View style={styles.previewHeader}>
            <Ionicons name="list-outline" size={18} color="#0284c7" />
            <Text style={styles.previewTitle}>Transaction Preview</Text>
          </View>

          <View style={styles.listContainer}>
            {result.transactions.slice(0, 10).map((txn, index) => (
              <View key={index} style={styles.txnRow}>
                <View style={styles.txnLeft}>
                  <Text style={styles.txnDescription} numberOfLines={1}>
                    {txn.description}
                  </Text>
                  <Text style={styles.txnMeta}>
                    {txn.date} {txn.category ? `· ${txn.category}` : ""}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txnAmount,
                    txn.amount >= 0 ? styles.txnCredit : styles.txnDebit,
                  ]}
                >
                  {txn.amount >= 0 ? "+" : ""}
                  ₹{Math.abs(txn.amount).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {result.transaction_count > 10 && (
            <Text style={styles.moreHint}>
              + {result.transaction_count - 10} more transactions in downloaded export
            </Text>
          )}
        </View>
      )}

      {/* Action footer */}
      <TouchableOpacity style={styles.resetBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={18} color="#475569" style={styles.resetIcon} />
        <Text style={styles.resetBtnText}>Process another statement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#f8fafc",
    gap: 12,
  },
  errorText: { fontSize: 16, color: "#475569", fontWeight: "600", textAlign: "center" },
  backBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#0284c7",
    borderRadius: 8,
  },
  backBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  successCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  successHeader: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 16 },
  headerTextContainer: { flex: 1 },
  successTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  fileName: { fontSize: 13, color: "#64748b", marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statVal: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  statLabel: { fontSize: 11, color: "#94a3b8", marginTop: 2, fontWeight: "600", textTransform: "uppercase" },
  bankLabel: { textAlign: "center", fontSize: 12, color: "#94a3b8" },
  bankName: { color: "#475569", fontWeight: "700" },
  billingMessage: {
    textAlign: "center",
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
    marginTop: 8,
  },
  downloadsContainer: { marginTop: 16, borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 14, gap: 8 },
  downloadsHeader: { fontSize: 11, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  exportBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1fae5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  exportBtnLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  exportBtnText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  previewContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  previewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBtmWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewTitle: { fontSize: 14, fontWeight: "700", color: "#334155" },
  listContainer: { divideY: 1, divideColor: "#f1f5f9" },
  txnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  txnLeft: { flex: 1, marginRight: 16 },
  txnDescription: { fontSize: 13, fontWeight: "500", color: "#334155" },
  txnMeta: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  txnAmount: { fontSize: 13, fontWeight: "700", textAlign: "right" },
  txnCredit: { color: "#10b981" },
  txnDebit: { color: "#334155" },
  moreHint: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    fontWeight: "500",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  resetIcon: { marginRight: 6 },
  resetBtnText: { fontSize: 14, fontWeight: "600", color: "#475569" },
});
