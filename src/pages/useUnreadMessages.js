import { useState } from "react";

export default function useUnreadMessages() {
  // sonra Supabase-dən oxunacaq
  const [count] = useState(0);
  return count;
}