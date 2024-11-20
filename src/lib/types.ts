export type ExtensionSettings = {
  railwayApiKey: string;
};

export type GQLData<T> = {
  data: T;
};

export type GQLError = {
  message: string;
  locations: Array<{ line: number; column: number }>;
  extensions: { code: string };
  traceId: string;
};

export type GQLErrors = {
  errors: Array<GQLError>;
};

export type MemberRole = "MEMBER" | "ADMIN";

export type Member = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: MemberRole;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  members: Array<Member>;
  environments: Array<Pick<Environment, "name" | "id">>;
  admin: Member;
  cost: number;
  estimatedCost: number;
};

export type Service = {
  id: string;
  name: string;
  domain?: string;
  repo?: string;
};

export type Environment = {
  id: string;
  name: string;
  services: Array<Service>;
};

export type ProjectServices = {
  environments: Array<Environment>;
};

export type DeploymentStatus = 'BUILDING' | 'CRASHED' | 'DEPLOYING' | 'FAILED' | 'INITIALIZING' | 'NEEDS_APPROVAL' | 'QUEUED' | 'REMOVED' | 'REMOVING' | 'SKIPPED' | 'SLEEPING' | 'SUCCESS' | 'WAITING';

export type ServiceDeployment = {
  id: string;
  status: DeploymentStatus;
  createdAt: string;
};

export type Log = {
  timestamp: string;
  message: string;
  severity: string;
};

export type RawUsage = Array<{
  measurement: string
  value?: number
  estimatedValue?: number
  projectId: string
}>

export type Measuements = 'cpu' | 'memory' | 'network' | 'disk';