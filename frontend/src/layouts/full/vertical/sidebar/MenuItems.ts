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
        href: '/visitors/all',
      },
      {
        id: uniqueId(),
        title: 'Check In/Out',
        icon: IconUserCheck,
        href: '/visitors/checkin',
        roles: ['security', 'frontdesk', 'admin'],
      },
      {
        id: uniqueId(),
        title: 'Pre-Registration',
        icon: IconUserPlus,
        href: '/visitors/pre-register',
      },
      {
        id: uniqueId(),
        title: 'Visitor Badges',
        icon: IconQrcode,
        href: '/visitors/badges',
        roles: ['security', 'frontdesk', 'admin'],
      },
      {
        id: uniqueId(),
        title: 'Visitor History',
        icon: IconHistory,
        href: '/visitors/history',
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
        href: '/security/id-verification',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Photo Capture',
        icon: IconCamera,
        href: '/security/photo-capture',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'QR Code Scanner',
        icon: IconQrcode,
        href: '/security/qr-scanner',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Blacklist',
        icon: IconBan,
        href: '/security/blacklist',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Watchlist',
        icon: IconEye,
        href: '/security/watchlist',
        roles: ['admin', 'security'],
      },
      {
        id: uniqueId(),
        title: 'Audit Logs',
        icon: IconClipboardList,
        href: '/security/audit-logs',
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
        href: '/staff/management',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Visitor Approvals',
        icon: IconUserCheck,
        href: '/staff/approvals',
        roles: ['admin', 'teacher'],
      },
      {
        id: uniqueId(),
        title: 'Appointments',
        icon: IconCalendar,
        href: '/staff/appointments',
      },
      {
        id: uniqueId(),
        title: 'Meeting Scheduler',
        icon: IconClock,
        href: '/staff/scheduler',
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
        href: '/reports/visitors',
      },
      {
        id: uniqueId(),
        title: 'Visit Analytics',
        icon: IconReportAnalytics,
        href: '/reports/analytics',
      },
      {
        id: uniqueId(),
        title: 'Staff Reports',
        icon: IconFile,
        href: '/reports/staff',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Export Data',
        icon: IconDownload,
        href: '/reports/export',
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
    href: '/notifications',
  },
  {
    id: uniqueId(),
    title: 'Alerts',
    icon: IconAlertTriangle,
    href: '/alerts',
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
    href: '/admin/school-settings',
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
        href: '/admin/visitor-categories',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Access Hours',
        icon: IconClock,
        href: '/admin/access-hours',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Form Builder',
        icon: IconFile,
        href: '/admin/form-builder',
        roles: ['admin'],
      },
      {
        id: uniqueId(),
        title: 'Data Settings',
        icon: IconSettings,
        href: '/admin/data-settings',
        roles: ['admin'],
      },
    ],
  },
];

export default Menuitems;
