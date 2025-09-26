
export enum LoanStage {
  Application = "Application",
  Approved = "Approved",
  ESign = "e-Sign",
  ENACH = "e-NACH",
  VKYC = "VKYC",
  Bonafide = "Bonafide",
  Disbursed = "Disbursed",
  Rejected = "Rejected",
}

export enum StageStatus {
  Completed = "Completed",
  InProgress = "In Progress",
  Pending = "Pending",
  Stuck = "Stuck",
  Rejected = "Rejected",
}

export interface StageHistoryItem {
  stage: LoanStage;
  status: StageStatus;
  date: string;
}

export interface LoanApplication {
  applicationId: string;
  learnerId: string;
  learnerName: string;
  nbfcName: string;
  currentStage: LoanStage;
  lastUpdated: string;
  stageHistory: StageHistoryItem[];
  daysInCurrentStage: number;
  rejectionReason?: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
}