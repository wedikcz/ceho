import {
  FaultReport,
  DigitalSubmission,
  HitlTask,
  AlertSubscriber,
  AlertCampaign,
  SecurityPolicy,
  RopaEntry,
  CdpFinding,
  TitanShieldTest,
  SelfHealingSnapshot,
  MunicipalKpiSuite,
} from './types';
import { VILLAGE_DATA } from './village-data';

const STORAGE_KEYS = {
  REPORTS: 'cehovice_reports_v2',
  SUBMISSIONS: 'cehovice_submissions_v2',
  TASKS: 'cehovice_hitl_tasks_v2',
  SUBSCRIBERS: 'cehovice_subscribers_v2',
  CAMPAIGNS: 'cehovice_campaigns_v2',
  POLICIES: 'cehovice_sec_policies_v2',
  FINDINGS: 'cehovice_cdp_findings_v2',
  SNAPSHOTS: 'cehovice_snapshots_v2',
  AUDIT: 'cehovice_audit_log_v2',
  NIS2_REG: 'cehovice_nis2_registration_v2',
  CRON_ACTIVE: 'cehovice_cdp_cron_active_v2',
  ACCESSIBILITY: 'cehovice_accessibility_v2',
};

// Initial Seed Data
const INITIAL_REPORTS: FaultReport[] = [
  {
    id: 'rep-001',
    category: 'osvetleni',
    title: 'Nesvítící lampa veřejného osvětlení u autobusové čekárny',
    description: 'Lampa č. 42 bliká a v noci zhasíná, u přechodu pro chodce je šero.',
    location: 'Náves, před č.p. 45',
    latitude: 49.4318,
    longitude: 17.1891,
    status: 'reseni',
    createdAt: '2026-09-15T08:30:00Z',
    updatedAt: '2026-09-16T10:15:00Z',
    contactEmail: 'obcan.cehovice@email.cz',
    contactPhone: '+420 777 123 456',
    isAnonymized: false,
    officialResolutionNote: 'Závada předána smluvnímu elektroservisu, výměna LED tělesa naplánována na pátek.',
  },
  {
    id: 'rep-002',
    category: 'komunikace',
    title: 'Výtluk v asfaltu po zimě na spojovací cestě k rybníku',
    description: 'Hluboká díra cca 40 cm, hrozí poškození kol aut a kočárků.',
    location: 'Ulička Pod Hrází u č.p. 92',
    latitude: 49.4298,
    longitude: 17.1924,
    status: 'nove',
    createdAt: '2026-09-17T14:20:00Z',
    updatedAt: '2026-09-17T14:20:00Z',
    contactEmail: 'jana.k@seznam.cz',
    isAnonymized: false,
  },
  {
    id: 'rep-003',
    category: 'zelen',
    title: 'Spadlá suchá větev na chodník v zámeckém parku',
    description: 'Při silném větru se odlomila větev ze starého javoru.',
    location: 'Obecní park u pomníku',
    latitude: 49.4311,
    longitude: 17.1888,
    status: 'hotovo',
    createdAt: '2026-09-10T09:00:00Z',
    updatedAt: '2026-09-11T11:00:00Z',
    contactEmail: 'anonymni@obec.cz',
    isAnonymized: true,
    officialResolutionNote: 'Odstraněno technickými pracovníky obce do 24 hodin, dřevo uloženo.',
  },
];

