import React from "react";
import { View } from "react-native";

import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppText from "./src/components/AppText"
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";

const toastConfig = {
  customToast: ({ text1 }) => (
    <View
      style={{
        backgroundColor: "rgba(8, 15, 23, 0.85)",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: "center",
      }}
    >
      <AppText
        style={{
          color: "#fff",
          fontSize: 14,
          fontFamily: "Poppins-Medium",
        }}
      >
        {text1}
      </AppText>
    </View>
  ),
};

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </Provider>
  );
}