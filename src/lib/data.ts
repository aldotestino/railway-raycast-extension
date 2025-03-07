import { Color, Icon, List } from "@raycast/api";
import { DeploymentStatus, Measuements } from "./types";

export const RAILWAY_API_URL = "https://backboard.railway.app/graphql/v2";
export const RAILWAY_URL = "https://railway.app";
export const GITHUB_URL = "https://github.com";

export const ENV_REGEX = {
  dev: /\b(dev(elopment)?|local|sandbox|feature|int(egration)?|debug|experimental(-env(ironment)?)?)\b/i,
  prod: /\b(prod(uction)?|live|main|release|stable|final|master|real(-env(ironment)?)?)\b/i,
  test: /\b(test(ing)?|qa|quality[- ]assurance|staging|sandbox(-env(ironment)?)?)\b/i,
};

export const SEVERITY_REGEX = {
  info: /\b(info)\b/i,
  warning: /\b(warn(ing)?)\b/i,
  error: /\b(err(or)?)\b/i,
}

export const ENV_TAG_PROPS: Record<string, { color: Color, icon: Icon }> = {
  dev: { color: Color.Yellow, icon: Icon.WrenchScrewdriver },
  prod: { color: Color.Green, icon: Icon.Rocket },
  test: { color: Color.Blue, icon: Icon.Syringe },
}

export const DEPLOYMENT_STATUS_ICON_PROPS: Record<DeploymentStatus, React.ComponentProps<typeof List.Item>["icon"]> = {
  BUILDING: { source: Icon.WrenchScrewdriver, tintColor: Color.Orange },
  CRASHED: { source: Icon.Warning, tintColor: Color.Red },
  DEPLOYING: { source: Icon.Rocket, tintColor: Color.Green },
  FAILED: { source: Icon.XMarkCircle, tintColor: Color.Red },
  INITIALIZING: { source: Icon.Cog, tintColor: Color.Blue },
  NEEDS_APPROVAL: { source: Icon.AtSymbol, tintColor: Color.Yellow },
  QUEUED: { source: Icon.Hourglass, tintColor: Color.PrimaryText },
  REMOVED: { source: Icon.Trash, tintColor: Color.Red },
  REMOVING: { source: Icon.DeleteDocument, tintColor: Color.Orange },
  SKIPPED: { source: Icon.Forward, tintColor: Color.Purple },
  SLEEPING: { source: Icon.Moon, tintColor: Color.Blue },
  SUCCESS: { source: Icon.CheckCircle, tintColor: Color.Green },
  WAITING: { source: Icon.Clock, tintColor: Color.SecondaryText },
}

export const LOG_SEVERITY_TAG_PROPS: Record<string, { color: Color, text: string, icon: Icon }> = {
  info: { color: Color.Blue, text: "INFO", icon: Icon.Info },
  warning: { color: Color.Yellow, text: "WARNING", icon: Icon.Warning },
  error: { color: Color.Red, text: "ERROR", icon: Icon.Xmark },
}

export const PRICES: Record<Measuements, number> = {
  cpu: 0.000463,
  memory: 0.000231,
  network: 0.10,
  disk: 0.000005787037037
}