const INITIAL_SUBMISSIONS: DigitalSubmission[] = [
  {
    id: 'sub-001',
    trackingCode: 'CEH-2026-7812',
    type: 'zadost_kaceni',
    subject: 'Žádost o povolení kácení rizikového smrku na parc. 128/1',
    content: 'Strom má poškozený kořenový systém a naklání se nad střechu sousedního rodinného domu.',
    applicantName: 'Karel Novotný',
    applicantEmail: 'novotny.k@quick.cz',
    applicantPhone: '+420 608 444 555',
    deliveryMethod: 'email',
    status: 've_zpracovani',
    createdAt: '2026-09-12T10:00:00Z',
    deadlineDate: '2026-10-12T23:59:59Z',
    assignedOfficer: 'Milan Smékal (starosta)',
    auditTrail: [
      { timestamp: '2026-09-12T10:00:00Z', action: 'Podání přijato a zaevidováno v e-spisové službě', actor: 'E-Podatelna' },
      { timestamp: '2026-09-13T14:00:00Z', action: 'Provedeno místní šetření komisí ŽP', actor: 'M. Smékal' },
    ],
  },
  {
    id: 'sub-002',
    trackingCode: 'CEH-2026-9043',
    type: 'zadost_informace_106',
    subject: 'Žádost o poskytnutí informací dle zákona č. 106/1999 Sb. o plánované cyklostezce',
    content: 'Prosím o zaslání projektové dokumentace a harmonogramu výstavby cyklostezky Čehovice – Bedihošť.',
    applicantName: 'Mgr. Petr Jelínek',
    applicantEmail: 'jelinek.arch@gmail.com',
    deliveryMethod: 'datova_schranka',
    dataBoxId: 'xy7b9pa',
    status: 'vyrizeno',
    createdAt: '2026-09-02T11:15:00Z',
    deadlineDate: '2026-09-17T23:59:59Z',
    assignedOfficer: 'Ing. Radim Kovář (místostarosta)',
    resolutionNote: 'Odpověď s odkazem na schválenou studii odeslána do datové schránky žadatele 8. 9. 2026.',
    auditTrail: [
      { timestamp: '2026-09-02T11:15:00Z', action: 'Podání zaevidováno', actor: 'E-Podatelna' },
      { timestamp: '2026-09-08T16:20:00Z', action: 'Dokumenty odeslány do ISDS', actor: 'R. Kovář' },
    ],
  },
];

const INITIAL_TASKS: HitlTask[] = [
  {
    id: 'task-001',
    type: 'publish_notice',
    title: 'Schválení zveřejnění záměru směny pozemků v k.ú. Čehovice',
    description: 'ČDP autonomní robot připravil text vyhlášky k záměru směny pozemku parc. 342/2.',
    payload: { category: 'zamer', fileNumber: 'ČEH/093/2026', title: 'Záměr směny pozemku u polní cesty' },
    source: 'cdp_patrol',
    status: 'pending',
    createdAt: '2026-09-17T05:00:00Z',
  },
  {
    id: 'task-002',
    type: 'broadcast_alert',
    title: 'Povolení hromadné notifikace: Zákaz odběru povrchových vod',
    description: 'Návrh krizového e-mail/SMS varování občanům kvůli nízkému stavu toku Vřesovky.',
    payload: { severity: 'varovani', categories: ['voda', 'obec'], message: 'Vzhledem k suchu platí od 20. 9. přísný zákaz odběru vody z toku Vřesovky na zalévání.' },
    source: 'cdp_patrol',
    status: 'pending',
    createdAt: '2026-09-17T11:30:00Z',
  },
];

