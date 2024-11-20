import { Color, Icon } from "@raycast/api";
import { DeploymentStatus, Measuements } from "./types";

export const RAILWAY_API_URL = "https://backboard.railway.app/graphql/v2";
export const RAILWAY_URL = "https://railway.app";
export const GITHUB_URL = "https://github.com";

export const ENV_REGEX = {
  dev: /\b(dev(elopment)?|local|sandbox|feature|int(egration)?|debug|experimental(-env(ironment)?)?)\b/i,
  prod: /\b(prod(uction)?|live|main|release|stable|final|master|real(-env(ironment)?)?)\b/i,
  test: /\b(test(ing)?|qa|quality[- ]assurance|staging|sandbox(-env(ironment)?)?)\b/i,
};

export const ENV_COLORS = {
  dev: Color.Yellow,
  prod: Color.Green,
  test: Color.Blue,
};

export const ENV_ICONS = {
  dev: Icon.WrenchScrewdriver,
  prod: Icon.Rocket,
  test: Icon.Syringe,
};

export const DEPLOYMENT_STATUS_ICON: Record<DeploymentStatus, Icon> = {
  BUILDING: Icon.WrenchScrewdriver,
  CRASHED: Icon.Warning,
  DEPLOYING: Icon.Rocket,
  FAILED: Icon.XMarkCircle,
  INITIALIZING: Icon.Cog,
  NEEDS_APPROVAL: Icon.AtSymbol,
  QUEUED: Icon.Hourglass,
  REMOVED: Icon.Trash,
  REMOVING: Icon.DeleteDocument,
  SKIPPED: Icon.Forward,
  SLEEPING: Icon.Moon,
  SUCCESS: Icon.CheckCircle,
  WAITING: Icon.Clock,
}

export const DEPLOYMENT_STATUS_COLOR: Record<DeploymentStatus, Color> = {
  BUILDING: Color.Orange,
  CRASHED: Color.Red,
  DEPLOYING: Color.Green,
  FAILED: Color.Red,
  INITIALIZING: Color.Blue,
  NEEDS_APPROVAL: Color.Yellow,
  QUEUED: Color.PrimaryText,
  REMOVED: Color.Red,
  REMOVING: Color.Orange,
  SKIPPED: Color.Purple,
  SLEEPING: Color.Blue,
  SUCCESS: Color.Green,
  WAITING: Color.SecondaryText,
};

export const PRICES: Record<Measuements, number> = {
  cpu: 0.000463,
  memory: 0.000231,
  network: 0.10,
  disk: 0.000005787037037
}