// ConvertStatement — popup script
//
// Every control in the popup opens a ConvertStatement page in a new tab
// via chrome.tabs.create (which needs no "tabs" permission). Nothing else
// happens here: no tracking, no external requests, no storage.

document.addEventListener("DOMContentLoaded", () => {
  const openInNewTab = (url) => {
    if (url) {
      chrome.tabs.create({ url });
    }
    window.close();
  };

  document.querySelectorAll("[data-url]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      openInNewTab(el.getAttribute("data-url"));
    });
  });
});