const INITIAL_POLICIES: SecurityPolicy[] = [
  {
    id: 'pol-1',
    code: 'ICT-21-A-01',
    article: 'čl. 21(2)(a)',
    name: 'Politika bezpečnosti ICT a řízení rizik obce',
    description: 'Základní bezpečnostní rámec určující pravidla pro přístupy úředníků, zálohování a ochranu informačních systémů.',
    status: 'aktivni',
    complianceLevel: 'plne_splneno',
    lastAuditDate: '2026-08-15',
    officerResponsible: 'Starosta & Pověřenec GDPR',
  },
  {
    id: 'pol-2',
    code: 'ICT-21-B-02',
    article: 'čl. 21(2)(b)',
    name: 'Metodika zvládání a hlášení kybernetických incidentů (CSIRT/NÚKIB)',
    description: 'Postup při detekci ransomwaru, phishingu a hlášení NÚKIB do 24 hodin dle nové vyhlášky 2027.',
    status: 'aktivni',
    complianceLevel: 'plne_splneno',
    lastAuditDate: '2026-09-01',
    officerResponsible: 'Správce sítě Titan',
  },
  {
    id: 'pol-3',
    code: 'ICT-21-C-03',
    article: 'čl. 21(2)(c)',
    name: 'Plán kontinuity činností a havarijní obnova (BCP/DR)',
    description: 'Zajištění provozu matriky a úřední desky i v případě blackoutu a fyzického poškození serverovny.',
    status: 'aktivni',
    complianceLevel: 'plne_splneno',
    lastAuditDate: '2026-07-20',
    officerResponsible: 'Místostarosta',
  },
  {
    id: 'pol-4',
    code: 'ICT-21-D-04',
    article: 'čl. 21(2)(d)',
    name: 'Bezpečnost dodavatelského řetězce (Supply Chain Security)',
    description: 'Bezpečnostní doložky ve smlouvách s dodavateli spisové služby, webhostingu a softwaru.',
    status: 'aktivni',
    complianceLevel: 'plne_splneno',
    lastAuditDate: '2026-09-10',
    officerResponsible: 'Právní poradce obce',
  },
  {
    id: 'pol-5',
    code: 'ICT-21-E-05',
    article: 'čl. 21(2)(e)',
    name: 'Vícefaktorové ověřování (MFA) a bezpečná komunikace',
    description: 'Povinnost MFA pro veškeré vzdálené přístupy úředníků do IS obce a správu portálu.',
    status: 'aktivni',
    complianceLevel: 'plne_splneno',
    lastAuditDate: '2026-08-30',
    officerResponsible: 'Správce sítě Titan',
  },
  {
    id: 'pol-6',
    code: 'ICT-21-AI-06',
    article: 'EU AI Act 2027',
    name: 'Pravidla AI governance a algoritmické transparentnosti (Anička & ČDP)',
    description: 'Zákaz autonomního vydávání správních rozhodnutí AI, evidence RAG modelů a garance nezpracovávání citlivých PII mimo EU.',
    status: 'aktivni',
    complianceLevel: 'plne_splneno',
    lastAuditDate: '2026-09-14',
    officerResponsible: 'Komise pro digitalizaci',
  },
];

const INITIAL_ROPA: RopaEntry[] = [
  {
    id: 'ropa-1',
    purpose: 'Digitální podatelna a vyřizování podání občanů',
    legalBasis: 'Čl. 6 odst. 1 písm. c) a e) GDPR (plnění právní povinnosti obce)',
    dataCategories: ['Jméno', 'Příjmení', 'E-mail', 'Telefon', 'ID datové schránky', 'Obsah žádosti'],
    dataSubjects: 'Občané podávající podání a žadatelé o informace',
    retentionPeriod: 'Dle spisového a skartačního řádu (5–10 let)',
    securityMeasures: 'Šifrování v klidu i při přenosu, řízení přístupů dle rolí, audit log',
    thirdPartyTransfer: 'Žádné předávání mimo EU',
    isAiRelated: false,
  },
  {
    id: 'ropa-2',
    purpose: 'Obousměrná notifikační brána varování občanů (SMS / E-mail)',
    legalBasis: 'Čl. 6 odst. 1 písm. a) GDPR (výslovný souhlas se zasíláním) a písm. d) (ochrana životně důležitých zájmů u krizí)',
    dataCategories: ['E-mail', 'Hash telefonního čísla (anonymizováno)'],
    dataSubjects: 'Přihlášení odběratelé obecních výstrah',
    retentionPeriod: 'Do odvolání souhlasu občanem (odhlášení na 1 kliknutí)',
    securityMeasures: 'Dvojitý opt-in, kryptografický token odhlášení, maskování dat v administraci',
    thirdPartyTransfer: 'Vlastní evropská platformní brána, žádné komerční brokery',
    isAiRelated: false,
  },
  {
    id: 'ropa-3',
    purpose: 'Hlášení závad a komunikace v obci',
    legalBasis: 'Čl. 6 odst. 1 písm. e) GDPR (veřejný zájem)',
    dataCategories: ['Popis závady', 'GPS souřadnice', 'Volitelný kontaktní e-mail/telefon'],
    dataSubjects: 'Oznamovatelé závad na veřejném prostranství',
    retentionPeriod: '90 dní po vyřešení, možnost okamžitého anonymizačního výmazu',
    securityMeasures: 'Jednoduché tlačítko GDPR výmazu v adminu, minimalizace',
    thirdPartyTransfer: 'Ne',
    isAiRelated: false,
  },
  {
    id: 'ropa-4',
    purpose: 'AI asistentka Anička & Sémantická mezipaměť (ČDP)',
    legalBasis: 'Čl. 6 odst. 1 písm. e) GDPR a Metakognitivní licence ML-2.1',
    dataCategories: ['Texty dotazů (zbavené PII anonymizátorem)', 'Sémantické vektory veřejných dokumentů'],
    dataSubjects: 'Uživatelé webu využívající konverzační rozhraní',
    retentionPeriod: 'Dočasná mezipaměť dotazů 30 dní, veřejná RAG báze trvale',
    securityMeasures: 'Předřazený PII filtr, zero-retention trénování zakázáno smlouvou DPA',
    thirdPartyTransfer: 'Lokální zpracování v EU (Google Cloud Run eu-west-1)',
    isAiRelated: true,
  },
];

