import * as React from "react";
import { Text, type TextProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...otherProps
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "title" && { fontSize: 24, fontWeight: "bold" },
        type === "subtitle" && { fontSize: 18, fontWeight: "600" },
        type === "defaultSemiBold" && { fontWeight: "600" },
        type === "link" && { color: "#0A84FF" },
        style,
      ]}
      {...otherProps}
    />
  );
}
