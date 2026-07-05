import Toast from "react-native-toast-message";

const showToast = (type, message) => {
  Toast.show({
    type,
    text1: message,
    position: "bottom",
    bottomOffset: 80,
    visibilityTime: 1800,
  });
};

export const showSuccess = (message) => {
  showToast("customToast", message);
};

export const showError = (message) => {
  showToast("customToast", message);
};

export const showInfo = (message) => {
  showToast("customToast", message);
};