const INITIAL_FINDINGS: CdpFinding[] = [
  {
    id: 'find-1',
    severity: 'low',
    category: 'data_integrity',
    title: 'Kontrola lhůt digitální podatelny',
    description: 'Všechna otevřená podání jsou v zákonné 30denní lhůtě. Nejbližší expirace za 15 dní.',
    detectedAt: 'Dnes v 05:00',
    suggestedAction: 'Žádná akce není nutná.',
    resolved: true,
  },
  {
    id: 'find-2',
    severity: 'medium',
    category: 'nis2',
    title: 'Požadavek NIS2: Aktivace denní automatické prohlídky ČDP',
    description: 'Pro splnění 100 % kybernetické připravenosti aktivujte plánovač automatických denních kontrol.',
    detectedAt: 'Včera v 23:45',
    suggestedAction: 'Klikněte na tlačítko "Aktivovat denní ČDP cron" v sekci Automatizace.',
    resolved: false,
  },
  {
    id: 'find-3',
    severity: 'low',
    category: 'wcag',
    title: 'WCAG 2.2 AA kontrastní shoda',
    description: 'Všechny veřejné komponenty dosahují minimálního kontrastního poměru 4.8:1 (WCAG AA prošlo).',
    detectedAt: 'Dnes v 05:01',
    suggestedAction: 'Dodržovat definované CSS tokeny.',
    resolved: true,
  },
];

const INITIAL_SNAPSHOTS: SelfHealingSnapshot[] = [
  {
    id: 'snap-001',
    timestamp: '2026-09-17T05:00:00Z',
    hash: 'sha256-a9f81c2d0e741b',
    configVersion: '2027.09.13-LATEST',
    description: 'Automatický denní snapshot konfigurace před ranní prohlídkou ČDP',
    tablesBackedUp: ['notices', 'reports', 'submissions', 'policies', 'ropa'],
    verified: true,
  },
];

export const MUNICIPAL_KPI_DATA: MunicipalKpiSuite = {
  processExcellence: {
    leadTimeDays: 4.2,
    cycleTimeHours: 18.5,
    slaCompliancePercent: 98.4,
    errorRatePercent: 1.2,
    processCapacityPerDay: 24,
    backlogVolume: 3,
    escalationCount: 0,
    citizenSatisfactionNps: 76,
  },
  humanCapital: {
    competencyIndexPercent: 94.0,
    trainingCountMonthly: 3,
    certificationReadinessPercent: 100,
    digitalLiteracyIndex: 8.8,
    aiReadinessScore: 92,
    onboardingDays: 2.5,
    skillGapIndexPercent: 4.8,
  },
  digitalMunicipal: {
    digitalAdoptionRatePercent: 84.5,
    selfServiceRatePercent: 78.2,
    ePodatelnaDailyThroughput: 12,
    notificationDeliveryRatePercent: 99.7,
    pwaAdoptionPercent: 62.4,
    apiUptimePercent: 99.98,
    incidentResponseMinutes: 4.2,
    uxSatisfactionScore: 4.85, // out of 5
  },
  securityCompliance: {
    nis2ComplianceScorePercent: 96.0,
    securityIncidentCount: 0,
    mttrHours: 0.8,
    mfaCoveragePercent: 100,
    patchCompliancePercent: 100,
    auditLogCompletenessPercent: 100,
    penTestScore: 94,
    ransomwareResilienceScore: 98,
  },
  aiMetrics: {
    aiResolutionRatePercent: 88.6,
    aiEscalationRatePercent: 11.4,
    aiAccuracyPercent: 97.9,
    aiLatencyMs: 380,
    cdpWorkflowSuccessPercent: 100,
    cdpOrchestrationTimeSec: 1.8,
    ragHitRatePercent: 96.2,
    mcpEndpointUptimePercent: 99.99,
  },
  administrativeAgenda: {
    requestCompletionTimeDays: 5.1,
    openCases: 4,
    closedCases: 148,
    documentErrorRatePercent: 0.6,
    officerCapacityCasesPerMonth: 65,
    citizenSatisfactionPercent: 96.2,
    faultReportResponseHours: 3.5,
    faultReportBacklogCount: 1,
  },
  overallReadinessScorePercent: 96.8,
};

