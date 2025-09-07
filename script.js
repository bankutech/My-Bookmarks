function injectScript() {

  let iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  let doc = iframe.contentDocument || iframe.contentWindow.document;

  let script = doc.createElement("script");
  script.textContent = "console.log('Script inside iframe running!');";

  doc.head.appendChild(script);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectScript);
} else {
  injectScript();
}
