export interface InviteResponse {
  id: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  token: string;
  expiresAt: Date;
}

interface InviteInput {
  id: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "STAFF";
  token: string;
  expiresAt: Date;
}

export const toInviteResponse = (invite: InviteInput): InviteResponse => ({
  id: invite.id,
  email: invite.email,
  role: invite.role,
  token: invite.token,
  expiresAt: invite.expiresAt,
});
