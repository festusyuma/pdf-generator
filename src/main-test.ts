import puppeteer from "puppeteer";
import { EventBody, EventData } from "./utils";
import axios from "axios";
import Handlebars from "handlebars";
import { readFileSync } from "fs";

(async function () {
  const browser = await puppeteer.launch({
    headless: false,
    // args: ["--disable-dev-shm-usage", "--no-sandbox", "--single-process"],
    timeout: 0,
  });

  const uploadRes = await axios.put(
    "https://api.dev.skillpaddy.com/filemanager/document?filename=test_generator.pdf"
  );

  const uploadData = uploadRes.data.data;
  console.log("upload data :: ", uploadData);

  const eventData: EventData = {
    criteriaDetails: [
      {
        id: 1,
        title: "Me",
        score: 20,
        totalPossibleScore: 50,
        percentage: 40,
        strokeOffset: 251.2 * (1 - 40 / 100),
        assessmentFindings: [{ content: "another content", isCorrect: true }],
        assessmentImprovements: [
          { content: "first content", isCorrect: false },
        ],
      },
    ],
    noOfCriteriaDetails: 1,
    dateCreated: new Date().toISOString().split("T")[0],
    descriptionSVG: "Test me",
    organizationEmail: "festusyuma@gmail.com",
    organizationPhone: "+2349020310483",
    receiverName: "Agboma Festus",
    svgPieChart: "Test chart",
    totalPossibleScore: 20,
    totalScore: 10,
  };

  const eventbody: EventBody = {
    template: "https://files.skillpaddy.com/public/document/certificate.svg",
    data: eventData,
    options: { size: "a4" },
    uploadUrl: uploadData.uploadUrl,
    webhookUrl: "",
  };

  const f = readFileSync(
    `${__dirname}/src/assets/bag-report/index.html`
  ).toString();

  const templateHs = Handlebars.compile(f);

  const formattedV2 = templateHs(eventData);

  const pageTwo = await browser.newPage();
  await pageTwo.setContent(formattedV2, { waitUntil: "load" });
  console.log("loaded two");

  // const pdfFile = await page.pdf({
  //   format: "a4",
  //   preferCSSPageSize: true,
  //   printBackground: true,
  // });
  //
  // await axios.put(uploadData.uploadUrl, pdfFile);

  // await generatePdf(browser, eventData);
})().then();
