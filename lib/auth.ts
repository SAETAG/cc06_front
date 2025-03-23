// lib/auth.ts
import { loginWithCustomID } from "./playfab";

export async function silentLogin(): Promise<any> {
  // PlayFab のサイレントログイン（CustomID を使ったログイン）を実行
  return loginWithCustomID();
}
