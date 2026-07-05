import React, { useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Animated,
} from "react-native";
import AppText from "./AppText";

const CategoryList = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleSelect = (item) => {
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={["All", ...categories]}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const isActive = selectedCategory === item;
          
          return (
            <TouchableOpacity
              style={[
                styles.item,
                isActive && styles.activeItem,
              ]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <AppText
                style={[
                  styles.text,
                  isActive && styles.activeText,
                ]}
                numberOfLines={1}
              >
                {item?.charAt(0).toUpperCase() + item?.substring(1)}
              </AppText>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.03)",
  },

  listContainer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },

  item: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 32,
    justifyContent: "center",
  },

  activeItem: {
    backgroundColor: "#7C3AED",
    borderColor: "#6366f1",
    transform: [{ scale: 1 }],
  },

  text: {
    color: "#64748b",
 fontFamily: "Poppins-Medium",
    fontSize: 12,
    letterSpacing: 0.2,
  },

  activeText: {
    color: "#ffffff",
 fontFamily: "Poppins-Medium",
  },
});