// Client Safe Store Helpers
export function getStoredReports(): FaultReport[] {
  if (typeof window === 'undefined') return INITIAL_REPORTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : INITIAL_REPORTS;
  } catch {
    return INITIAL_REPORTS;
  }
}

export function saveReport(report: FaultReport) {
  if (typeof window === 'undefined') return;
  const current = getStoredReports();
  const index = current.findIndex((r) => r.id === report.id);
  let updated: FaultReport[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = report;
  } else {
    updated = [report, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  addAuditLog(`Závada: ${report.id} - ${report.title}`, 'Hlášení závad');
  return updated;
}

export function getStoredSubmissions(): DigitalSubmission[] {
  if (typeof window === 'undefined') return INITIAL_SUBMISSIONS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : INITIAL_SUBMISSIONS;
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

export function saveSubmission(sub: DigitalSubmission) {
  if (typeof window === 'undefined') return;
  const current = getStoredSubmissions();
  const index = current.findIndex((s) => s.id === sub.id);
  let updated: DigitalSubmission[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = sub;
  } else {
    updated = [sub, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));
  addAuditLog(`Podatelna: Nové podání s kódem ${sub.trackingCode}`, 'Digitální podatelna');
  return updated;
}

export function getStoredTasks(): HitlTask[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function updateTaskStatus(taskId: string, status: 'approved' | 'rejected', reason?: string) {
  if (typeof window === 'undefined') return;
  const current = getStoredTasks();
  const updated = current.map((t) =>
    t.id === taskId
      ? { ...t, status, reviewedAt: new Date().toISOString(), reviewedBy: 'Starosta obce (HITL)', reviewReason: reason }
      : t
  );
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
  addAuditLog(`HITL úloha ${taskId} byla ${status === 'approved' ? 'SCHVÁLENA' : 'ZAMÍTNUTA'}`, 'HITL Schvalování');
  return updated;
}

export function getStoredPolicies(): SecurityPolicy[] {
  if (typeof window === 'undefined') return INITIAL_POLICIES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.POLICIES);
    return data ? JSON.parse(data) : INITIAL_POLICIES;
  } catch {
    return INITIAL_POLICIES;
  }
}

export function savePolicy(policy: SecurityPolicy) {
  if (typeof window === 'undefined') return;
  const current = getStoredPolicies();
  const index = current.findIndex((p) => p.id === policy.id);
  let updated: SecurityPolicy[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = policy;
  } else {
    updated = [...current, policy];
  }
  localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(updated));
  addAuditLog(`Aktualizace bezpečnostní politiky ${policy.code}`, 'NIS2 Compliance');
  return updated;
}

export function getStoredRopa(): RopaEntry[] {
  return INITIAL_ROPA;
}

export function getStoredSnapshots(): SelfHealingSnapshot[] {
  if (typeof window === 'undefined') return INITIAL_SNAPSHOTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
    return data ? JSON.parse(data) : INITIAL_SNAPSHOTS;
  } catch {
    return INITIAL_SNAPSHOTS;
  }
}

