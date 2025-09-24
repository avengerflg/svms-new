import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
  roles?: string[];
}

import {
  IconDashboard,
  IconUsers,
  IconUserCheck,
  IconShield,
  IconCalendar,
  IconSettings,
  IconReportAnalytics,
  IconBell,
  IconQrcode,
  IconCamera,
  IconId,
  IconClipboardList,
  IconUserPlus,
  IconClock,
  IconFile,
  IconSchool,
  IconAlertTriangle,
  IconEye,
  IconDownload,
  IconUserCog,
  IconBan,
  IconHistory,
  IconChartBar,
} from '@tabler/icons-react';

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Dashboard',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconDashboard,
    href: '/dashboard',
  },

  {
    navlabel: true,
    subheader: 'Visitor Management',
  },
  {
    id: uniqueId(),
    title: 'Visitors',
    icon: IconUsers,
    children: [
      {
        id: uniqueId(),
        title: 'All Visitors',
        icon: IconUsers,
        href: '/dashboard/visitors/all',
      },
      {
        id: uniqueId(),
        title: 'Check In/Out',
        icon: IconUserCheck,
        href: '/dashboard/visitors/checkin',
        roles: ['security', 'frontdesk', 'admin'],
      },
      {
        id: uniqueId(),
        title: 'Pre-Registration',
        icon: IconUserPlus,
        href: '/dashboard/visitors/pre-register',
      },
      {
        id: uniqueId(),
        title: 'Visitor Badges',
        icon: IconQrcode,
        href: '/dashboard/visitors/badges',
        roles: ['security', 'frontdesk', 'admin'],
      },
      {
        id: uniqueId(),
        title: 'Visitor History',
        icon: IconHistory,
        href: '/dashboard/visitors/history',
      },
    ],
  },

  {
    navlabel: true,
    subheader: 'Security & Verification',
    roles: ['admin', 'security'],
  },
  {
    id: uniqueId(),
    title: 'Security',
    icon: IconShield,
    roles: ['admin', 'security'],
    children: [
      {
        id: uniqueId(),
        title: 'ID Verification',
        icon: IconId,
        href: '/dashboard/security/id-verification',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Photo Capture',
        icon: IconCamera,
        href: '/dashboard/security/photo-capture',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'QR Code Scanner',
        icon: IconQrcode,
        href: '/dashboard/security/qr-scanner',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Blacklist',
        icon: IconBan,
        href: '/dashboard/security/blacklist',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Watchlist',
        icon: IconEye,
        href: '/dashboard/security/watchlist',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Audit Logs',
        icon: IconClipboardList,
        href: '/dashboard/security/audit-logs',
        roles: ['admin'],
      },
    ],
  },

  {
    navlabel: true,
    subheader: 'Staff & Appointments',
  },
  {
    id: uniqueId(),
    title: 'Staff Portal',
    icon: IconUserCog,
    children: [
      {
        id: uniqueId(),
        title: 'Staff Management',
        icon: IconUserCog,
        href: '/dashboard/staff/management',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Visitor Approvals',
        icon: IconUserCheck,
        href: '/dashboard/staff/approvals',
        roles: ['admin', 'teacher'],
      },
      {
        id: uniqueId(),
        title: 'Appointments',
        icon: IconCalendar,
        href: '/dashboard/staff/appointments',
      },
      {
        id: uniqueId(),
        title: 'Meeting Scheduler',
        icon: IconClock,
        href: '/dashboard/staff/scheduler',
        roles: ['admin', 'teacher'],
      },
    ],
  },

  {
    navlabel: true,
    subheader: 'Reports & Analytics',
  },
  {
    id: uniqueId(),
    title: 'Reports',
    icon: IconReportAnalytics,
    children: [
      {
        id: uniqueId(),
        title: 'Visitor Reports',
        icon: IconChartBar,
        href: '/dashboard/reports/visitors',
      },
      {
        id: uniqueId(),
        title: 'Visit Analytics',
        icon: IconReportAnalytics,
        href: '/dashboard/reports/analytics',
      },
      {
        id: uniqueId(),
        title: 'Staff Reports',
        icon: IconFile,
        href: '/dashboard/reports/staff',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Export Data',
        icon: IconDownload,
        href: '/dashboard/reports/export',
        roles: ['admin'],
      },
    ],
  },

  {
    navlabel: true,
    subheader: 'Communications',
  },
  {
    id: uniqueId(),
    title: 'Notifications',
    icon: IconBell,
    href: '/dashboard/notifications',
  },
  {
    id: uniqueId(),
    title: 'Alerts',
    icon: IconAlertTriangle,
    href: '/dashboard/alerts',
    roles: ['admin', 'security'],
  },

  {
    navlabel: true,
    subheader: 'Administration',
    roles: ['admin'],
  },
  {
    id: uniqueId(),
    title: 'School Settings',
    icon: IconSchool,
    href: '/dashboard/admin/school-settings',
    roles: ['admin'],
  },
  {
    id: uniqueId(),
    title: 'System Settings',
    icon: IconSettings,
    roles: ['admin'],
    children: [
      {
        id: uniqueId(),
        title: 'Visitor Categories',
        icon: IconClipboardList,
        href: '/dashboard/admin/visitor-categories',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Access Hours',
        icon: IconClock,
        href: '/dashboard/admin/access-hours',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Form Builder',
        icon: IconFile,
        href: '/dashboard/admin/form-builder',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Data Settings',
        icon: IconSettings,
        href: '/dashboard/admin/data-settings',
        roles: ['admin'],
      },
    ],
  },
];

export default Menuitems;
