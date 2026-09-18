export type ReportStatus = 'nove' | 'reseni' | 'hotovo';
export type ReportCategory = 'osvetleni' | 'komunikace' | 'zelen' | 'odpady' | 'voda' | 'jine';

export interface FaultReport {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  contactEmail?: string;
  contactPhone?: string;
  isAnonymized?: boolean;
  officialResolutionNote?: string;
}

export type SubmissionStatus = 'prijato' | 've_zpracovani' | 'vyrizeno' | 'zamitnuto';
export type SubmissionType = 'obecne_podani' | 'zadost_informace_106' | 'zadost_kaceni' | 'stiznost' | 'poplatky' | 'zivotni_prostredi';

export interface DigitalSubmission {
  id: string;
  trackingCode: string; // e.g. "CEH-2026-8491"
  type: SubmissionType;
  subject: string;
  content: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  deliveryMethod: 'datova_schranka' | 'email' | 'osobne';
  dataBoxId?: string;
  status: SubmissionStatus;
  createdAt: string;
  deadlineDate: string; // 30-day statutory limit
  assignedOfficer: string;
  resolutionNote?: string;
  auditTrail: { timestamp: string; action: string; actor: string }[];
}

export type HitlTaskType = 'publish_notice' | 'broadcast_alert' | 'citizen_proposal' | 'security_remediation';
export type HitlTaskStatus = 'pending' | 'approved' | 'rejected';

export interface HitlTask {
  id: string;
  type: HitlTaskType;
  title: string;
  description: string;
  payload: Record<string, any>;
  source: 'cdp_patrol' | 'anicka_ai' | 'webhook_system' | 'citizen';
  status: HitlTaskStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewReason?: string;
}

export interface AlertSubscriber {
  id: string;
  email: string;
  phoneHash?: string;
  categories: string[]; // 'pohroma', 'odstavka', 'voda', 'odpad', 'obec'
  verified: boolean;
  verifyToken: string;
  unsubscribeToken: string;
  subscribedAt: string;
}

export interface AlertCampaign {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'varovani' | 'pohroma';
  categories: string[];
  status: 'draft' | 'approved' | 'sending' | 'sent' | 'rejected';
  recipientCount: number;
  deliveredCount: number;
  createdAt: string;
  sentAt?: string;
  author: string;
  hitlApproved: boolean;
}

export interface SecurityPolicy {
  id: string;
  code: string; // e.g. "ICT-21-A-01"
  article: string; // "čl. 21(2)(a)"
  name: string;
  description: string;
  status: 'aktivni' | 've_schvalovani' | 'revize';
  complianceLevel: 'plne_splneno' | 'castecne' | 'planovano';
  lastAuditDate: string;
  officerResponsible: string;
}

export interface RopaEntry {
  id: string;
  purpose: string;
  legalBasis: string;
  dataCategories: string[];
  dataSubjects: string;
  retentionPeriod: string;
  securityMeasures: string;
  thirdPartyTransfer: string;
  isAiRelated: boolean;
}

export interface CdpFinding {
  id: string;
  severity: 'low' | 'medium' | 'high';
  category: 'wcag' | 'nis2' | 'gdpr' | 'broken_link' | 'data_integrity';
  title: string;
  description: string;
  detectedAt: string;
  suggestedAction: string;
  resolved: boolean;
}

export interface TitanShieldTest {
  id: string;
  name: string;
  targetArea: string;
  lastRun: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
}

export interface SelfHealingSnapshot {
  id: string;
  timestamp: string;
  hash: string;
  configVersion: string;
  description: string;
  tablesBackedUp: string[];
  verified: boolean;
}

export interface MunicipalKpiSuite {
  // 1) Procesní KPI
  processExcellence: {
    leadTimeDays: number;
    cycleTimeHours: number;
    slaCompliancePercent: number;
    errorRatePercent: number;
    processCapacityPerDay: number;
    backlogVolume: number;
    escalationCount: number;
    citizenSatisfactionNps: number;
  };
  // 2) Human Capital & AI Readiness
  humanCapital: {
    competencyIndexPercent: number;
    trainingCountMonthly: number;
    certificationReadinessPercent: number;
    digitalLiteracyIndex: number;
    aiReadinessScore: number;
    onboardingDays: number;
    skillGapIndexPercent: number;
  };
  // 3) Digitální obec
  digitalMunicipal: {
    digitalAdoptionRatePercent: number;
    selfServiceRatePercent: number;
    ePodatelnaDailyThroughput: number;
    notificationDeliveryRatePercent: number;
    pwaAdoptionPercent: number;
    apiUptimePercent: number;
    incidentResponseMinutes: number;
    uxSatisfactionScore: number;
  };
  // 4) Titan / NIS2 / Security
  securityCompliance: {
    nis2ComplianceScorePercent: number;
    securityIncidentCount: number;
    mttrHours: number;
    mfaCoveragePercent: number;
    patchCompliancePercent: number;
    auditLogCompletenessPercent: number;
    penTestScore: number;
    ransomwareResilienceScore: number;
  };
  // 5) AI (Anička / Titan / ČDP)
  aiMetrics: {
    aiResolutionRatePercent: number;
    aiEscalationRatePercent: number;
    aiAccuracyPercent: number;
    aiLatencyMs: number;
    cdpWorkflowSuccessPercent: number;
    cdpOrchestrationTimeSec: number;
    ragHitRatePercent: number;
    mcpEndpointUptimePercent: number;
  };
  // 6) Úřední agenda
  administrativeAgenda: {
    requestCompletionTimeDays: number;
    openCases: number;
    closedCases: number;
    documentErrorRatePercent: number;
    officerCapacityCasesPerMonth: number;
    citizenSatisfactionPercent: number;
    faultReportResponseHours: number;
    faultReportBacklogCount: number;
  };
  // 7) All-in-One Global Score
  overallReadinessScorePercent: number;
}

export interface HITLItem {
  id: string;
  itemType: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  payload?: any;
}

export type Nis2Policy = SecurityPolicy;

export interface OfficialNotice {
  id: string;
  fileNumber: string;
  title: string;
  category: string;
  description: string;
  publishedDate: string;
  expirationDate: string;
  fileSize: string;
  isElectronicSignatureValid: boolean;
  hashSha256: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  active: boolean;
  timestamp: string;
  affectedAreas: string[];
}
