import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";

import { ShoppingBag } from "lucide-react-native";

const Splash = ({ navigation }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
        }}
      >
        <View style={styles.logo}>
          <ShoppingBag
            size={55}
            color="#fff"
          />
        </View>
      </Animated.View>

      <Animated.Text
        style={[
          styles.title,
          {
            opacity,
          },
        ]}
      >
        Shop Now
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity,
          },
        ]}
      >
        Smart Shopping Experience
      </Animated.Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7C3AED",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  title: {
    marginTop: 25,
    fontSize: 34,
    fontFamily: "Poppins-Medium",
    color: "#fff",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#E9D5FF",
  },
});