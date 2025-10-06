// File: config/navLinks.ts
import { CiFolderOn, CiSettings } from 'react-icons/ci';
import { FaUsers, FaCalculator, FaShop } from 'react-icons/fa6';
import { GiNewspaper } from 'react-icons/gi';
import { GoPlus, GoPlusCircle, GoReport } from 'react-icons/go';
import { LuCalendarDays } from 'react-icons/lu';
import { MdDetails, MdOutlineCategory, MdOutlinePayments } from 'react-icons/md';
import { PiNewspaperThin } from 'react-icons/pi';
import { RiDashboardFill } from 'react-icons/ri';

interface NavLink {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
  subItems?: {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    roles: string[];
  }[];
}

// Navigation links for all roles
export const navLinks: NavLink[] = [
  // USER: Basic user functionality
  {
    name: 'My Profile',
    href: '/dashboard',
    icon: RiDashboardFill,
    roles: ['USER', 'SALESMAN', 'ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Order History',
    href: '/dashboard/order-list',
    icon: LuCalendarDays,
    roles: ['USER', 'SALESMAN', 'ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Password Change',
    href: '/dashboard/password',
    icon: CiSettings,
    roles: ['USER', 'SALESMAN', 'ADMIN', 'SUPER_ADMIN'],
  },
  // SALESMAN: Sales-related features
  {
    name: 'Manual Sales',
    href: '#',
    icon: GoPlusCircle,
    roles: ['SALESMAN', 'ADMIN', 'SUPER_ADMIN'],
    subItems: [
      {
        name: 'Add Sale',
        href: '/dashboard/add-sales',
        icon: GoPlus,
        roles: ['SALESMAN', 'ADMIN', 'SUPER_ADMIN'],
      },
      {
        name: 'Sale List',
        href: '/dashboard/sale-list',
        icon: MdDetails,
        roles: ['SALESMAN', 'ADMIN', 'SUPER_ADMIN'],
      },
      {
        name: 'Sales Report',
        href: '/dashboard/sales-report',
        icon: GoReport,
        roles: ['SALESMAN', 'ADMIN', 'SUPER_ADMIN'],
      },
    ],
  },
  // ADMIN & SUPER_ADMIN: Company management
  {
    name: 'Categories & Fragrances',
    href: '#',
    icon: MdOutlineCategory,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    subItems: [
      { name: 'Add Category', href: '/dashboard/categories/add', icon: GoPlusCircle, roles: ['ADMIN', 'SUPER_ADMIN'] },
      { name: 'Category List', href: '/dashboard/categories', icon: MdOutlineCategory, roles: ['ADMIN', 'SUPER_ADMIN'] },
      { name: 'Add Fragrance Family', href: '/dashboard/fragrance-families/add', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'] },
      { name: 'Fragrance Families List', href: '/dashboard/fragrance-families', icon: CiFolderOn, roles: ['ADMIN', 'SUPER_ADMIN'] },
      { name: 'Add Material', href: '/dashboard/materials/add', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'] },
      { name: 'Materials List', href: '/dashboard/materials', icon: CiFolderOn, roles: ['ADMIN', 'SUPER_ADMIN'] },
    ],
  },
  {
    name: 'Products',
    href: '#',
    icon: FaShop,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    subItems: [
      { name: 'Add Product', href: '/dashboard/products/add', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Product List', href: '/dashboard/products', icon: FaShop, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Add Variant (Size/Scent)', href: '/dashboard/variants/add', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Variants List', href: '/dashboard/variants', icon: MdDetails, roles: ['ADMIN', 'SUPER_ADMIN'], },
    ],
  },
  {
    name: 'Inventory',
    href: '#',
    icon: CiFolderOn,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    subItems: [
      { name: 'Stock Management', href: '/dashboard/stock-management', icon: MdDetails, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Low Stock Alerts', href: '/dashboard/low-stock-alerts', icon: GoReport, roles: ['ADMIN', 'SUPER_ADMIN'], },
    ],
  },
  {
    name: 'Suppliers',
    href: '#',
    icon: FaUsers,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    subItems: [
      { name: 'Add Supplier', href: '/dashboard/add-supplier', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Suppliers List', href: '/dashboard/suppliers-list', icon: FaUsers, roles: ['ADMIN', 'SUPER_ADMIN'], },
    ],
  },
  {
    name: 'Orders',
    href: '/dashboard/order-list',
    icon: MdOutlinePayments,
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Expenses',
    href: '#',
    icon: GoPlusCircle,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    subItems: [
      { name: 'Add Expense', href: '/dashboard/add-expense', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Expense List', href: '/dashboard/expense-list', icon: MdDetails, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Expenses Report', href: '/dashboard/expense-report', icon: GoReport, roles: ['ADMIN', 'SUPER_ADMIN'], },
    ],
  },
  {
    name: 'Promotions & Discounts',
    href: '#',
    icon: GoPlusCircle,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    subItems: [
      { name: 'Add Promotion', href: '/dashboard/add-promotion', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'Promotions List', href: '/dashboard/promotions-list', icon: MdDetails, roles: ['ADMIN', 'SUPER_ADMIN'], },
    ],
  },
  {
    name: 'Blog & Content',
    href: '#',
    icon: PiNewspaperThin,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    subItems: [
      { name: 'Add Blog', href: '/dashboard/add-blog', icon: GoPlus, roles: ['ADMIN', 'SUPER_ADMIN'], },
      { name: 'All Blogs', href: '/dashboard/all-blog', icon: GiNewspaper, roles: ['ADMIN', 'SUPER_ADMIN'], },
    ],
  },
  {
    name: 'Reviews & Ratings',
    href: '/dashboard/reviews',
    icon: FaUsers,
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Analytics & Reports',
    href: '/dashboard/analytics',
    icon: FaCalculator,
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Customers',
    href: '/dashboard/customer-list',
    icon: FaUsers,
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Profile',
    href: '/dashboard/admin-profile',
    icon: CiSettings,
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  {
    name: 'Passwords Change',
    href: '/dashboard/admin-passwords',
    icon: CiSettings,
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  // SUPER_ADMIN: Business-critical routes
  {
    name: 'Investors',
    href: '#',
    icon: FaUsers,
    roles: ['SUPER_ADMIN'],
    subItems: [
      { name: 'Add Investor', href: '/dashboard/investors/add', icon: GoPlus, roles: ['SUPER_ADMIN'] },
      { name: 'Investors List', href: '/dashboard/investors', icon: FaUsers, roles: ['SUPER_ADMIN'] },
    ],
  },
  {
    name: 'Financial Overview',
    href: '/dashboard/financial-overview',
    icon: FaCalculator,
    roles: ['SUPER_ADMIN'],
  },
  {
    name: 'Ledger & Accounting',
    href: '/dashboard/ledger',
    icon: FaCalculator,
    roles: ['SUPER_ADMIN'],
  },
  {
    name: 'User Management',
    href: '#',
    icon: FaUsers,
    roles: ['SUPER_ADMIN'],
    subItems: [
      { name: 'Add User', href: '/dashboard/users/add', icon: GoPlus, roles: ['SUPER_ADMIN'] },
      { name: 'Users List', href: '/dashboard/users', icon: FaUsers, roles: ['SUPER_ADMIN'] },
      { name: 'Assign Roles', href: '/dashboard/assign-roles', icon: CiSettings, roles: ['SUPER_ADMIN'] },
    ],
  },
];