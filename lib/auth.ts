// lib/auth.ts
import { loginWithCustomID } from "./playfab";

interface LoginResult {
  newlyCreated: boolean;
  userId: string;
}

export async function silentLogin(): Promise<LoginResult> {
  // PlayFab のサイレントログイン（CustomID を使ったログイン）を実行
  const result = await loginWithCustomID();
  return {
    newlyCreated: result.NewlyCreated || false,
    userId: result.PlayFabId
  };
}
