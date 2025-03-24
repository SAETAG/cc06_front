// lib/playfab.ts
import { PlayFabClient } from "playfab-sdk";

// PlayFab SDKの型定義
declare global {
  interface Window {
    PlayFabClientAPI: {
      LoginWithCustomID: (
        request: any,
        callback: (result: any, error: any) => void
      ) => void;
      UpdateUserTitleDisplayName: (
        request: { DisplayName: string },
        callback: (result: any, error: any) => void
      ) => void;
    };
  }
}

// PlayFab設定の型定義
interface IPlayFabSettings {
  titleId: string;
  developerSecretKey?: string;
  version?: string;
}

// ヘルパー: 入力をパースしてオブジェクトを返す
function parseResponse(input: any): any {
  // すでにオブジェクトならそのまま返す
  if (typeof input === "object") {
    // input が成功レスポンスの構造を持っているなら返す
    if ("code" in input && "status" in input && "data" in input) {
      return input;
    }
    // もし input.error があれば再帰的にパースする
    if (input.error) {
      return parseResponse(input.error);
    }
    return input;
  }
  // 文字列の場合は JSON パースを試みる
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      return parseResponse(parsed);
    } catch (err) {
      console.error("Failed to parse response string:", err);
      return null;
    }
  }
  return null;
}

// クライアント側の場合、PlayFab の設定を行う
if (typeof window !== "undefined") {
  const titleId = process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID;
  console.log("PlayFab TitleId from env:", titleId ? "***" : "undefined");
  PlayFabClient.settings.titleId = titleId || "";
  
  // SDKの設定状態を確認
  console.log("PlayFab SDK settings:", {
    titleId: "***", // セキュリティのためTitleIdは隠す
    isConfigured: !!PlayFabClient.settings.titleId,
    sdkVersion: (PlayFabClient.settings as IPlayFabSettings).version || "unknown"
  });
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

    // PlayFabの設定が正しく行われているか確認
    if (!PlayFabClient.settings.titleId) {
      console.error("PlayFab TitleId is not set. Current settings:", PlayFabClient.settings);
      return reject(new Error("PlayFabの設定が正しく行われていません"));
    }

    let customId = localStorage.getItem("playfabCustomId");
    if (!customId) {
      // より安定したID生成方法を使用
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 11);
      customId = `id_${timestamp}_${randomStr}`;
      localStorage.setItem("playfabCustomId", customId);
      console.log("Generated new CustomId:", customId);
    } else {
      console.log("Using existing CustomId:", customId);
    }

    const request = {
      TitleId: PlayFabClient.settings.titleId,
      CustomId: customId,
      CreateAccount: true, // アカウントがなければ新規作成する
    };

    console.log("Attempting PlayFab login with request:", {
      ...request,
      TitleId: "***" // セキュリティのためTitleIdは隠す
    });

    // リクエストの重複を防ぐためのフラグ
    let isRequestCompleted = false;
    // リクエスト開始時刻を記録
    const requestStartTime = Date.now();

    // コールバック関数
    const callback = (result: any, error: any) => {
      if (isRequestCompleted) {
        console.log("Skipping duplicate response");
        return;
      }
      const requestDuration = Date.now() - requestStartTime;

      // 空のオブジェクトの場合は error を null にする
      if (error && typeof error === "object" && Object.keys(error).length === 0) {
        error = null;
      }

      // まず result がある場合はそちらを優先する
      if (result && result.data) {
        console.log(`Request completed successfully in ${requestDuration}ms`);
        const { PlayFabId, SessionTicket, EntityToken } = result.data;
        if (!PlayFabId || !SessionTicket || !EntityToken) {
          console.error("Missing required data in result:", {
            hasPlayFabId: !!PlayFabId,
            hasSessionTicket: !!SessionTicket,
            hasEntityToken: !!EntityToken
          });
          isRequestCompleted = true;
          return reject(new Error("必要な情報が不足しています"));
        }
        console.log("PlayFab login successful:", {
          PlayFabId,
          SessionTicket: "***",
          EntityToken: "***",
          timestamp: new Date().toISOString()
        });
        isRequestCompleted = true;
        return resolve(result.data);
      }

      // result がない場合、error から成功レスポンスを試みる
      const parsed = parseResponse(error);
      if (parsed && parsed.code === 200 && parsed.status === "OK") {
        console.log(`Request completed successfully in ${requestDuration}ms (via parsed error)`);
        const { PlayFabId, SessionTicket, EntityToken } = parsed.data;
        if (!PlayFabId || !SessionTicket || !EntityToken) {
          console.error("Missing required data in parsed response:", {
            hasPlayFabId: !!PlayFabId,
            hasSessionTicket: !!SessionTicket,
            hasEntityToken: !!EntityToken
          });
          isRequestCompleted = true;
          return reject(new Error("必要な情報が不足しています"));
        }
        console.log("PlayFab login successful (via parsed error):", {
          PlayFabId,
          SessionTicket: "***",
          EntityToken: "***",
          timestamp: new Date().toISOString()
        });
        isRequestCompleted = true;
        return resolve(parsed.data);
      }

      // もし parsed で成功レスポンスが検出できなかった場合、エラーとして扱う
      if (error) {
        console.log(`Request failed after ${requestDuration}ms`);
        console.error("PlayFab login error details:", {
          error: JSON.stringify(error, null, 2),
          errorType: typeof error,
          errorKeys: error ? Object.keys(error) : [],
          errorString: String(error),
          request: {
            ...request,
            TitleId: "***"
          },
          timestamp: new Date().toISOString()
        });
        let errorMessage = "ログインに失敗しました";
        if (error.errorCode === 1001) {
          errorMessage = "アカウントが見つかりません";
        } else if (error.errorCode === 1002) {
          errorMessage = "アカウントの作成に失敗しました";
        } else if (error.errorMessage) {
          errorMessage = error.errorMessage;
        } else if (typeof error === "string") {
          errorMessage = error;
        }
        isRequestCompleted = true;
        return reject(new Error(errorMessage));
      }

      // どちらにも該当しない場合
      console.error("PlayFab login failed with no response", {
        timestamp: new Date().toISOString(),
        request: {
          ...request,
          TitleId: "***"
        }
      });
      isRequestCompleted = true;
      return reject(new Error("ログインに失敗しました"));
    };

    // PlayFab APIを呼び出す
    PlayFabClient.LoginWithCustomID(request, callback);
  });
}

