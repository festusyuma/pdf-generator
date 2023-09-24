export type SQSEvent = {
  Records: [{ body: string }];
};

export type EventBody = {
  template: string;
  data: Record<string, string>;
  key: string;
  options: PDFFileOptions;
  uploadUrl: string;
  webhookUrl: string;
};

export type PDFFileOptions = {
  landScape?: boolean;
  size?:
    | "letter"
    | "legal"
    | "tabloid"
    | "ledger"
    | "a0"
    | "a1"
    | "a2"
    | "a3"
    | "a4"
    | "a5"
    | "a6";
};
