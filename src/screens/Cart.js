import React, { useCallback } from 'react';
import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../store/slices/cartSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../components/AppText';

const CartItemRow = ({ item }) => {
  const dispatch = useDispatch();

  const discountedPrice = (
    item.price -
    (item.price * item.discountPercentage) / 100
  ).toFixed(2);

  const handleIncrease = useCallback(() => {
    if (item.quantity >= item.stock) {
      Alert.alert(
        'Maximum Limit',
        `Only ${item.stock} items available in stock`,
      );
      return;
    }
    dispatch(increaseQuantity(item.id));
  }, [dispatch, item.quantity, item.stock, item.id]);

  const handleDecrease = useCallback(() => {
    dispatch(decreaseQuantity(item.id));
  }, [dispatch, item.id]);

  const handleRemove = useCallback(() => {
    dispatch(removeFromCart(item.id));
  }, [dispatch, item.id]);

  return (
    <View style={styles.row}>
      <View style={styles.imageBox}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <AppText numberOfLines={2} style={styles.rowTitle}>
            {item.title}
          </AppText>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={handleRemove}
            activeOpacity={0.7}
          >
            <Trash2 size={15} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <AppText style={styles.rowBrand}>{item.brand}</AppText>

        <View style={styles.rowBottom}>
          <View style={styles.priceRow}>
            <AppText style={styles.newPrice}>₹{discountedPrice}</AppText>
            <AppText style={styles.oldPrice}>₹{item.price}</AppText>
          </View>

          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleDecrease}
              activeOpacity={0.7}
            >
              <Minus size={13} color="#7c3aed" />
            </TouchableOpacity>
            <AppText style={styles.qtyText}>{item.quantity}</AppText>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleIncrease}
              activeOpacity={0.7}
            >
              <Plus size={13} color="#7c3aed" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const EmptyCart = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconBox}>
      <ShoppingBag size={34} color="#7c3aed" />
    </View>
    <AppText style={styles.emptyTitle}>Your cart is empty</AppText>
    <AppText style={styles.emptySubtitle}>
      Looks like you haven't added anything yet
    </AppText>
  </View>
);

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalAmount } = useSelector(state => state.cart);

  const handleClearCart = useCallback(() => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => dispatch(clearCart()),
      },
    ]);
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    Alert.alert('Checkout', 'Proceeding to checkout...');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>My Cart</AppText>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} activeOpacity={0.7}>
            <AppText style={styles.clearText}>Clear All</AppText>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <CartItemRow item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary Footer */}
          <View style={styles.footer}>
            <View style={styles.summaryRow}>
              <AppText style={styles.summaryLabel}>
                Total Items ({totalItems})
              </AppText>
              <AppText style={styles.summaryValue}>
                ₹{totalAmount.toFixed(2)}
              </AppText>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <AppText style={styles.checkoutText}>
                Checkout · ₹{totalAmount.toFixed(2)}
              </AppText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#0f172a',
    letterSpacing: 0.1,
  },

  clearText: {
    fontSize: 12.5,
    fontFamily: 'Poppins-Medium',
    color: '#ef4444',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },

  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  imageBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#f4f6fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  image: {
    width: '78%',
    height: '78%',
    resizeMode: 'contain',
  },

  rowContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  rowTitle: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: 'Poppins-Medium',
    color: '#0f172a',
    lineHeight: 16,
  },

  removeBtn: {
    padding: 2,
  },

  rowBrand: {
    fontSize: 10.5,
    fontFamily: 'Poppins-Medium',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 1,
  },

  rowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
  },

  newPrice: {
    fontSize: 14.5,
    fontFamily: 'Poppins-Medium',
    color: '#0f172a',
  },

  oldPrice: {
    fontSize: 10.5,
    color: '#cbd5e1',
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#7c3aed',
    backgroundColor: '#fff',
    paddingHorizontal: 3,
    height: 30,
  },

  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyText: {
    fontSize: 12.5,
    fontFamily: 'Poppins-Medium',
    color: '#0f172a',
    minWidth: 20,
    textAlign: 'center',
  },

  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  summaryLabel: {
    fontSize: 12.5,
    fontFamily: 'Poppins-Medium',
    color: '#64748b',
  },

  summaryValue: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#0f172a',
  },

  checkoutBtn: {
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  checkoutText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    letterSpacing: 0.2,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIconBox: {
    width: 78,
    height: 78,
    borderRadius: 100,
    backgroundColor: '#f3e8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#0f172a',
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: 12.5,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
