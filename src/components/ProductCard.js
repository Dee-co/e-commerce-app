import React, { useCallback, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Zap,
  Clock,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccess, showError, showInfo } from '../utils/toast';
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favouriteSlice';
import { useNavigation } from '@react-navigation/native';
import AppText from './AppText';
const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 20;
const CARD_HEIGHT = 328;
const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const quantity = useSelector(state => {
    const cartItem = state.cart.items.find(product => product.id === item.id);
    return cartItem?.quantity || 0;
  });
  const isWishlisted = useSelector(state =>
    state.favorite.items.some(product => product.id === item.id),
  );

  const discountedPrice = useMemo(() => {
    return (item.price - (item.price * item.discountPercentage) / 100).toFixed(
      2,
    );
  }, [item.price, item.discountPercentage]);
  const saveAmount = useMemo(() => {
    return (item.price - discountedPrice).toFixed(0);
  }, [item.price, discountedPrice]);
  const handleAddCart = useCallback(() => {
    if (item.stock === 0) {
      showError('Out of Stock', 'This product is currently unavailable.');
      return;
    }
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      }),
    );
  }, [dispatch, item]);
  const handleIncrease = useCallback(() => {
    if (quantity >= item.stock) {
      showInfo('Maximum Stock Reached', `Only ${item.stock} items available`);
      return;
    }
    dispatch(increaseQuantity(item.id));
  }, [dispatch, quantity, item.stock, item.id]);
  const handleDecrease = useCallback(() => {
    if (quantity > 0) {
      dispatch(decreaseQuantity(item.id));
    }
  }, [dispatch, quantity, item.id]);
  const handleWishlist = useCallback(() => {
    dispatch(toggleFavorite(item));
  }, [dispatch, item]);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate('ProductDetails', {
          product: item,
        })
      }
    >
      {/* Image + floating badges */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />

        {/* Discount Badge */}
        <View style={styles.discountBadge}>
          <Zap size={11} color="#fff" fill="#fff" />
          <AppText style={styles.discountText}>
            {Math.round(item.discountPercentage)}% OFF
          </AppText>
        </View>

        {/* Wishlist Button */}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={handleWishlist}
          activeOpacity={0.7}
        >
          <Heart
            size={16}
            color={isWishlisted ? '#ff4d6d' : '#94a3b8'}
            fill={isWishlisted ? '#ff4d6d' : 'transparent'}
          />
        </TouchableOpacity>

        {/* Rating Chip - overlapping bottom of image */}
        <View style={styles.ratingBox}>
          <Star size={10} color="#0f172a" fill="#ffb800" />
          <AppText style={styles.ratingText}>{item.rating}</AppText>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Brand and Category */}
        <View style={styles.brandContainer}>
          <AppText style={styles.brand} numberOfLines={1}>
            {item.brand}
          </AppText>
          <View style={styles.dot} />
          <AppText style={styles.category} numberOfLines={1}>
            {item.category}
          </AppText>
        </View>

        {/* Product Title */}
        <AppText numberOfLines={2} style={styles.title}>
          {item.title}
        </AppText>

        {/* Price Section */}
        <View style={styles.priceRow}>
          <AppText style={[styles.newPrice,{fontFamily: "Poppins-SemiBold"}]}>₹{discountedPrice}</AppText>
          <AppText style={styles.oldPrice}>₹{item.price}</AppText>
        </View>
        <View style={styles.saveBadge}>
          <AppText style={styles.saveText}>You save ₹{saveAmount}</AppText>
        </View>

        {/* Cart Action */}
        {quantity === 0 ? (
          <TouchableOpacity
            style={[styles.cartBtn, item.stock === 0 && styles.cartBtnDisabled]}
            onPress={handleAddCart}
            disabled={item.stock === 0}
            activeOpacity={0.85}
          >
            <ShoppingCart color="#fff" size={15} />
            <AppText style={styles.cartText}>
              {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </AppText>
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleDecrease}
              activeOpacity={0.7}
            >
              <Minus size={15} color="#7c3aed" />
            </TouchableOpacity>
            <AppText style={styles.qtyText}>{quantity}</AppText>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={handleIncrease}
              activeOpacity={0.7}
            >
              <Plus size={15} color="#7c3aed" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#ffffff',
    marginHorizontal: 8,
    marginVertical: 5,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#1e293b',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },

  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f4f6fb',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },

  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  discountText: {
    color: '#fff',
    fontSize: 10,
  fontFamily: "Poppins-Medium",
    letterSpacing: 0.3,
  },

  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 100,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  ratingBox: {
    position: 'absolute',
    bottom: -12,
    right: 14,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 100,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  ratingText: {
    color: '#0f172a',
  fontFamily: "Poppins-Medium",

    fontSize: 11,
  },

  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'flex-start',
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  brand: {
    color: '#7c3aed',
    fontSize: 10.5,
    fontFamily: "Poppins-Medium",
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },

  category: {
    color: '#94a3b8',
    fontSize: 10,
    textTransform: 'capitalize',
    flexShrink: 1,
  },

  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 11.5,
    color: '#0f172a',
    lineHeight: 17,
    height: 34,
    marginTop: 1,
    letterSpacing: 0.1,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginTop: 4,
  },

  newPrice: {
    fontSize: 15,
    color: '#0f172a',
    letterSpacing: -0.5,
  },

  oldPrice: {
    color: '#cbd5e1',
    textDecorationLine: 'line-through',
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginBottom: 1,
  },

  saveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },

  saveText: {
    color: '#059669',
    fontSize: 9.5,
    fontFamily: "Poppins-Medium",
  },

  stockContainer: {
    marginTop: 6,
  },

  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  stockDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
  },

  stock: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
  },

  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    gap: 2,
  },

  lowStockText: {
    color: '#ea580c',
    fontSize: 8,
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.5,
  },

  progressBar: {
    width: '100%',
    height: 2.5,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  cartBtn: {
    marginTop: 7,
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  cartBtnDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
  },

  cartText: {
    color: '#fff',
    paddingTop:3,
    fontFamily: "Poppins-Medium",
    fontSize: 12.5,
    letterSpacing: 0.2,
  },

  qtyContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    height: 38,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#7c3aed',
    paddingHorizontal: 3,
  },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#7c3aed',
    backgroundColor: '#fff',
  },

  qtyText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: '#0f172a',
    minWidth: 24,
    textAlign: 'center',
  },
});
