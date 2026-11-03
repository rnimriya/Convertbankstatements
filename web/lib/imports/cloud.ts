// Cloud import for the statement converter (Google Drive / Dropbox).
//
// Both flows end the same way: the picked PDF is downloaded IN THE BROWSER
// and handed to the normal upload pipeline, so billing, rate limits and
// extraction behave exactly like a device upload. Our server never fetches
// a user-supplied URL.
//
// The menu entries appear only when the matching keys are configured:
//   NEXT_PUBLIC_DROPBOX_APP_KEY   — Dropbox app key (Chooser enabled)
//   NEXT_PUBLIC_GOOGLE_API_KEY    — Google Cloud API key (Picker API)
//   NEXT_PUBLIC_GOOGLE_CLIENT_ID  — Google OAuth client ID (Drive readonly)
// Without keys the helpers throw "not configured"; the UI hides the entries.

export const DROPBOX_APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY ?? "";
export const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? "";
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export const DROPBOX_ENABLED = DROPBOX_APP_KEY.length > 0;
export const GOOGLE_ENABLED = GOOGLE_API_KEY.length > 0 && GOOGLE_CLIENT_ID.length > 0;

type SdkWindow = Window & {
  // Third-party picker SDKs are loaded on demand and ship no types here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Dropbox?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  google?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gapi?: any;
};

const scriptPromises = new Map<string, Promise<void>>();

function loadScript(id: string, src: string, attrs?: Record<string, string>): Promise<void> {
  const cached = scriptPromises.get(id);
  if (cached) return cached;
  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.id = id;
    el.src = src;
    el.async = true;
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    }
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("A required import script could not be loaded."));
    document.head.appendChild(el);
  });
  scriptPromises.set(id, promise);
  return promise;
}

/** Opens the Dropbox Chooser; resolves the picked PDF as a File, or null
 *  when the user cancels. Throws on real failures. */
export async function pickFromDropbox(extensions: string[] = [".pdf"]): Promise<File | null> {
  if (!DROPBOX_ENABLED) throw new Error("Dropbox import is not configured yet.");
  await loadScript("dropboxjs", "https://www.dropbox.com/static/api/2/dropins.js", {
    "data-app-key": DROPBOX_APP_KEY,
  });
  const w = window as SdkWindow;
  if (!w.Dropbox) throw new Error("Dropbox import could not be started.");

  return new Promise<File | null>((resolve, reject) => {
    let settled = false;
    w.Dropbox.choose({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      success: async (files: any[]) => {
        settled = true;
        try {
          const picked = files?.[0];
          if (!picked?.link) throw new Error("Dropbox did not return a file link.");
          const res = await fetch(picked.link);
          if (!res.ok) throw new Error("The file could not be downloaded from Dropbox.");
          const blob = await res.blob();
          resolve(new File([blob], picked.name || "statement.pdf", { type: "application/pdf" }));
        } catch (e) {
          reject(e instanceof Error ? e : new Error("The file could not be downloaded from Dropbox."));
        }
      },
      cancel: () => {
        if (!settled) resolve(null);
      },
      linkType: "direct",
      multiselect: false,
      ...(extensions.length > 0 ? { extensions } : {}),
    });
  });
}

/** Opens the Google Drive Picker (sign-in via Google Identity Services);
 *  resolves the picked PDF as a File, or null when the user cancels. */
export async function pickFromGoogleDrive(options?: { pdfOnly?: boolean }): Promise<File | null> {
  const pdfOnly = options?.pdfOnly !== false;
  if (!GOOGLE_ENABLED) throw new Error("Google Drive import is not configured yet.");
  await loadScript("gapi-js", "https://apis.google.com/js/api.js");
  await loadScript("gsi-client", "https://accounts.google.com/gsi/client");
  const w = window as SdkWindow;
  if (!w.google?.accounts?.oauth2 || !w.gapi) {
    throw new Error("Google Drive import could not be started.");
  }

  const accessToken: string = await new Promise((resolve, reject) => {
    const tokenClient = w.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (resp: any) => {
        if (resp?.error || !resp?.access_token) {
          reject(new Error("Google sign-in was not completed."));
        } else {
          resolve(resp.access_token as string);
        }
      },
    });
    tokenClient.requestAccessToken({ prompt: "" });
  });

  await new Promise<void>((resolve) => {
    w.gapi.load("picker", { callback: () => resolve() });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = await new Promise((resolve) => {
    const picker = new w.google.picker.PickerBuilder()
      .setDeveloperKey(GOOGLE_API_KEY)
      .setOAuthToken(accessToken)
      .addView(
        pdfOnly
          ? new w.google.picker.DocsView(w.google.picker.ViewId.DOCS).setMimeTypes("application/pdf")
          : new w.google.picker.DocsView(w.google.picker.ViewId.DOCS),
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .setCallback((data: any) => {
        if (data.action === w.google.picker.Action.PICKED) resolve(data.docs?.[0] ?? null);
        else if (data.action === w.google.picker.Action.CANCEL) resolve(null);
      })
      .build();
    picker.setVisible(true);
  });
  if (!doc) return null;

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${doc.id}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("The file could not be downloaded from Google Drive.");
  const blob = await res.blob();
  return new File([blob], doc.name || "statement.pdf", { type: "application/pdf" });
}
