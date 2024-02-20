import { useAuthContext } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";

const Index = () => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? (
    <Redirect href="/(tabs)/menu" />
  ) : (
    <Redirect href="/login" />
  );
};
export default Index;
