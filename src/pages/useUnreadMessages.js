import { useEffect, useState } from "react";

export default function useUnreadMessages() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // müvəqqəti nümunə, sonra Supabase-dən oxunacaq
    setCount(2);
  }, []);

  return count;
}