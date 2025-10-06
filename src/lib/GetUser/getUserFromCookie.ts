// lib/getUserFromCookie.ts
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { TUser } from "@/types/auth.types";

export async function getUserFromCookie(): Promise<TUser | null> {
  try {
    const cookiesPromise = cookies();
    const cookiesObject = await cookiesPromise;
    const token = cookiesObject.get("accessToken")?.value;
    if (!token) return null;
    return jwtDecode<TUser>(token);
  } catch {
    return null;
  }
}
