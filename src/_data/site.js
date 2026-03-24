const PRODUCTION_URL = "https://begona-pereda.netlify.app";

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function normalizeAssetPath(value) {
  const normalized = normalizeUrl(value);

  if (!normalized || normalized === "/") {
    return "";
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

module.exports = function() {
  const deployUrl = normalizeUrl(process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL);

  return {
    name: "Begoña Pereda",
    url: deployUrl || PRODUCTION_URL,
    assetPath: normalizeAssetPath(process.env.ASSET_PATH),
    authorName: "Andy Clarke",
    authorEmail: "andy.clarke@stuffandnonsense.co.uk",
    telephone: "+44 (0)7515 395903",
    email: "bpdelval@gmail.com",
    siteID: "begona-pereda",
    copyrightOwner: "Begoña Pereda"
  };
};
