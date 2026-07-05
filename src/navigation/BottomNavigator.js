import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { House, ShoppingCart, Heart } from "lucide-react-native";
import { useSelector } from "react-redux";
import Home from "../screens/Home";
import Cart from "../screens/Cart";
import Favourite from "../screens/Favourite";
import AppText from "../components/AppText";

const Tab = createBottomTabNavigator();

const ICONS = {
  Home: House,
  Cart: ShoppingCart,
  Favourite: Heart,
};

const TabIcon = ({ routeName, color, focused }) => {
  const cartCount = useSelector((state) => state.cart.totalItems);
  const favoriteCount = useSelector((state) => state.favorite.items.length);

  const Icon = ICONS[routeName];

  const badgeCount =
    routeName === "Cart" ? cartCount : routeName === "Favourite" ? favoriteCount : 0;

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Icon
        color={focused ? "#fff" : color}
        size={20}
        fill={focused && routeName === "Favourite" ? "#fff" : "transparent"}
      />

      {badgeCount > 0 && (
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </AppText>
        </View>
      )}
    </View>
  );
};

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#7c3aed",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, focused }) => (
          <TabIcon routeName={route.name} color={color} focused={focused} />
        ),
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: "transparent", borderless: true }}
            style={props.style}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Favourite" component={Favourite} />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: 64,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    elevation: 8,
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingHorizontal: 6,
  },

  tabItem: {
    paddingTop: 2,
    paddingBottom: 2,
  },

  label: {
    fontSize: 10.5,
    fontFamily: "Poppins-Medium",
    marginTop: 2,
  },

  iconWrap: {
    width: 38,
    height: 30,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrapActive: {
    backgroundColor: "#7c3aed",
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  badgeText: {
    color: "#fff",
    fontSize: 8.5,
    fontFamily: "Poppins-Medium",
  },
});