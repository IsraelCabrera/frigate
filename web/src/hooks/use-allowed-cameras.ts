import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import useSWR from "swr";
import { SecurityConfig } from "@/types/securityConfig";

export function useAllowedCameras() {
  const { auth } = useContext(AuthContext);
  const { data: config } = useSWR<SecurityConfig>("config", {
    revalidateOnFocus: false,
  });

  if (
    auth.user?.role === "viewer" ||
    auth.user?.role === "admin" ||
    !auth.isAuthenticated // anonymous port 5000
  ) {
    // return all cameras
    return config?.cameras ? Object.keys(config.cameras) : [];
  }

  return auth.allowedCameras || [];
}
