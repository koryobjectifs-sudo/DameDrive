export const ROLES = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  SECRETARY: 'Secretary',
  INSTRUCTOR: 'Instructor',
  ACCOUNTANT: 'Accountant',
  STANDARD_USER: 'Standard User',
};

// Granular permissions
export const PERMISSIONS = {
  // Students (Customers)
  STUDENTS_VIEW: 'students:view',
  STUDENTS_CREATE: 'students:create',
  STUDENTS_EDIT: 'students:edit',
  STUDENTS_DELETE: 'students:delete',
  STUDENTS_EXPORT: 'students:export',

  // Bookings
  BOOKINGS_VIEW: 'bookings:view',
  BOOKINGS_CREATE: 'bookings:create',
  BOOKINGS_EDIT: 'bookings:edit',
  BOOKINGS_CANCEL: 'bookings:cancel',
  BOOKINGS_EXPORT: 'bookings:export',

  // Finance/Payments
  PAYMENTS_VIEW: 'payments:view',
  PAYMENTS_RECORD: 'payments:record',
  PAYMENTS_REFUND: 'payments:refund',
  PAYMENTS_EXPORT: 'payments:export',
  INVOICES_CREATE: 'invoices:create',
  RECEIPTS_PRINT: 'receipts:print',

  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_DOWNLOAD: 'reports:download',

  // Admin & Settings
  USERS_MANAGE: 'users:manage',
  SETTINGS_EDIT: 'settings:edit',
  ROLES_MANAGE: 'roles:manage',
  INTEGRATIONS_MANAGE: 'integrations:manage',
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  
  // Instructors
  LESSONS_VALIDATE: 'lessons:validate',
  LESSONS_NOTES: 'lessons:notes',
  STUDENT_PROGRESS: 'student:progress',
};

export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: Object.values(PERMISSIONS), // Owner gets all

  [ROLES.MANAGER]: [
    PERMISSIONS.STUDENTS_VIEW, PERMISSIONS.STUDENTS_CREATE, PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.BOOKINGS_VIEW, PERMISSIONS.BOOKINGS_CREATE, PERMISSIONS.BOOKINGS_EDIT, PERMISSIONS.BOOKINGS_CANCEL,
    PERMISSIONS.REPORTS_VIEW, PERMISSIONS.INVOICES_CREATE,
  ],

  [ROLES.SECRETARY]: [
    PERMISSIONS.STUDENTS_VIEW, PERMISSIONS.STUDENTS_CREATE, PERMISSIONS.STUDENTS_EDIT,
    PERMISSIONS.BOOKINGS_VIEW, PERMISSIONS.BOOKINGS_CREATE,
    PERMISSIONS.PAYMENTS_RECORD, PERMISSIONS.RECEIPTS_PRINT,
  ],

  [ROLES.INSTRUCTOR]: [
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.LESSONS_VALIDATE, PERMISSIONS.LESSONS_NOTES, PERMISSIONS.STUDENT_PROGRESS,
  ],

  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.PAYMENTS_VIEW, PERMISSIONS.PAYMENTS_REFUND, PERMISSIONS.PAYMENTS_EXPORT,
    PERMISSIONS.INVOICES_CREATE, PERMISSIONS.REPORTS_VIEW, PERMISSIONS.REPORTS_DOWNLOAD,
  ],

  [ROLES.STANDARD_USER]: [
    // Standard User permissions are empty by default, assigned manually
  ],
};
