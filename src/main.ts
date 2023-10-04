import { EventBody, LambdaEvent, SQSEvent } from "./utils";
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

  if ("Records" in event) {
    for (const record of event.Records) {
      const eventData = JSON.parse(record.body) as EventBody;
      await generatePdf(browser, eventData);
    }
  } else {
    if (event.isBase64Encoded) {
      const eventData = JSON.parse(
        Buffer.from(event.body, "base64").toString()
      ) as EventBody;

      await generatePdf(browser, eventData);
    }
  }

  await browser.close();
  return { status: 200, message: "completed" };
}
