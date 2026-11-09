export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type ProjectMockup = {
  title: string;
  screenType: string;
  visualStyle: string;
  primaryAction: string;
  modules: string[];
  dataHighlights: string[];
};

export type VisualConcept = {
  title: string;
  visualPrompt: string;
  imageAlt: string;
  palette: string[];
  heroLabel: string;
  imageDataUrl?: string | null;
  imageError?: string | null;
  imageModel?: string | null;
  visualExecutiveDataUrl?: string | null;
  visualOperationalDataUrl?: string | null;
};

export type StrategicScore = {
  operationalComplexity: string;
  conversionPotential: string;
  automationPotential: string;
  structuringUrgency: string;
  recommendedSolutionType: string;
  productivityImpact?: string;
  traceability?: string;
  scalability?: string;
  justifications?: Record<string, string>;
};

export type SolutionLevel = {
  recommended: 'Estrutura Essencial' | 'Estrutura Profissional' | 'Estrutura Escalável';
  rationale: string;
  options: Array<{
    label: string;
    description: string;
  }>;
};

export type IdealSolution = {
  title: string;
  note: string;
  steps: string[];
};

export type LeadInfo = {
  name: string;
  whatsapp: string;
  email: string;
  companyName: string;
};

export type DiagnosisProposal = {
  businessName: string;
  businessContext?: string;
  proposalPersona?:
    | 'enterprise_system'
    | 'industrial_automation'
    | 'dashboard_bi'
    | 'landing_branding'
    | 'personal_brand'
    | 'athlete_artist'
    | 'clinic_premium'
    | 'law_firm'
    | 'luxury_brand'
    | 'ecommerce'
    | 'institutional_site'
    | 'inventory_warehouse_system'
    | 'gamer_cinematic';
  projectCategory?: string;
  proposalTitle: string;
  briefingSummary: string;
  initialDiagnosis: string;
  operationalBottlenecks: string[];
  epicByteApproach: string;
  suggestedFeatures: string[];
  expectedOperationalImpacts: string[];
  strategicVision: string;
  recommendedTechnologies: string[];
  timeEstimate: string;
  investmentEstimate: string;
  evolutionOpportunities: string[];
  nextStep: string;
  mockup: ProjectMockup;
  visualConcept: VisualConcept;
  strategicScore: StrategicScore;
  solutionLevel: SolutionLevel;
  idealSolution: IdealSolution;
  implementationPlan?: string[];
  operationalImpactPotential?: string[];
  reducedOperationalRisks?: string[];
  successIndicators?: string[];
  executiveSummary?: string;
  roiNarrative?: string;
  imageGrant?: string | null;
  reviewRequired?: boolean;
  businessProblem?: string;
  commercialRationale?: string;
  nonFunctionalRequirements?: string[];
  integrations?: string[];
  pendingItems?: string[];
  architecture?: string;
  benefits?: string[];
  assumptions?: string[];
  exclusions?: string[];
  risks?: string[];
  estimationModules?: Array<{
    name: string;
    description: string;
    phase: 'mvp' | 'profissional' | 'evolucao';
    complexity: 'baixa' | 'media' | 'alta';
  }>;
  pricing?: {
    source: 'motor_comercial';
    priced: boolean;
    phases: Array<{ name: string; modules: string[]; investmentMin: number | null; investmentMax: number | null; weeksMin: number; weeksMax: number }>;
    maintenanceMonthlyMin: number;
    maintenanceMonthlyMax: number;
    infrastructureNote: string;
    licensesNote: string;
    assumptions: string[];
    deadlineAlert: string | null;
    budgetAlert: string | null;
  };
  requirementsModel?: { requirements: ProposalRequirement[] };
};

export type ProposalRequirement = {
  id: string;
  kind: string;
  description: string;
  priority: 'alta' | 'media' | 'baixa';
  origin: 'cliente' | 'recomendacao_epicbyte' | 'hipotese';
  status: 'confirmado' | 'recomendacao' | 'hipotese_pendente';
  dependencies: string[];
};

export type DiagnosisApiResponse = {
  status: 'collecting' | 'proposal';
  assistantMessage: string;
  quickReplies: string[];
  proposal: DiagnosisProposal | null;
  progress?: { current: number; total: number; label: string };
  briefingToken?: string;
};
