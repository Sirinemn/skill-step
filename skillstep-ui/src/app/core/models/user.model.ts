export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  targetRole: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
}

// Utilitaire — retourne le nom complet ou l'email si pas de nom
export function getDisplayName(user: User): string {
  if (user.firstName || user.lastName) {
    return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  }
  return user.email;
}