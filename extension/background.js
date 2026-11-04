// ConvertStatement — background service worker (Manifest V3)
//
// Its only job is the right-click menu on PDF links / PDF pages.
// Honest scope: the menu opens ConvertStatement in a new tab. It does NOT
// download, read, or upload the PDF — the user drops the file on the site
// themselves. No data is collected and no network requests are made here.

const SITE_URL = "https://www.convertstatement.online/";

const PDF_PATTERNS = [
  "*://*/*.pdf",
  "*://*/*.pdf?*",
  "*://*/*.PDF",
  "*://*/*.PDF?*",
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertstatement-pdf-link",
    title: "Convert this statement with ConvertStatement",
    contexts: ["link"],
    targetUrlPatterns: PDF_PATTERNS,
  });

  chrome.contextMenus.create({
    id: "convertstatement-pdf-page",
    title: "Convert this statement with ConvertStatement",
    contexts: ["page"],
    documentUrlPatterns: PDF_PATTERNS,
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (
    info.menuItemId === "convertstatement-pdf-link" ||
    info.menuItemId === "convertstatement-pdf-page"
  ) {
    chrome.tabs.create({ url: SITE_URL });
  }
});
