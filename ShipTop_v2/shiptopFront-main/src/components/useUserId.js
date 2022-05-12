import { useState } from "react";

export default function useUserId() {
  const getUserId = () => {
    const userIdString = sessionStorage.getItem("UserId");
    const userId = userIdString;
    return userId;
  };

  const [userId, setUserId] = useState(getUserId());

  const saveUserId = (userId) => {
    sessionStorage.setItem("userId", userId);
    setUserId(userId);
  };

  return {
    setUserId: saveUserId,
    userId,
  };
}
