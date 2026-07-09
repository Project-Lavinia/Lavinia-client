#!/usr/bin/env node
// Downloads the pinned election-data bundle from the Lavinia-api GitHub release
// and extracts it to src/assets/election-data/.
//
// Run via: yarn download-data

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { Readable } = require("stream");
const { execSync } = require("child_process");

const { dataVersion } = require("../package.json");
const API_REPO = "Project-Lavinia/Lavinia-api";
const OUT_DIR = path.join(__dirname, "../src/assets/election-data");
const TMP_ZIP = "/tmp/lavinia-election-data.zip";

function computeSha256(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath);
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", reject);
    });
}

async function download(url, dest) {
    const res = await fetch(url, { headers: { "User-Agent": "lavinia-client" } });
    if (!res.ok) throw new Error(`Failed to download ${url}: HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), fs.createWriteStream(dest));
}

async function main() {
    if (!dataVersion) {
        console.error("Missing dataVersion in package.json");
        process.exit(1);
    }

    console.log(`Fetching release metadata for ${API_REPO}@${dataVersion}...`);
    const metaUrl = `https://api.github.com/repos/${API_REPO}/releases/tags/${dataVersion}`;
    const metaRes = await fetch(metaUrl, {
        headers: { "User-Agent": "lavinia-client", Accept: "application/vnd.github+json" },
    });

    if (!metaRes.ok) {
        console.error(`Release ${dataVersion} not found in ${API_REPO} (HTTP ${metaRes.status})`);
        process.exit(1);
    }

    const release = await metaRes.json();
    const asset = release.assets && release.assets.find((a) => a.name === "election-data.zip");
    if (!asset) {
        console.error(`election-data.zip asset missing from release ${dataVersion}`);
        process.exit(1);
    }

    const digest = asset.digest;
    if (!digest || !digest.startsWith("sha256:")) {
        console.error(`No SHA-256 digest on election-data.zip asset in release ${dataVersion}`);
        process.exit(1);
    }
    const expectedSha = digest.slice("sha256:".length);

    console.log(`Downloading ${asset.browser_download_url}...`);
    await download(asset.browser_download_url, TMP_ZIP);

    console.log("Verifying checksum...");
    const actualSha = await computeSha256(TMP_ZIP);
    if (actualSha !== expectedSha) {
        console.error(`Checksum mismatch: expected ${expectedSha}, got ${actualSha}`);
        process.exit(1);
    }
    console.log(`Checksum verified: ${actualSha}`);

    fs.rmSync(OUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(OUT_DIR, { recursive: true });
    execSync(`unzip -o ${TMP_ZIP} -d ${OUT_DIR}`, { stdio: "inherit" });
    fs.rmSync(TMP_ZIP, { force: true });

    const manifest = JSON.parse(fs.readFileSync(path.join(OUT_DIR, "manifest.json"), "utf8"));
    if (manifest.dataVersion !== dataVersion) {
        console.error(`Manifest version mismatch: expected ${dataVersion}, got ${manifest.dataVersion}`);
        process.exit(1);
    }

    console.log(`Election data ${manifest.dataVersion} extracted to ${OUT_DIR}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
