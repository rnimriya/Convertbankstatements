import { View, Text, StyleSheet } from "react-native";

const FREE_CAP = 8;

interface Props {
  tier: string;
  pagesUsed: number;
  pageLimit: number;
}

export function FreePagesBar({ tier, pagesUsed, pageLimit }: Props) {
  if (tier === "FREE") {
    const remaining = Math.max(0, FREE_CAP - pagesUsed);
    const pct = pagesUsed / FREE_CAP;
    const depleted = remaining === 0;

    return (
      <View style={[styles.card, depleted && styles.cardWarning]}>
        <View style={styles.row}>
          <Text style={styles.label}>Free pages</Text>
          <Text style={[styles.count, depleted && styles.countWarning]}>
            {remaining} / {FREE_CAP}
          </Text>
        </View>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              { width: `${pct * 100}%` as `${number}%` },
              depleted && styles.fillWarning,
            ]}
          />
        </View>
        {depleted && (
          <Text style={styles.hint}>Pay $1.99 per document to continue</Text>
        )}
      </View>
    );
  }

  if (tier === "PRO" || tier === "BUSINESS") {
    const remaining = Math.max(0, pageLimit - pagesUsed);
    const pct = pagesUsed / pageLimit;
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Monthly pages</Text>
          <Text style={styles.count}>
            {remaining.toLocaleString()} / {pageLimit.toLocaleString()}
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct * 100}%` as `${number}%` }]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Pay-as-you-go · $1.99 / document</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  cardWarning: { borderColor: "#fbbf24", backgroundColor: "#fffbeb" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 13, fontWeight: "600", color: "#475569" },
  count: { fontSize: 20, fontWeight: "800", color: "#0284c7" },
  countWarning: { color: "#d97706" },
  track: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: { height: 8, backgroundColor: "#0284c7", borderRadius: 4 },
  fillWarning: { backgroundColor: "#f59e0b" },
  hint: { fontSize: 12, color: "#b45309", fontWeight: "500" },
});