export function createSelfHealingSnapshot(desc?: string): SelfHealingSnapshot {
  const current = getStoredSnapshots();
  const newSnap: SelfHealingSnapshot = {
    id: `snap-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
    hash: `sha256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`,
    configVersion: '2027.09.18-REGEN',
    description: desc || 'Ručně vyvolaný self-healing snapshot konfigurace a integrity databáze',
    tablesBackedUp: ['notices', 'reports', 'submissions', 'policies', 'ropa', 'subscribers'],
    verified: true,
  };
  const updated = [newSnap, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(updated));
  }
  addAuditLog(`Vytvořen nový self-healing snapshot ${newSnap.hash}`, 'Titan Shield');
  return newSnap;
}

export function getAuditLog(): { timestamp: string; detail: string; category: string }[] {
  if (typeof window === 'undefined') {
    return [
      { timestamp: '18. 09. 2026 05:00', detail: 'Spuštěna ranní kontrola ČDP a integrity databáze', category: 'Systém Titan' },
      { timestamp: '18. 09. 2026 08:30', detail: 'Ověření certifikátu domény cehovice.cz (TLS 1.3 platný do 2027)', category: 'Bezpečnost' },
    ];
  }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return data
      ? JSON.parse(data)
      : [
          { timestamp: '18. 09. 2026 05:00', detail: 'Spuštěna ranní kontrola ČDP a integrity databáze', category: 'Systém Titan' },
          { timestamp: '18. 09. 2026 08:30', detail: 'Ověření certifikátu domény cehovice.cz (TLS 1.3 platný do 2027)', category: 'Bezpečnost' },
        ];
  } catch {
    return [];
  }
}

export function addAuditLog(detail: string, category: string = 'Obecné') {
  if (typeof window === 'undefined') return;
  const current = getAuditLog();
  const now = new Date();
  const timeStr = `${now.toLocaleDateString('cs-CZ')} ${now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}`;
  const updated = [{ timestamp: timeStr, detail, category }, ...current.slice(0, 99)];
  localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
}

export function isCdpCronActive(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEYS.CRON_ACTIVE) === 'true';
}

export function setCdpCronActive(active: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CRON_ACTIVE, active ? 'true' : 'false');
  addAuditLog(`Denní ČDP cron byl ${active ? 'AKTIVOVÁN' : 'POZASTAVEN'}`, 'ČDP Automatizace');
}

export function getNis2Registration(): { registered: boolean; entityType: string; registrationNumber?: string; registeredAt?: string } {
  if (typeof window === 'undefined') {
    return { registered: true, entityType: 'Důležitá entita (obec s rozšířenou digitální agendou)', registrationNumber: 'NUKIB-REG-2027-00288101', registeredAt: '2026-09-14' };
  }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NIS2_REG);
    return data
      ? JSON.parse(data)
      : { registered: true, entityType: 'Důležitá entita (obec s rozšířenou digitální agendou)', registrationNumber: 'NUKIB-REG-2027-00288101', registeredAt: '2026-09-14' };
  } catch {
    return { registered: true, entityType: 'Důležitá entita', registrationNumber: 'NUKIB-REG-2027-00288101' };
  }
}

export function saveNis2Registration(data: { registered: boolean; entityType: string; registrationNumber?: string; registeredAt?: string }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.NIS2_REG, JSON.stringify(data));
  addAuditLog(`Registrace NIS2 aktualizována: ${data.entityType}`, 'NIS2 Compliance');
}

export function anonymizeReportContact(reportId: string): FaultReport[] | undefined {
  if (typeof window === 'undefined') return;
  const current = getStoredReports();
  const updated = current.map((r) =>
    r.id === reportId
      ? {
          ...r,
          contactEmail: undefined,
          contactPhone: undefined,
          isAnonymized: true,
          updatedAt: new Date().toISOString(),
        }
      : r
  );
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  addAuditLog(`GDPR anonymizace kontaktu pro hlášení ${reportId}`, 'Ochrana PII');
  return updated;
}

export function getStoredHITLQueue(): any[] {
  return getStoredTasks().map((t) => ({
    id: t.id,
    itemType: t.type,
    content: `${t.title} - ${t.description}`,
    status: t.status,
    submittedAt: t.createdAt,
    payload: t.payload,
  }));
}

export function approveHITLItem(itemId: string): any[] | undefined {
  updateTaskStatus(itemId, 'approved');
  return getStoredHITLQueue();
}

export function rejectHITLItem(itemId: string, reason?: string): any[] | undefined {
  updateTaskStatus(itemId, 'rejected', reason);
  return getStoredHITLQueue();
}

const INITIAL_NOTICES: any[] = [
  {
    id: 'not-01',
    fileNumber: 'ČEH/089/2026',
    title: 'Obecně závazná vyhláška č. 2/2026 o místních poplatcích za odpady',
    category: 'vyhlaska',
    description: 'Stanovení sazeb poplatku za provoz obecního systému odpadového hospodářství pro rok 2027.',
    publishedDate: '15. 9. 2026',
    expirationDate: '1. 10. 2026',
    fileSize: '320 kB',
    isElectronicSignatureValid: true,
    hashSha256: 'sha256-e91b4a2f8d3c',
  },
  {
    id: 'not-02',
    fileNumber: 'ČEH/092/2026',
    title: 'Záměr pronájmu nebytových prostor v budově obecního úřadu',
    category: 'zamer',
    description: 'Pronájem ordinace praktického lékaře pro dospělé od 1. ledna 2027.',
    publishedDate: '12. 9. 2026',
    expirationDate: '27. 9. 2026',
    fileSize: '210 kB',
    isElectronicSignatureValid: true,
    hashSha256: 'sha256-a14f6b890cc1',
  },
];

export function getStoredNotices(): any[] {
  if (typeof window === 'undefined') return INITIAL_NOTICES;
  try {
    const data = localStorage.getItem('cehovice_notices_v2');
    return data ? JSON.parse(data) : INITIAL_NOTICES;
  } catch {
    return INITIAL_NOTICES;
  }
}

export function saveNotice(notice: any): any[] | undefined {
  if (typeof window === 'undefined') return;
  const current = getStoredNotices();
  const updated = [notice, ...current];
  localStorage.setItem('cehovice_notices_v2', JSON.stringify(updated));
  addAuditLog(`Vyvěšen nový dokument na úřední desku: ${notice.fileNumber} - ${notice.title}`, 'Úřední deska');
  return updated;
}

const INITIAL_ALERTS: any[] = [
  {
    id: 'al-01',
    title: 'Plánovaná odstávka elektrické energie – ulice Za Kostelem',
    message: 'Dne 24. 9. 2026 od 8:00 do 13:00 proběhne plánovaná revize ČEZ Distribuce.',
    severity: 'warning',
    active: true,
    timestamp: '2026-09-17T08:00:00Z',
    affectedAreas: ['Za Kostelem', 'K Nádraží'],
  },
];

export function getStoredAlerts(): any[] {
  if (typeof window === 'undefined') return INITIAL_ALERTS;
  try {
    const data = localStorage.getItem('cehovice_alerts_v2');
    return data ? JSON.parse(data) : INITIAL_ALERTS;
  } catch {
    return INITIAL_ALERTS;
  }
}

export function saveAlert(alert: any): any[] | undefined {
  if (typeof window === 'undefined') return;
  const current = getStoredAlerts();
  const updated = [alert, ...current];
  localStorage.setItem('cehovice_alerts_v2', JSON.stringify(updated));
  addAuditLog(`Vyhlášeno krizové varování občanům: ${alert.title}`, 'Krizová notifikace');
  return updated;
}

export function updatePolicyStatus(policyId: string, status: any): SecurityPolicy[] | undefined {
  if (typeof window === 'undefined') return;
  const current = getStoredPolicies();
  const updated = current.map((p) => (p.id === policyId ? { ...p, status } : p));
  localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(updated));
  addAuditLog(`Aktualizace stavu politiky ${policyId}`, 'NIS2 Compliance');
  return updated;
}

export function getAuditLogs(): any[] {
  return getAuditLog().map((l) => ({
    timestamp: l.timestamp,
    action: l.detail,
    actor: l.category,
  }));
}

