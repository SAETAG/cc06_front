// lib/playfab.ts
import { PlayFabClient } from "playfab-sdk";

// クライアント側の場合、PlayFab の設定を行う
if (typeof window !== "undefined") {
  PlayFabClient.settings.titleId = process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID || "";
}

/**
 * ローカルストレージからカスタムIDを取得、なければ新規生成して保存し、
 * PlayFab の LoginWithCustomID API を呼び出す。
 */
export function loginWithCustomID(): Promise<any> {
  return new Promise((resolve, reject) => {
    // ブラウザ環境でのみ localStorage を使用
    if (typeof window === "undefined") {
      return reject(new Error("localStorage is not available."));
    }

    let customId = localStorage.getItem("playfabCustomId");
    if (!customId) {
      // より安定したID生成方法を使用
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 11);
      customId = `id_${timestamp}_${randomStr}`;
      localStorage.setItem("playfabCustomId", customId);
    }

    const request = {
      TitleId: process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID!,
      CustomId: customId,
      CreateAccount: false, // 既存アカウントのみを使用
    };

    PlayFabClient.LoginWithCustomID(
      request,
      (result: any, error: any) => {
        if (error) {
          // アカウントが存在しない場合は新規作成を試みる
          if (error.error === "AccountNotFound") {
            const createRequest = {
              ...request,
              CreateAccount: true,
            };
            PlayFabClient.LoginWithCustomID(
              createRequest,
              (createResult: any, createError: any) => {
                if (createError) {
                  console.error("PlayFab account creation error:", createError);
                  reject(new Error(createError.errorMessage || "アカウントの作成に失敗しました"));
                } else if (createResult) {
                  console.log("PlayFab account created and logged in:", createResult);
                  resolve(createResult);
                } else {
                  console.error("PlayFab account creation failed with no response");
                  reject(new Error("アカウントの作成に失敗しました"));
                }
              }
            );
          } else {
            console.error("PlayFab login error:", error);
            reject(new Error(error.errorMessage || "ログインに失敗しました"));
          }
        } else if (result) {
          console.log("PlayFab login successful:", result);
          resolve(result);
        } else {
          console.error("PlayFab login failed with no response");
          reject(new Error("ログインに失敗しました"));
        }
      }
    );
  });
}
