export const siteConfig = {
  name: 'Admin Dashboard',
  description: 'Admin dashboard for managing campaigns, users, and system settings',
  loginLogo: '/logo.svg',
  sidebarLogo: '/logo-small.svg',
  table: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },
} as const;
