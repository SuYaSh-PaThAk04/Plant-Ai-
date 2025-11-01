import React from "react";
import { ScrollView, View,useColorScheme, StyleSheet } from "react-native";

type Props = {
  children: React.ReactNode;
  headerImage?: React.ReactNode;
  headerBackgroundColor?: {
    light: string;
    dark: string;
  };
};

export function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const backgroundColor =
    headerBackgroundColor?.[colorScheme] ??
    headerBackgroundColor?.light ??
    "#000";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>{headerImage}</View>
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    height: 240,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});

export default ParallaxScrollView;
