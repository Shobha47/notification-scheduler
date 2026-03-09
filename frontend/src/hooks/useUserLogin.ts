import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setToken, setUser } from "@/store/slice/authSlice";
import { userLogin } from "@/lib/api";

export const useUserLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: userLogin,
  
    onSuccess: (data) => {
      console.log("Login Successful:", data);

      // Save user + token to Redux
      dispatch(setUser(data));

      dispatch(setToken(data.token));

      // ✅ Save token for persistence (optional)
      sessionStorage.setItem("token", data.token);

      // 👉 Save token in cookies
      Cookies.set("token", data.token, {
        expires: 7, // cookie expiry 7 days
        secure: true, // only over HTTPS
        sameSite: "strict", // prevents CSRF
      });

      console.log("JWT stored in cookie:", Cookies.get("token"));

      console.log("Get User Data in Login and Saved in Redux:", data);

      // ✅ Role-based redirect logic
      if (data) {
        router.push("/dashboard");
      } 
    },
    onError: (error: any) => {
      console.error("Error logging in user:", error);
      console.log("error in login", error.message);
    },
  });
};

