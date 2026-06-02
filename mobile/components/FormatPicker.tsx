import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const FORMATS = [
  { id: "csv", label: "CSV" },
  { id: "xlsx", label: "Excel" },
  { id: "ofx", label: "OFX" },
  { id: "qfx", label: "QFX" },
];

interface Props {
  selected: string[];
  onChange: (formats: string[]) => void;
}

export function FormatPicker({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      onChange(selected.filter((f) => f !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Export formats</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {FORMATS.map(({ id, label }) => {
          const active = selected.includes(id);
          return (
            <TouchableOpacity
              key={id}
              onPress={() => toggle(id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 },
  row: { gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  chipActive: { borderColor: "#0284c7", backgroundColor: "#f0f9ff" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#64748b" },
  chipTextActive: { color: "#0369a1" },
});
