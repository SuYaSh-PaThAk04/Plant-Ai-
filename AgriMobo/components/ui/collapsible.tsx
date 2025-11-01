import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { ChevronRight } from "lucide-react-native";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <ChevronRight
          size={18}
          color="#9ca3af"
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    paddingVertical: 8,
  },
});
