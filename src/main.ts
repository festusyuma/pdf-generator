import { EventBody, EventData, LambdaEvent } from "./utils";
import puppeteer, { Browser, executablePath } from "puppeteer";
import { generatePdf } from "./genrate-pdf";

let browser: Browser;

export async function handler(event: LambdaEvent) {
  console.log("event :: ", event);

  if (!browser) {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--disable-dev-shm-usage",
        "--no-sandbox",
        "--headless",
        "--single-process",
      ],
      executablePath: executablePath(),
      timeout: 0,
    });
  }

  console.log("initialized browser");

  if ("Records" in event) {
    for (const record of event.Records) {
      const eventData = JSON.parse(record.body) as EventBody;
      await generatePdf(browser, eventData);
    }
  } else if ("isBase64Encoded" in event) {
    const eventData = JSON.parse(
      event.isBase64Encoded
        ? Buffer.from(event.body, "base64").toString()
        : event.body
    ) as EventBody;
    await generatePdf(browser, eventData);
  }

  return { status: 200, message: "completed" };
}
