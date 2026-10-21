// Production and preview have separate Clerk user stores. Bootstrap only the
// owner-controlled allowlist identity; never copy passwords, IDs, or test users.
type Identity = {
  primaryEmailAddress: {
    emailAddress: string;
    verification: { status: string } | null;
  } | null;
};

type Directory = {
  find: (email: string) => Promise<{ data: Identity[] }>;
  create: (options: {
    emailAddress: string[];
    skipPasswordRequirement: true;
  }) => Promise<Identity>;
};

export type BootstrapStatus =
  | "skipped-development"
  | "existing"
  | "existing-needs-review"
  | "created";

function inspectExisting(identity: Identity, email: string): BootstrapStatus {
  const primary = identity.primaryEmailAddress;
  return primary?.emailAddress.trim().toLowerCase() === email &&
    primary.verification?.status === "verified"
    ? "existing"
    : "existing-needs-review";
}

export async function bootstrapAdminIdentity(
  environment: string | undefined,
  configuredEmail: string | undefined,
  directory: Directory,
): Promise<BootstrapStatus> {
  if (environment !== "production") return "skipped-development";

  const email = configuredEmail?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid ADMIN_EMAIL is required for admin bootstrap");
  }

  const existing = await directory.find(email);
  if (existing.data.length > 1) {
    throw new Error("Admin identity is ambiguous; manual review is required");
  }
  if (existing.data.length === 1) {
    // Do not change existing passwords, verification, bans, or account settings.
    return inspectExisting(existing.data[0], email);
  }

  try {
    await directory.create({
      emailAddress: [email],
      // No shared/default password. The owner must authenticate through Google
      // or an email code, and can set a production password through Clerk.
      skipPasswordRequirement: true,
    });
    return "created";
  } catch {
    // Autoscale instances can start concurrently. Another instance may have
    // created this same identity after our lookup; never create a second one.
    const afterRace = await directory.find(email);
    if (afterRace.data.length === 1) {
      return inspectExisting(afterRace.data[0], email);
    }
    throw new Error("Production admin identity creation failed");
  }
}
