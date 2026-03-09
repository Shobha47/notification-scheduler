import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api";

export const useCreateUser = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: createUser,

    onSuccess: (data) => {
      console.log("User registered:", data);

      alert("User registered successfully");

      // redirect to login
      router.push("/signin");
    },

    onError: (error: any) => {
      console.error("Registration error:", error.message);
    },
  });
};