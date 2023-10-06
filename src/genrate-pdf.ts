import { Browser } from "puppeteer";
import { EventBody } from "./utils";
import axios from "axios";
import Handlebars from "handlebars";

export async function generatePdf(browser: Browser, data: EventBody) {
  try {
    const templateRes = await axios.get(data.template);
    console.info("fetched template");

    const templateHs = Handlebars.compile(templateRes.data);
    const formatted = templateHs(data.data);

    const page = await browser.newPage();
    await page.setContent(formatted, { waitUntil: "load" });
    console.info("loaded page");

    const pdfFile = await page.pdf({
      format: data.options.size,
      landscape: data.options.landScape,
      preferCSSPageSize: true,
      printBackground: true,
    });

    await page.close();
    console.log("closed page");

    try {
      await axios.put(data.uploadUrl, pdfFile);
      console.info("uploaded file");
    } catch (e) {
      console.error("error uploading generated file :: ", e);
    }

    if (data.webhookUrl) {
      try {
        await axios.post(data.webhookUrl);
      } catch (e) {
        console.error("error calling webhook :: ", e);
      }
    }
  } catch (e) {
    console.error(`Error generating pdf :: `, e);
  }
}
