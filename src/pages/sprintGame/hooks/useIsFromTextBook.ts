import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectPath } from "../../../features/app/app";

export const useIsFromTextBook = () => {
  const [isFromTextbook, setIsFromTextbook] = useState(false);
  const path = useAppSelector(selectPath);

  useEffect(() => {
    setIsFromTextbook(path === '/textbook');
  }, []);
  
  return isFromTextbook
}