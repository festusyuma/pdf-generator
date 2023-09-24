import axios from "axios";
import { EventBody, formatString, SQSEvent } from "./utils";
import puppeteer, { executablePath } from "puppeteer";

export async function handler(event: SQSEvent) {
  console.log("event :: ", event);

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--headless",
      "--disable-setuid-sandbox",
      "--single-process",
    ],
    executablePath: executablePath(),
  });

  for (const record of event.Records) {
    const eventData = JSON.parse(record.body) as EventBody;

    const templateRes = await axios.get(eventData.template);
    const formatted = formatString(templateRes.data, eventData.data);

    const page = await browser.newPage();
    await page.setContent(formatted);

    const pdfFile = await page.pdf({
      format: eventData.options.size,
      landscape: eventData.options.landScape,
      preferCSSPageSize: true,
      printBackground: true,
    });

    try {
      await axios.put(eventData.uploadUrl, pdfFile);
    } catch (e) {
      console.error("error uploading generated file :: ", e);
    }

    if (eventData.webhookUrl) {
      try {
        await axios.post(eventData.webhookUrl);
      } catch (e) {
        console.error("error calling webhook :: ", e);
      }
    }
  }

  await browser.close();
  return { status: 200, message: "completed" };
}