/**
 * ユーザーの表示名を更新する
 */
export function updateUserTitleDisplayName(displayName: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("ブラウザ環境でのみ利用可能です"));
    }

    if (!PlayFabClient.settings.titleId) {
      return reject(new Error("PlayFabの設定が正しく行われていません"));
    }

    const request = {
      DisplayName: displayName
    };

    const callback = (result: any, error: any) => {
      // 空のオブジェクトの場合は error を null にする
      if (error && typeof error === "object" && Object.keys(error).length === 0) {
        error = null;
      }

      // まず result がある場合はそちらを優先する
      if (result && result.data) {
        console.log("表示名を更新しました:", result);
        return resolve(result.data);
      }

      // result がない場合、error から成功レスポンスを試みる
      const parsed = parseResponse(error);
      if (parsed && parsed.code === 200 && parsed.status === "OK") {
        console.log("表示名を更新しました (via parsed error):", parsed);
        return resolve(parsed.data);
      }

      // エラーがある場合
      if (error) {
        console.error("表示名の更新に失敗しました:", error);
        return reject(new Error("表示名の更新に失敗しました"));
      }

      // 成功とみなす（空のオブジェクトが返ってきた場合）
      console.log("表示名を更新しました");
      resolve({});
    };

    PlayFabClient.UpdateUserTitleDisplayName(request, callback);
  });
}
