import { generateCertificate } from "./utils/helpers/generate";
import axios from "axios";
import puppeteer, { executablePath } from "puppeteer";

(async () => {
  const template = generateCertificate({
    fullName: "festus",
    date: "23-07-2023",
    courseName: "Computer Science",
  });

  console.log("initialising browser");

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--headless",
      "disable-gpu",
    ],
    executablePath: executablePath(),
  });

  console.log("initialised browser");

  const page = await browser.newPage();
  await page.setContent(template);

  console.log("loaded content");

  const pdfFile = await page.pdf({
    format: undefined,
    landscape: true,
    preferCSSPageSize: true,
    printBackground: true,
  });

  console.log("generated pdf");

  await browser.close();

  console.log("closed browser");

  const urlRes = await axios.put(
    "https://api.dev.skillpaddy.com/filemanager/document?filename=another_file_12332.pdf"
  );

  const uploadData = urlRes.data.data;
  console.log(uploadData);

  await axios.put(uploadData.uploadUrl, pdfFile);
})();
