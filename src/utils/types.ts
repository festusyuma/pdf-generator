export type SQSEvent = {
  Records: { body: string }[];
};

export type EventBody = {
  template: string;
  data: EventData;
  options: PDFFileOptions;
  uploadUrl: string;
  webhookUrl: string;
};

export interface EventData {
  [x: string]: EventDataType | Array<EventDataType>;
}

export type EventDataType =
  | boolean
  | string
  | number
  | EventData
  | Array<EventData>;

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

export type HttpEvent = {
  body: string;
  isBase64Encoded: boolean;
};

export type LambdaEvent = SQSEvent | HttpEvent;

interface recommendation {
  content: string;
  isCorrect: boolean;
  type: string;
}

interface criteriaDetail {
  title: string;
  score: number;
  totalPossibleScore: number;
  percentage: number;
  recommendations: recommendation[];
}

export interface generateReport {
  receiverName: string;
  totalScore: number;
  totalPossibleScore: number;
  criteriaDetails: criteriaDetail[];
  organizationEmail: string;
  organizationPhone: string;
  svgPieChart: string;
  descriptionSVG: string;
}
