# ConvertStatement — Chrome Extension

A Manifest V3 companion extension for
[ConvertStatement](https://www.convertstatement.online/) — the bank
statement PDF → Excel / CSV / OFX / QuickBooks (QBO) converter.

The extension is deliberately simple and honest: it is a branded shortcut
to the website. All conversion happens on convertstatement.online. The
extension itself uploads nothing, collects no data, sets no cookies, and
makes no network requests of its own.

## What's inside

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 definition (name, version, icons, popup, permissions, service worker) |
| `popup.html` / `popup.css` / `popup.js` | The toolbar popup (~360 px wide): logo header, short description, and buttons that open ConvertStatement pages in a new tab |
| `background.js` | Service worker. Registers the right-click menu on PDF links and PDF pages (see below) |
| `icons/icon16.png`, `icon32.png`, `icon48.png`, `icon128.png` | Extension icons, generated from the site's `logo.svg` |
| `logo.svg` | The ConvertStatement logo, shown in the popup header |
| `fonts/manrope.woff2` | Manrope, the site's brand font, bundled locally (no web-font requests) |

### Popup buttons

- **Convert a statement** → https://www.convertstatement.online/
- **QuickBooks tools** → https://www.convertstatement.online/tools
- **Bulk tools — free** → https://www.convertstatement.online/tools/bulk-import-quickbooks
- **Pricing** (footer) → https://www.convertstatement.online/pricing

All four open via `chrome.tabs.create`, which needs no `tabs` permission.

### Right-click menu (context menu)

Right-clicking a link to a `.pdf` file — or a page that is itself a PDF —
shows **“Convert this statement with ConvertStatement”**. Clicking it opens
https://www.convertstatement.online/ in a new tab, where you drop the PDF
to convert it.

The menu does **not** download, read, or auto-upload the PDF. That is a
technical limit of a plain shortcut extension, and the extension does not
claim otherwise.

### Permissions

Only one permission is requested:

- `contextMenus` — required to add the right-click menu described above.

No `tabs`, `storage`, `history`, host permissions, or content scripts are
used. The popup talks to no server and includes no analytics or tracking.

## Load it unpacked (for testing)

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (toggle, top right).
3. Click **Load unpacked**.
4. Select this `extension/` folder (the folder containing `manifest.json`).
5. The ConvertStatement icon appears in the toolbar — pin it, click it to
   open the popup, and right-click any PDF link on the web to see the
   context-menu entry.

## Chrome Web Store publish checklist

> **Nothing has been submitted.** Publishing requires the site owner's own
> Chrome Web Store developer account. The one-time developer registration
> fee (currently US $5) is payable by the owner — it cannot be paid from
> this package.

1. **Developer account** — Owner signs in at the
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   with their Google account and pays the one-time $5 registration fee.
2. **Package** — Upload `convertstatement-chrome-extension.zip`
   (manifest.json at the zip root — already the case for the packaged zip).
3. **Store listing fields**
   - Name: `ConvertStatement — Bank Statement Converter` (from the manifest)
   - Summary / description: use the manifest description
     (“Convert bank statement PDFs to Excel, CSV or QuickBooks (QBO).
     First 8 pages free.”) and expand it honestly on the listing page —
     the extension is a shortcut to the website; conversion happens on the
     site, and the first 8 pages are free there.
   - Category: Productivity (or Finance)
   - Language: English
   - Icon: the 128 px icon is already in the package.
4. **Screenshots** — At least one screenshot, **1280×800** (or 640×400).
   Capture the popup open over https://www.convertstatement.online/ and,
   optionally, the right-click menu on a PDF link. Screenshots are not
   included in this package and must be captured by the owner/reviewer.
5. **Privacy declarations** — In the dashboard's Privacy tab:
   - Single purpose: “Provides shortcuts to ConvertStatement and a
     right-click menu item on PDF links that opens the site.”
   - Permission justification: `contextMenus` is used only to show that
     menu item on PDF links/pages.
   - Data use: the extension collects **no** user data, reads no page
     content, and makes no remote requests — declare accordingly and link
     the site's privacy policy if the form asks for one.
6. **Review expectations** — New extensions go through Google's review,
   which typically takes from a few days up to a few weeks. Minimal
   permissions and no remote code keep this in the fastest review class,
   but timelines are Google's, not guaranteed. If review asks about the
   context menu, the answer is the honest one above: it opens the site;
   it does not fetch or upload the PDF.
7. **After approval** — Note the published extension ID, and link the
   store listing from convertstatement.online (a separate web-app change,
   not part of this package).

## Version

1.0.0 — initial release.
