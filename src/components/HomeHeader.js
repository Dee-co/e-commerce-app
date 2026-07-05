import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react-native";
import AppText from "./AppText";

const HomeHeader = ({
  search,
  setSearch,
  onSortPress,
  showSortOptions,
  sortOption,
  onSortSelect,
}) => {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94a3b8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearBtn}>
            <X size={16} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Button */}
      <TouchableOpacity 
        style={[
          styles.sortBtn,
          sortOption && styles.sortBtnActive
        ]} 
        onPress={onSortPress}
        activeOpacity={0.7}
      >
        <SlidersHorizontal size={18} color={sortOption ? "#6366f1" : "#334155"} />
        {sortOption && (
          <View style={styles.sortIndicator} />
        )}
      </TouchableOpacity>

      {/* Sort Options Modal */}
      <Modal
        transparent
        visible={showSortOptions}
        animationType="fade"
        onRequestClose={() => onSortPress()}
      >
        <Pressable style={styles.modalOverlay} onPress={onSortPress}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <AppText style={styles.modalTitle}>Sort by Price</AppText>
              <TouchableOpacity onPress={onSortPress}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.optionItem,
                sortOption === 'low-to-high' && styles.optionActive,
              ]}
              onPress={() => onSortSelect('low-to-high')}
            >
              <ArrowUpDown size={16} color={sortOption === 'low-to-high' ? "#6366f1" : "#64748b"} />
              <AppText style={[
                styles.optionText,
                sortOption === 'low-to-high' && styles.optionTextActive,
              ]}>
                Price: Low to High
              </AppText>
              {sortOption === 'low-to-high' && (
                <View style={styles.checkMark} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionItem,
                sortOption === 'high-to-low' && styles.optionActive,
              ]}
              onPress={() => onSortSelect('high-to-low')}
            >
              <ArrowUpDown size={16} color={sortOption === 'high-to-low' ? "#6366f1" : "#64748b"} />
              <AppText style={[
                styles.optionText,
                sortOption === 'high-to-low' && styles.optionTextActive,
              ]}>
                Price: High to Low
              </AppText>
              {sortOption === 'high-to-low' && (
                <View style={styles.checkMark} />
              )}
            </TouchableOpacity>

            {sortOption && (
              <TouchableOpacity
                style={styles.clearOption}
                onPress={() => {
                  onSortSelect(null);
                  onSortPress();
                }}
              >
                <AppText style={styles.clearOptionText}>Clear Sort</AppText>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 10,
  },

  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
    paddingVertical: 8,
fontFamily: "Poppins-Bold",
  },

  clearBtn: {
    padding: 4,
  },

  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },

  sortBtnActive: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },

  sortIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    width: "85%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  modalTitle: {
    fontSize: 16,
  fontFamily: "Poppins-Medium",
    color: "#1e293b",
  },

  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    marginBottom: 8,
    gap: 10,
  },

  optionActive: {
    backgroundColor: "#eef2ff",
    borderWidth: 1,
    borderColor: "#6366f1",
  },

  optionText: {
    fontSize: 14,
    color: "#64748b",
  fontFamily: "Poppins-Medium",
    flex: 1,
  },

  optionTextActive: {
    color: "#6366f1",
  fontFamily: "Poppins-Medium",
  },

  checkMark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#6366f1",
    borderWidth: 2,
    borderColor: "#6366f1",
  },

  clearOption: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },

  clearOptionText: {
    color: "#ef4444",
    fontSize: 13,
  },
});

export default HomeHeader;