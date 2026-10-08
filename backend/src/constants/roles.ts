export const USER_ROLES = {
  STUDENT: 'STUDENT',
  CLUB_ADMIN: 'CLUB_ADMIN',
  UNIVERSITY_ADMIN: 'UNIVERSITY_ADMIN'
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ALL_ROLES: UserRole[] = [
  USER_ROLES.STUDENT,
  USER_ROLES.CLUB_ADMIN,
  USER_ROLES.UNIVERSITY_ADMIN
];
