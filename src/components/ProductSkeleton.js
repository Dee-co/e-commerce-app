import React from "react";
import { View, StyleSheet } from "react-native";

const ProductSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.image} />
      <View style={styles.title} />
      <View style={styles.price} />
    </View>
  );
};

export default ProductSkeleton;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },

  image: {
    height: 220,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },

  title: {
    marginTop: 12,
    width: "80%",
    height: 18,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
  },

  price: {
    marginTop: 10,
    width: "40%",
    height: 18,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
  },
});