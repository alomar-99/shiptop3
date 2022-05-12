import { useState } from "react";

export default function useUserType() {
  const getUserType = () => {
    const userTypeString = sessionStorage.getItem("UserType");
    const userType = userTypeString;
    return userType;
  };

  const [userType, setUserType] = useState(getUserType());

  const saveUserType = (userType) => {
    sessionStorage.setItem("UserType", userType);
    setUserType(userType);
  };

  return {
    setUserType: saveUserType,
    userType,
  };
}
