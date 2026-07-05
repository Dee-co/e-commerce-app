import React from "react";
import { Text } from "react-native";
const AppText = ({ style, ...props }) => {
  return (
    <Text
      style={[
        {
          fontFamily: "Poppins-Regular",
        },
        style,
      ]}
      {...props}
    />
  );
};

export default AppText;