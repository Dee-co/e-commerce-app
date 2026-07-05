import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { showSuccess, showError, showInfo } from '../utils/toast';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  Heart,
  Star,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Shield,
  RotateCcw,
  Clock,
  Truck,
  ArrowLeft,
  Zap,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
} from '../store/slices/cartSlice';
import AppText from '../components/AppText';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [readMore, setReadMore] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { product } = route.params;

  const quantity = useSelector(state => {
    const cartItem = state.cart.items.find(item => item.id === product.id);
    return cartItem?.quantity || 0;
  });

  const discountedPrice = useMemo(() => {
    return (
      product.price -
      (product.price * product.discountPercentage) / 100
    ).toFixed(2);
  }, [product]);

  // Check if description is long enough to need truncation
  const isDescriptionLong = useMemo(() => {
    return product.description && product.description.length > 150;
  }, [product.description]);

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showError('Product is out of stock');
      return;
    }

    if (quantity === 0 && product.minimumOrderQuantity > 1) {
      showInfo(
        `${product.minimumOrderQuantity} items added (Minimum order quantity)`,
      );
    }

    dispatch(
      addToCart({
        ...product,
        quantity: product.minimumOrderQuantity || 1,
      }),
    );
  };

  const handleIncrease = () => {
    if (quantity >= product.stock) {
      showInfo(`Only ${product.stock} items available in stock`);
      return;
    }
    dispatch(increaseQuantity(product.id));
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      dispatch(decreaseQuantity(product.id));
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    showSuccess(isWishlisted ? 'Removed from Favorites' : 'Added to Favorites');
  };

  const renderReview = ({ item, index }) => (
    <View style={styles.reviewItem} key={index}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerAvatar}>
            <AppText style={styles.reviewerInitial}>
              {item.reviewerName?.charAt(0) || 'U'}
            </AppText>
          </View>
          <View>
            <AppText style={styles.reviewerName}>
              {item.reviewerName || 'Anonymous'}
            </AppText>
            <AppText style={styles.reviewDate}>{item.date || 'Recent'}</AppText>
          </View>
        </View>
        <View style={styles.reviewRating}>
          <Star size={14} fill="#FACC15" color="#FACC15" />
          <AppText style={styles.reviewRatingText}>{item.rating || 4}</AppText>
        </View>
      </View>
      <AppText style={styles.reviewComment}>
        {item.comment || 'Great product!'}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Product Details</AppText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FlatList
          data={product.images || [product.thumbnail]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          )}
        />

        <View style={styles.discountBadge}>
          <Zap size={14} color="#fff" />
          <AppText style={styles.discountText}>
            {Math.round(product.discountPercentage)}% OFF
          </AppText>
        </View>

        <TouchableOpacity style={styles.heartBtn} onPress={handleWishlist}>
          <Heart
            color="#EF4444"
            size={22}
            fill={isWishlisted ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <AppText style={styles.brand}>{product.brand}</AppText>
          <AppText style={styles.title}>{product.title}</AppText>

          <View style={styles.ratingRow}>
            <Star size={16} fill="#FACC15" color="#FACC15" />
            <AppText style={styles.rating}>{product.rating}</AppText>
            <AppText style={styles.reviewCount}>
              ({product.reviews?.length || 0} Reviews)
            </AppText>
          </View>

          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <View>
                <AppText style={styles.price}>₹{discountedPrice}</AppText>
                <View style={styles.priceSubRow}>
                  <AppText style={styles.oldPrice}>₹{product.price}</AppText>
                  <View style={styles.saveBadge}>
                    <AppText style={styles.saveText}>
                      Save ₹{(product.price - discountedPrice).toFixed(0)}
                    </AppText>
                  </View>
                </View>
              </View>

              {quantity === 0 ? (
                <TouchableOpacity
                  style={[
                    styles.smallCartBtn,
                    product.stock === 0 && styles.cartBtnDisabled,
                  ]}
                  onPress={handleAddToCart}
                  disabled={product.stock === 0}
                  activeOpacity={0.8}
                >
                  <ShoppingCart color="#fff" size={18} />
                </TouchableOpacity>
              ) : (
                <View style={styles.smallQtyContainer}>
                  <TouchableOpacity
                    style={styles.smallQtyBtn}
                    onPress={handleDecrease}
                    activeOpacity={0.7}
                  >
                    <AppText style={styles.smallQtyBtnText}>-</AppText>
                  </TouchableOpacity>
                  <AppText style={styles.smallQtyText}>{quantity}</AppText>
                  <TouchableOpacity
                    style={styles.smallQtyBtn}
                    onPress={handleIncrease}
                    activeOpacity={0.7}
                  >
                    <AppText style={styles.smallQtyBtnText}>+</AppText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <AppText
            style={[
              styles.stock,
              {
                color: product.stock > 0 ? '#16A34A' : '#DC2626',
              },
            ]}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </AppText>

          <AppText style={styles.moq}>
            Minimum Order Quantity: {product.minimumOrderQuantity}
          </AppText>

          <View style={styles.infoCards}>
            <View style={styles.infoCard}>
              <Shield size={18} color="#7c3aed" />
              <AppText style={styles.infoCardText}>
                {product.warrantyInformation || '1 Year Warranty'}
              </AppText>
            </View>
            <View style={styles.infoCard}>
              <RotateCcw size={18} color="#7c3aed" />
              <AppText style={styles.infoCardText}>
                {product.returnPolicy || '30 Days Return'}
              </AppText>
            </View>
          </View>

          <View style={styles.shippingInfo}>
            <View style={styles.shippingItem}>
              <Truck size={15} color="#64748b" />
              <AppText style={styles.shippingText}>Free Shipping</AppText>
            </View>
            <View style={styles.shippingItem}>
              <Clock size={15} color="#64748b" />
              <AppText style={styles.shippingText}>Delivery in 3-5 days</AppText>
            </View>
          </View>

          {/* Description Section */}
          <AppText style={styles.sectionTitle}>Description</AppText>
          <AppText numberOfLines={readMore ? 0 : 3} style={styles.description}>
            {product.description}
          </AppText>

          {/* Only show Read More button if description is long */}
          {isDescriptionLong && (
            <TouchableOpacity onPress={() => setReadMore(!readMore)}>
              <View style={styles.readMoreRow}>
                <AppText style={styles.readMore}>
                  {readMore ? 'Read Less' : 'Read More'}
                </AppText>
                {readMore ? (
                  <ChevronUp size={18} color="#7c3aed" />
                ) : (
                  <ChevronDown size={18} color="#7c3aed" />
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Reviews Section */}
          <AppText style={styles.sectionTitle}>Customer Reviews</AppText>
          {product.reviews && product.reviews.length > 0 ? (
            <FlatList
              data={product.reviews}
              renderItem={renderReview}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.reviewsList}
            />
          ) : (
            <View style={styles.noReviews}>
              <AppText style={styles.noReviewsText}>No reviews yet</AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.3,
  },

  headerRight: {
    width: 40,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  imageContainer: {
    width,
    height: 300,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },

  discountBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  discountText: {
    color: '#fff',
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    letterSpacing: 0.3,
  },

  heartBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.95)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  content: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 30,
  },

  brand: {
    color: '#7c3aed',
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 20,
    fontFamily: "Poppins-Medium",
    color: '#111827',
    marginTop: 4,
    lineHeight: 26,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  rating: {
    marginLeft: 4,
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: '#111827',
  },

  reviewCount: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 12,
  },

  priceSection: {
    marginTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },

  price: {
    fontSize: 26,
    color: '#7c3aed',
    fontFamily: "Poppins-Medium",
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
    fontSize: 15,
  },

  saveBadge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  saveText: {
    color: '#7c3aed',
    fontSize: 10,
    fontFamily: "Poppins-Medium",
  },

  smallCartBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },

  smallQtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    overflow: 'hidden',
    height: 44,
  },

  smallQtyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  smallQtyBtnText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: '#fff',
  },

  smallQtyText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: '#fff',
    minWidth: 30,
    textAlign: 'center',
  },

  stock: {
    marginTop: 10,
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },

  moq: {
    marginTop: 4,
    color: '#374151',
    fontWeight: '600',
    fontSize: 12,
  },

  infoCards: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  infoCardText: {
    color: '#1e293b',
    fontSize: 11,
    fontFamily: "Poppins-Medium",
    flex: 1,
  },

  shippingInfo: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  shippingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  shippingText: {
    color: '#64748b',
    fontSize: 11,
    fontFamily: "Poppins-Medium",
  },

  sectionTitle: {
    marginTop: 20,
    fontFamily: "Poppins-Medium",
    fontSize: 17,
    color: '#111827',
  },

  description: {
    marginTop: 8,
    color: '#4B5563',
    lineHeight: 22,
    fontSize: 14,
  },

  readMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  readMore: {
    color: '#7c3aed',
    fontFamily: "Poppins-Medium",
    marginRight: 4,
    fontSize: 13,
  },

  reviewsList: {
    marginTop: 10,
  },

  reviewItem: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  reviewerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },

  reviewerInitial: {
    color: '#fff',
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },

  reviewerName: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 12,
  },

  reviewDate: {
    color: '#94a3b8',
    fontSize: 10,
  },

  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  reviewRatingText: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: 12,
  },

  reviewComment: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },

  noReviews: {
    padding: 16,
    alignItems: 'center',
  },

  noReviewsText: {
    color: '#94a3b8',
    fontSize: 13,
  },

  addToCartBtn: {
    marginTop: 20,
    backgroundColor: '#7c3aed',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  cartBtnDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
  },

  addToCartText: {
    color: '#fff',
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  qtyContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    height: 56,
  },

  qtyBtn: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  qtyBtnLeft: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },

  qtyBtnRight: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.1)',
  },

  qtyBtnText: {
    fontSize: 22,
    fontFamily: "Poppins-Medium",
    color: '#fff',
  },

  qtyText: {
    fontSize: 20,
    fontFamily: "Poppins-Medium",
    color: '#fff',
    minWidth: 40,
    textAlign: 'center',
    flex: 0.5,
  },
});
