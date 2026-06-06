/// <reference types="vite/client" />

type PocketProject = {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: "active" | "idle" | "paused";
  createdAt: string;
  updatedAt: string;
};

type PocketAccount = {
  id: string;
  name: string;
  createdAt: string;
  lastActiveAt: string;
};

type PocketMessage = {
  id: string;
  speaker: "user" | "pocket";
  text: string;
  time: string;
};

type PocketFileChange = {
  path: string;
  action: "create" | "update" | "delete";
  summary: string;
  content?: string;
};

type PocketBuildCommand = {
  id: string;
  label: string;
  command: string;
  risk: "low" | "medium" | "high";
  requiresConfirmation: boolean;
  runByDefault?: boolean;
};

type PocketBuildPlan = {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  steps: string[];
  commands: PocketBuildCommand[];
  fileChanges: PocketFileChange[];
  safetyNote: string;
  previewPath: string;
  updatedAt: string;
};

type PocketMemorySummary = {
  projectId: string;
  summary: string;
  updatedAt: string;
};

type PocketMetadata = {
  currentProjectId: string;
  lastOpenedAt: string;
};

type PocketAISettings = {
  provider: "mock" | "custom";
  apiKey: string;
  model: string;
  baseUrl?: string;
};

type PocketSettings = {
  ai: PocketAISettings;
  remote: {
    enabled: boolean;
    port: number;
  };
  workspaceRoot: string;
  safety: {
    allowedCommands: string[];
    requireConfirmationForUnknown: boolean;
  };
  voice: {
    readAloud: boolean;
    language: string;
    provider: "local" | "hume";
    hume: {
      apiKey: string;
      secretKey: string;
      configId: string;
    };
  };
};

type PocketProjectFile = {
  projectId: string;
  path: string;
  content: string;
  updatedAt: string;
  lastRunId?: string;
};

type PocketRunLog = {
  id: string;
  time: string;
  stream: "system" | "stdout" | "stderr";
  message: string;
};

type PocketDevRun = {
  id: string;
  projectId: string;
  status: "waiting_confirmation" | "running" | "complete" | "failed" | "cancelled";
  prompt: string;
  plan: PocketBuildPlan;
  commands: PocketBuildCommand[];
  fileChanges: PocketFileChange[];
  logs: PocketRunLog[];
  previewUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
};

type PocketComputerActionCategory = "observe" | "navigate" | "inspect" | "edit" | "run" | "browser" | "desktop" | "guard";
type PocketComputerActionStatus = "planned" | "waiting_confirmation" | "running" | "blocked" | "complete" | "failed" | "cancelled";

type PocketComputerAction = {
  id: string;
  projectId: string;
  sessionId?: string;
  request: string;
  actor: string;
  target: string;
  category: PocketComputerActionCategory;
  risk: "low" | "medium" | "high";
  requiresConfirmation: boolean;
  status: PocketComputerActionStatus;
  summary: string;
  logs: PocketRunLog[];
  result?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

type PocketCreateComputerActionInput = {
  sessionId?: string;
  request: string;
  actor: string;
  target: string;
  category: PocketComputerActionCategory;
  risk: "low" | "medium" | "high";
  requiresConfirmation: boolean;
  summary: string;
  status?: PocketComputerActionStatus;
  result?: string;
  error?: string;
};

type PocketSnapshot = {
  accounts: PocketAccount[];
  currentAccountId: string;
  currentAccount?: PocketAccount;
  projects: PocketProject[];
  currentProjectId: string;
  messages: PocketMessage[];
  buildPlans: Record<string, PocketBuildPlan>;
  memorySummaries: Record<string, PocketMemorySummary>;
  metadata: PocketMetadata;
  settings: PocketSettings;
  runs: PocketDevRun[];
  files: PocketProjectFile[];
  computerActions: PocketComputerAction[];
  storagePath: string;
};

type PocketRemoteStatus = {
  running: boolean;
  port: number;
  urls: string[];
};

type PocketAIContext = {
  project?: PocketProject;
  messages?: PocketMessage[];
  prompt?: string;
  error?: string;
  files?: Array<{ path: string; content?: string }>;
};

type PocketEngineEvent =
  | { type: "run"; run: PocketDevRun }
  | { type: "log"; runId: string; log: PocketRunLog };

type PocketSpeechRecognitionResult = {
  isFinal: boolean;
  0: {
    transcript: string;
  };
};

type PocketSpeechRecognitionEvent = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: PocketSpeechRecognitionResult;
  };
};

type PocketSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: PocketSpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type PocketSpeechRecognitionConstructor = new () => PocketSpeechRecognition;

interface Window {
  SpeechRecognition?: PocketSpeechRecognitionConstructor;
  webkitSpeechRecognition?: PocketSpeechRecognitionConstructor;
  pocketDev?: {
    platform: string;
    version: string;
    persistence?: {
      load: () => Promise<PocketSnapshot>;
      createProject: (name?: string) => Promise<PocketSnapshot>;
      renameProject: (projectId: string, name: string) => Promise<PocketSnapshot>;
      selectProject: (projectId: string) => Promise<PocketSnapshot>;
      deleteProject: (projectId: string) => Promise<PocketSnapshot>;
      saveMessages: (projectId: string, messages: PocketMessage[]) => Promise<PocketSnapshot>;
      updateSettings: (settings: PocketSettings) => Promise<PocketSnapshot>;
      createAccount: (name: string) => Promise<PocketSnapshot>;
      selectAccount: (accountId: string) => Promise<PocketSnapshot>;
      createComputerAction: (projectId: string, input: PocketCreateComputerActionInput) => Promise<PocketSnapshot>;
    };
    engine?: {
      prepareRun: (projectId: string, prompt: string) => Promise<PocketDevRun>;
      executeRun: (runId: string) => Promise<PocketDevRun>;
      cancelRun: (runId: string) => Promise<PocketDevRun | undefined>;
      onEvent: (callback: (event: PocketEngineEvent) => void) => () => void;
    };
    ai?: {
      generateResponse: (input: PocketAIContext) => Promise<string>;
      generateBuildPlan: (input: PocketAIContext) => Promise<PocketBuildPlan>;
      proposeFileChanges: (input: PocketAIContext) => Promise<PocketFileChange[]>;
      summarizeMemory: (input: PocketAIContext) => Promise<PocketMemorySummary>;
      explainErrors: (input: PocketAIContext) => Promise<string>;
    };
    remote?: {
      status: () => Promise<PocketRemoteStatus>;
    };
    voice?: {
      connectHume: () => Promise<void>;
      sendHumeAudio: (data: string) => Promise<boolean>;
      disconnectHume: () => Promise<void>;
      onHumeEvent: (callback: (event: PocketHumeVoiceEvent) => void) => () => void;
    };
  };
}

type PocketHumeVoiceEvent =
  | { type: "status"; status: "connecting" | "open" | "closed" | "error"; message: string }
  | { type: "message"; message: Record<string, unknown> };
