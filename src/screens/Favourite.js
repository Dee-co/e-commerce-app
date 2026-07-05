import React, { useCallback } from "react";
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ShoppingCart, Plus, Minus, Trash2, Heart } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromFavorite,
  clearFavorites,
} from "../store/slices/favouriteSlice";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from "../store/slices/cartSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../components/AppText";

const FavoriteItemRow = ({ item }) => {
  const dispatch = useDispatch();

  const isOutOfStock = item.stock === 0;

  // Get quantity already in cart for this item
  const quantity = useSelector((state) => {
    const cartItem = state.cart.items.find(
      (product) => product.id === item.id
    );
    return cartItem?.quantity || 0;
  });

  const discountedPrice = (
    item.price - (item.price * item.discountPercentage) / 100
  ).toFixed(2);

  // Remove from favorites only
  const handleRemove = useCallback(() => {
    dispatch(removeFromFavorite(item.id));
  }, [dispatch, item.id]);

  // Move to cart: add it to cart, then drop it out of favorites
  const handleMoveToCart = useCallback(() => {
    if (isOutOfStock) {
      Alert.alert("Out Of Stock", "This product is currently unavailable");
      return;
    }
    dispatch(addToCart({ ...item, quantity: 1 }));
    dispatch(removeFromFavorite(item.id));
  }, [dispatch, item, isOutOfStock]);

  const handleIncrease = useCallback(() => {
    if (quantity >= item.stock) {
      Alert.alert(
        "Maximum Limit",
        `Only ${item.stock} items available in stock`
      );
      return;
    }
    dispatch(increaseQuantity(item.id));
  }, [dispatch, quantity, item.stock, item.id]);

  const handleDecrease = useCallback(() => {
    if (quantity > 0) {
      dispatch(decreaseQuantity(item.id));
    }
  }, [dispatch, quantity, item.id]);

  return (
    <View style={[styles.row, isOutOfStock && styles.rowOutOfStock]}>
      <View style={styles.topSection}>
        <View style={styles.imageBox}>
          <Image
            source={{ uri: item.thumbnail }}
            style={[styles.image, isOutOfStock && styles.imageMuted]}
          />
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <AppText style={styles.outOfStockOverlayText}>Out of Stock</AppText>
            </View>
          )}
        </View>

        <View style={styles.rowContent}>
          <AppText
            numberOfLines={2}
            style={[styles.rowTitle, isOutOfStock && styles.textMuted]}
          >
            {item.title}
          </AppText>
          <AppText style={[styles.rowBrand, isOutOfStock && styles.textMuted]}>
            {item.brand}
          </AppText>

          <View style={styles.priceRow}>
            <AppText style={[styles.newPrice, isOutOfStock && styles.textMuted]}>
              ₹{discountedPrice}
            </AppText>
            <AppText style={styles.oldPrice}>₹{item.price}</AppText>
          </View>
        </View>
      </View>

      {/* Action row */}
      {isOutOfStock ? (
        <View style={styles.actionRow}>
          <View style={styles.outOfStockBadge}>
            <AppText style={styles.outOfStockBadgeText}>Unavailable</AppText>
          </View>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Trash2 size={14} color="#ef4444" />
            <AppText style={styles.removeBtnText}>Remove</AppText>
          </TouchableOpacity>
        </View>
      ) : quantity === 0 ? (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.moveToCartBtn}
            onPress={handleMoveToCart}
            activeOpacity={0.85}
          >
            <ShoppingCart size={14} color="#fff" />
            <AppText style={styles.moveToCartText}>Move to Cart</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Trash2 size={14} color="#ef4444" />
            <AppText style={styles.removeBtnText}>Remove</AppText>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleDecrease}
              activeOpacity={0.7}
            >
              <Minus size={13} color="#7c3aed" />
            </TouchableOpacity>
            <AppText style={styles.qtyText}>{quantity}</AppText>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleIncrease}
              activeOpacity={0.7}
            >
              <Plus size={13} color="#7c3aed" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Trash2 size={14} color="#ef4444" />
            <AppText style={styles.removeBtnText}>Remove</AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const EmptyFavorite = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconBox}>
      <Heart size={34} color="#7c3aed" />
    </View>
    <AppText style={styles.emptyTitle}>No favorites yet</AppText>
    <AppText style={styles.emptySubtitle}>
      Items you love will show up here
    </AppText>
  </View>
);

const Favourite = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.favorite.items);

  const handleClearFavorites = useCallback(() => {
    Alert.alert("Clear Favorites", "Remove all items from your favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => dispatch(clearFavorites()),
      },
    ]);
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>My Favourites</AppText>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearFavorites} activeOpacity={0.7}>
            <AppText style={styles.clearText}>Clear All</AppText>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyFavorite />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <FavoriteItemRow item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#0f172a",
    letterSpacing: 0.1,
  },

  clearText: {
    fontSize: 12.5,
    fontFamily: "Poppins-Medium",
    color: "#ef4444",
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },

  row: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  rowOutOfStock: {
    opacity: 0.6,
  },

  topSection: {
    flexDirection: "row",
  },

  imageBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: "#f4f6fb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },

  image: {
    width: "78%",
    height: "78%",
    resizeMode: "contain",
  },

  imageMuted: {
    opacity: 0.35,
  },

  outOfStockOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15,23,42,0.75)",
    paddingVertical: 3,
    alignItems: "center",
  },

  outOfStockOverlayText: {
    color: "#fff",
    fontSize: 7,
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.2,
  },

  rowContent: {
    flex: 1,
    justifyContent: "center",
  },

  rowTitle: {
    fontSize: 12.5,
    fontFamily: "Poppins-Medium",
    color: "#0f172a",
    lineHeight: 16,
  },

  textMuted: {
    color: "#94a3b8",
  },

  rowBrand: {
    fontSize: 10.5,
    fontFamily: "Poppins-Medium",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginTop: 2,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
    marginTop: 4,
  },

  newPrice: {
    fontSize: 14.5,
    fontFamily: "Poppins-Medium",
    color: "#0f172a",
  },

  oldPrice: {
    fontSize: 10.5,
    color: "#cbd5e1",
    textDecorationLine: "line-through",
    marginBottom: 1,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },

  moveToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7c3aed",
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },

  moveToCartText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },

  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fee2e2",
    backgroundColor: "#fef2f2",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 5,
  },

  removeBtnText: {
    color: "#ef4444",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },

  outOfStockBadge: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
  },

  outOfStockBadgeText: {
    color: "#94a3b8",
    fontSize: 11.5,
    fontFamily: "Poppins-Medium",
  },

  qtyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#7c3aed",
    backgroundColor: "#fff",
    height: 36,
    paddingHorizontal: 4,
  },

  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    color: "#0f172a",
    textAlign: "center",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIconBox: {
    width: 78,
    height: 78,
    borderRadius: 100,
    backgroundColor: "#f3e8ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#0f172a",
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: 12.5,
    color: "#94a3b8",
    textAlign: "center",
  },
});