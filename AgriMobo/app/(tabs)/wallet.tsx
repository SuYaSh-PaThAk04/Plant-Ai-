import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import QRCode from "react-native-qrcode-svg";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Eye,
  EyeOff,
  QrCode,
  Settings,
  History,
} from "lucide-react-native";



export default function WalletScreen() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showQR, setShowQR] = useState(false);

  const walletAddress = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
  const balance = "2.4567";
  const currency = "ETH";

  const transactions = [
    {
      id: 1,
      type: "received",
      amount: "0.5",
      currency: "ETH",
      from: "0x1234...5678",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "sent",
      amount: "1.2",
      currency: "ETH",
      to: "0x9876...5432",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "received",
      amount: "0.8",
      currency: "ETH",
      from: "0x4567...8901",
      timestamp: "3 days ago",
      status: "completed",
    },
  ];

  const copyToClipboard = (text: string) => {
    // In a real app, you'd use Clipboard from @react-native-clipboard/clipboard
    Alert.alert("Copied", "Address copied to clipboard");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}
      >
        {/* Header */}
        <View
          style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 }}
        >
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600 }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Wallet
            </Text>
            <Text style={{ fontSize: 16, color: "#9ca3af" }}>
              Manage your digital assets and transactions
            </Text>
          </MotiView>
        </View>

        {/* Balance Card */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 200 }}
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(16, 185, 129, 0.2)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}>
                Total Balance
              </Text>
              <TouchableOpacity
                onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                style={{
                  padding: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: 8,
                }}
              >
                {isBalanceVisible ? (
                  <EyeOff size={20} fill="#10b981" />
                ) : (
                  <Eye size={20} fill="#10b981" />
                )}
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 36, fontWeight: "bold", color: "#10b981" }}
              >
                {isBalanceVisible ? balance : "••••"}
              </Text>
              <Text style={{ fontSize: 18, color: "#9ca3af", marginLeft: 8 }}>
                {currency}
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(16, 185, 129, 0.3)",
                }}
              >
                <ArrowDownLeft size={16} fill="#10b981" />
                <Text
                  style={{ color: "#10b981", marginLeft: 8, fontWeight: "600" }}
                >
                  Receive
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 12,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(16, 185, 129, 0.3)",
                }}
              >
                <ArrowUpRight size={16} fill="#10b981" />
                <Text
                  style={{ color: "#10b981", marginLeft: 8, fontWeight: "600" }}
                >
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>

        {/* Wallet Address */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 400 }}
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.8)",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "rgba(75, 85, 99, 0.5)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 12,
              }}
            >
              Wallet Address
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Text
                style={{
                  flex: 1,
                  color: "#9ca3af",
                  fontSize: 14,
                  fontFamily: "monospace",
                }}
                numberOfLines={1}
              >
                {walletAddress}
              </Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(walletAddress)}
                style={{
                  padding: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: 8,
                }}
              >
                <Copy size={16} fill="#10b981" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowQR(!showQR)}
                style={{
                  padding: 8,
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: 8,
                }}
              >
                <QrCode size={16} fill="#10b981" />
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>

        {/* QR Code */}
        {showQR && (
          <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 300 }}
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderRadius: 16,
                padding: 24,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(75, 85, 99, 0.5)",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#fff",
                  marginBottom: 16,
                }}
              >
                QR Code
              </Text>
              <QRCode
                value={walletAddress}
                size={200}
                color="#10b981"
                backgroundColor="transparent"
              />
            </MotiView>
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 600 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Quick Actions
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderRadius: 16,
                  padding: 20,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(75, 85, 99, 0.5)",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#10b981",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <CreditCard size={24} fill="#fff" />
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  Buy Crypto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderRadius: 16,
                  padding: 20,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(75, 85, 99, 0.5)",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#3b82f6",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <History size={24} fill="#fff" />
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  History
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderRadius: 16,
                  padding: 20,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "rgba(75, 85, 99, 0.5)",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: "#8b5cf6",
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <Settings size={24} fill="#fff" />
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  Settings
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>

        {/* Recent Transactions */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 800 }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#fff",
                marginBottom: 16,
              }}
            >
              Recent Transactions
            </Text>
            <View style={{ gap: 12 }}>
              {transactions.map((tx, index) => (
                <View
                  key={tx.id}
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.8)",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: "rgba(75, 85, 99, 0.5)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor:
                        tx.type === "received"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {tx.type === "received" ? (
                      <ArrowDownLeft size={20} fill="#10b981" />
                    ) : (
                      <ArrowUpRight size={20} fill="#ef4444" />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {tx.type === "received" ? "Received" : "Sent"} {tx.amount}{" "}
                      {tx.currency}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        marginBottom: 4,
                      }}
                    >
                      {tx.type === "received"
                        ? `From: ${tx.from}`
                        : `To: ${tx.to}`}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>
                      {tx.timestamp}
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#10b981",
                        fontWeight: "600",
                      }}
                    >
                      {tx.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </MotiView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
