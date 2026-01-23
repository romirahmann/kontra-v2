import { FaRegNewspaper, FaUserCircle } from "react-icons/fa";

import {
  FiHome,
  FiFileText,
  FiFolder,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
export const menus = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: FiHome,
    roles: ["ADMIN", "EDITOR"],
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: FaUserCircle,
    roles: ["ADMIN", "EDITOR", "MEMBER"],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FiFolder,
    roles: ["ADMIN"],
  },
  {
    label: "Articles Review",
    href: "/articles",
    icon: FaRegNewspaper,
    roles: ["ADMIN"],
    children: [
      {
        label: "List",
        href: "/admin/articles/redaktur",
        badge: "pending",
        description: "Artikel menunggu approval",
      },
      // {
      //   label: "Approval",
      //   href: "/admin/articles/approval",
      // },
    ],
  },

  {
    label: "Articles",
    icon: FiFileText,
    roles: ["EDITOR"],
    children: [
      {
        label: "My Articles",
        href: `/admin/articles/editor`,
      },
      {
        label: "Create Article",
        href: "/admin/articles/editor/create",
      },
    ],
  },

  {
    label: "Manage Users",
    roles: ["ADMIN"],
    icon: FiUsers,
    href: "/admin/users",
  },
];
