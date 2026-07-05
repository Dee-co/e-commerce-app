import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import {
  getProducts,
  getCategories,
  getProductsByCategory,
} from "../api/productApi";
import CategoryList from "../components/CategoryList";
import HomeHeader from "../components/HomeHeader";
import AppText from "../components/AppText";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const skeletonData = Array(10).fill(1);
  const flatListRef = useRef(null);
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);
  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(
        data.map((item) =>
          typeof item === "string" ? item : item.slug
        )
      );
    } catch (e) {
      console.log(e);
    }
  };
  const handleCategory = async (category) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    setSortOption(null);
    setIsCategoryLoading(true);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }

    try {
      if (category === "All") {
        const data = await getProducts();
        setProducts(data);
      } else {
        const data = await getProductsByCategory(category);
        setProducts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsCategoryLoading(false);
      }, 300);
    }
  };

  const sortProducts = (productsToSort) => {
    if (!sortOption) return productsToSort;

    const sorted = [...productsToSort];
    if (sortOption === 'low-to-high') {
      sorted.sort((a, b) => {
        const priceA = a.price - (a.price * a.discountPercentage) / 100;
        const priceB = b.price - (b.price * b.discountPercentage) / 100;
        return priceA - priceB;
      });
    } else if (sortOption === 'high-to-low') {
      sorted.sort((a, b) => {
        const priceA = a.price - (a.price * a.discountPercentage) / 100;
        const priceB = b.price - (b.price * b.discountPercentage) / 100;
        return priceB - priceA;
      });
    }
    return sorted;
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    return sortProducts(filtered);
  }, [products, search, sortOption]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSortPress = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSortSelect = (option) => {
    if (sortOption === option) {
      setSortOption(null);
    } else {
      setSortOption(option);
    }
    setShowSortOptions(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
        <FlatList
          data={skeletonData}
          numColumns={2}
          renderItem={() => <ProductSkeleton />}
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      <HomeHeader
        search={search}
        setSearch={setSearch}
        onSortPress={handleSortPress}
        showSortOptions={showSortOptions}
        sortOption={sortOption}
        onSortSelect={handleSortSelect}
      />
      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={handleCategory}
      />
      {isCategoryLoading ? (
        <FlatList
          data={skeletonData}
          numColumns={2}
          renderItem={() => <ProductSkeleton />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredAndSortedProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard item={item} />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <AppText style={{ color: '#94a3b8', fontSize: 16 }}>
                No products found
              </AppText>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Home;