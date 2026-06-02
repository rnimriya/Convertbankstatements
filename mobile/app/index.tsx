import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { FreePagesBar } from "@/components/FreePagesBar";
import { FormatPicker } from "@/components/FormatPicker";
import { useBillingContext } from "@/hooks/useBillingContext";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

export default function HomeScreen() {
  const router = useRouter();
  const { billing, refresh } = useBillingContext();
  const [uploading, setUploading] = useState(false);
  const [formats, setFormats] = useState<string[]>(["csv"]);

  const pickAndUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const uploadResult = await FileSystem.uploadAsync(
        `${BACKEND_URL}/api/process-statement`,
        asset.uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "file",
          parameters: { export_formats: formats.join(",") },
          headers: {
            // In production, attach the Supabase JWT here
            // Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = JSON.parse(uploadResult.body);

      if (uploadResult.status === 402) {
        Alert.alert(
          "Payment required",
          `$${data.detail.price_usd.toFixed(2)} to process this document.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Pay now",
              onPress: () => Linking.openURL(data.detail.stripe_checkout_url),
            },
          ]
        );
        return;
      }

      if (uploadResult.status !== 200) {
        throw new Error(data.detail ?? "Processing failed");
      }

      await refresh();
      router.push({ pathname: "/result", params: { data: JSON.stringify(data) } });
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {billing && (
        <FreePagesBar
          tier={billing.tier}
          pagesUsed={billing.pagesUsedThisPeriod}
          pageLimit={billing.monthlyPageLimit}
        />
      )}

      <Text style={styles.heading}>Convert bank statement</Text>
      <Text style={styles.subtext}>
        Upload a PDF — we support 1,000+ banks worldwide.
      </Text>

      <FormatPicker selected={formats} onChange={setFormats} />

      <TouchableOpacity
        style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
        onPress={pickAndUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadBtnText}>Select PDF</Text>
        )}
      </TouchableOpacity>

      {billing?.tier === "FREE" && billing.pagesUsedThisPeriod < 8 && (
        <Text style={styles.freeHint}>
          ✓ First {8 - billing.pagesUsedThisPeriod} pages are free
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, gap: 16 },
  heading: { fontSize: 24, fontWeight: "800", color: "#0f172a", marginTop: 8 },
  subtext: { fontSize: 14, color: "#64748b", lineHeight: 20 },
  uploadBtn: {
    backgroundColor: "#0284c7",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0284c7",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  uploadBtnDisabled: { opacity: 0.6 },
  uploadBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  freeHint: {
    textAlign: "center",
    fontSize: 13,
    color: "#059669",
    fontWeight: "600",
  },
});
