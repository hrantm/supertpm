import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "demo-video");
const SHOT_DIR = path.join(OUT_DIR, "shots");
const AUDIO_DIR = path.join(OUT_DIR, "audio");
const VIDEO_PATH = path.join(OUT_DIR, "signal-desk-demo.webm");
const SCRIPT_PATH = path.join(OUT_DIR, "narration-script.md");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const APP_URL = "http://localhost:3000";

const scenes = [
  {
    name: "intro",
    question: null,
    narration:
      "Signal Desk is a chat-first visibility assistant for managers. It answers natural questions by searching fake Slack, Jira, and Google Drive records that are indexed locally for this demo.",
  },
  {
    name: "growth-summary",
    question: "What is the Growth team working on?",
    narration:
      "First, we ask for a team-level summary. Signal Desk combines project briefs, Jira issues, and Slack updates to explain what the Growth team is doing across several active projects.",
  },
  {
    name: "stale-docs",
    question: "Which Drive docs look stale compared with Slack or Jira?",
    narration:
      "Next, we check for stale documentation. The assistant compares older Google Drive plans with newer Slack and Jira evidence, then calls out which docs may no longer reflect reality.",
  },
  {
    name: "billing-blockers",
    question: "What blockers are slowing down the billing migration?",
    narration:
      "Here, the manager asks about a specific project risk. The answer pulls together Slack discussion, Jira blocker tracking, and Drive status notes into one concise explanation.",
  },
  {
    name: "overloaded",
    question: "Who looks overloaded?",
    narration:
      "Signal Desk can also surface people-level signals. In this example, it finds that Mina appears overloaded because multiple sources mention her carrying several manager-visible workstreams.",
  },
  {
    name: "one-on-one",
    question: "What should I ask Taylor in our 1:1?",
    narration:
      "Finally, the assistant turns source evidence into a manager workflow. It prepares useful one-on-one questions based on blockers, ownership, and decisions already captured in the work systems.",
  },
];

function readShellValue(fileText, key) {
  const pattern = new RegExp(`^\\s*(?:export\\s+)?${key}=(.+?)\\s*$`, "m");
  const match = fileText.match(pattern);
  return match ? match[1].trim().replace(/^['"]|['"]$/g, "") : "";
}

async function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  try {
    const text = await fs.readFile(envPath, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const [key, ...rest] = line.split("=");
      process.env[key.trim()] ||= rest.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  } catch {}

  if (!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY_SOURCE) {
    const source = process.env.OPENAI_API_KEY_SOURCE.replace(/^~(?=\/)/, process.env.HOME);
    const text = await fs.readFile(source, "utf8");
    process.env.OPENAI_API_KEY = readShellValue(text, process.env.OPENAI_API_KEY_NAME || "OPENAI_API_KEY");
  }
}

async function ensureApp() {
  const response = await fetch(`${APP_URL}/api/health`);
  if (!response.ok) throw new Error(`Local app is not healthy at ${APP_URL}`);
}

async function generateSpeech(text, outputPath) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text,
      instructions: "Speak clearly and confidently like a product demo narrator. Keep a steady pace.",
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI TTS failed: ${error.slice(0, 400)}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, buffer);
}

async function captureScenes(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(SHOT_DIR, "intro.png"), fullPage: false });

  for (const scene of scenes.filter((item) => item.question)) {
    await page.locator("#question").fill(scene.question);
    const responsePromise = page.waitForResponse((response) => response.url().includes("/api/chat") && response.request().method() === "POST", {
      timeout: 90000,
    });
    await page.locator("#composer button").click();
    await responsePromise;
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(SHOT_DIR, `${scene.name}.png`), fullPage: false });
  }
}

async function composeVideo(page) {
  const payload = [];
  for (const scene of scenes) {
    const image = await fs.readFile(path.join(SHOT_DIR, `${scene.name}.png`));
    const audio = await fs.readFile(path.join(AUDIO_DIR, `${scene.name}.mp3`));
    payload.push({
      imageDataUrl: `data:image/png;base64,${image.toString("base64")}`,
      audioDataUrl: `data:audio/mpeg;base64,${audio.toString("base64")}`,
      caption: scene.narration,
    });
  }

  await page.setContent("<html><body style='margin:0;background:#fff'><canvas id='c' width='1440' height='900'></canvas></body></html>");
  const videoBuffer = await page.evaluate(async (items) => {
    const canvas = document.querySelector("#c");
    const ctx = canvas.getContext("2d");
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();
    const canvasStream = canvas.captureStream(30);
    const stream = new MediaStream([...canvasStream.getVideoTracks(), ...destination.stream.getAudioTracks()]);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
    const chunks = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });

    function drawScene(image, caption) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const gradient = ctx.createLinearGradient(0, canvas.height - 230, 0, canvas.height);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(0.35, "rgba(255,255,255,0.92)");
      gradient.addColorStop(1, "rgba(255,255,255,0.98)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 230, canvas.width, 230);
      ctx.fillStyle = "#111";
      ctx.font = "600 28px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
      const words = caption.split(" ");
      const lines = [];
      let line = "";
      for (const word of words) {
        const test = `${line} ${word}`.trim();
        if (ctx.measureText(test).width > 1120 && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      lines.slice(0, 3).forEach((text, index) => ctx.fillText(text, 120, canvas.height - 120 + index * 38));
    }

    recorder.start(250);
    for (const item of items) {
      const [image, audioBytes] = await Promise.all([
        loadImage(item.imageDataUrl),
        fetch(item.audioDataUrl).then((response) => response.arrayBuffer()),
      ]);
      const audioBuffer = await audioContext.decodeAudioData(audioBytes);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(destination);
      source.start();
      const start = performance.now();
      while (performance.now() - start < (audioBuffer.duration + 0.7) * 1000) {
        drawScene(image, item.caption);
        await sleep(33);
      }
    }
    recorder.stop();
    await new Promise((resolve) => (recorder.onstop = resolve));
    const blob = new Blob(chunks, { type: "video/webm" });
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  }, payload);

  await fs.writeFile(VIDEO_PATH, Buffer.from(videoBuffer));
}

async function main() {
  await loadEnv();
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY could not be loaded");
  await ensureApp();
  await fs.mkdir(SHOT_DIR, { recursive: true });
  await fs.mkdir(AUDIO_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const page = await browser.newPage();

  await captureScenes(page);
  for (const scene of scenes) {
    await generateSpeech(scene.narration, path.join(AUDIO_DIR, `${scene.name}.mp3`));
  }
  await composeVideo(page);
  await browser.close();

  const script = scenes.map((scene, index) => `## Scene ${index + 1}: ${scene.name}\n\n${scene.question ? `Question: ${scene.question}\n\n` : ""}${scene.narration}`).join("\n\n");
  await fs.writeFile(SCRIPT_PATH, `# Signal Desk Demo Narration\n\n${script}\n`);
  console.log(`Wrote ${VIDEO_PATH}`);
  console.log(`Wrote ${SCRIPT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
