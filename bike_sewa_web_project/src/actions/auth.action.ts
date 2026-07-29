import Cookies from "js-cookie";
import { registerApi, loginApi, RegisterPayload, LoginPayload } from "@/api/auth.api";

export interface ActionResult {
  success: boolean;
  message: string;
  data?: {
    fullName?: string;
    email?: string;
  };
}

export const registerAction = async (payload: RegisterPayload): Promise<ActionResult> => {
  try {
    const response = await registerApi(payload);
    return {
      success: true,
      message: response.message || "Registration successful!",
      data: { email: response.user?.email },
    };
  } catch (error: unknown) {
    let message = "Registration failed. Please try again.";
    if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>;
      if (err.response && typeof err.response === "object") {
        const response = err.response as Record<string, unknown>;
        if (response.data && typeof response.data === "object") {
          const data = response.data as Record<string, unknown>;
          if (typeof data.message === "string") {
            message = data.message;
          }
        }
      } else if (err.message && typeof err.message === "string") {
        message = err.message;
      }
    }
    return { success: false, message };
  }
};

export const loginAction = async (payload: LoginPayload): Promise<ActionResult> => {
  try {
    const response = await loginApi(payload);

    if (response.token) {
      // Store JWT token in cookie (expires in 7 days)
      Cookies.set("auth_token", response.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

// Store user info in cookie for quick access
      Cookies.set("user_info", JSON.stringify({
        fullName: response.user?.fullName,
        email: response.user?.email,
        role: response.user?.role,
        phone: response.user?.phone,
        avatar: response.user?.avatar,
      }), { expires: 7 });
    }

    return {
      success: true,
      message: response.message || "Login successful!",
      data: {
        fullName: response.user?.fullName,
        email: response.user?.email,
      },
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error
    ) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || "Invalid email or password.";
      return { success: false, message };
    }
    return { success: false, message: "Network error. Please check your connection." };
  }
};

export const logoutAction = () => {
  Cookies.remove("auth_token");
  Cookies.remove("user_info");
};
