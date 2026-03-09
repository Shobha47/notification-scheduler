"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
  UserIcon,
  ShootingStarIcon,
  AlertIcon,
  AngleDownIcon,
  AngleUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  AudioIcon,
  BoltIcon,
  ChatIcon,
  DocsIcon,
  EnvelopeIcon,
  FileIcon,
  GroupIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  MoreDotIcon,
  PaperPlaneIcon,
  PlusIcon,
  PencilIcon,
  TaskIcon,
  TimeIcon,
  TrashBinIcon,
  VideoIcon,
} from "../icons/index";
import SidebarWidget from "./SidebarWidget";
import { path } from "pdfkit";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[]; // add allowed roles here
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
    // subItems: [{ name: "Ecommerce", path: "/dashboard", pro: false }],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/dashboard/calendar",
    roles: [], // allowed roles
  },
  {
    icon: <EnvelopeIcon />,
    name: "Profile",
    path: "/dashboard/profile",
  },
  {
    icon: <UserIcon />,
    name: "Reminder",
    path: "/dashboard/reminder",
    subItems: [
      { name: "Reminder List", path: "/dashboard/reminder" },
      { name: "Create Reminder", path: "/dashboard/reminder/create" },
    ],
  },
  {
    icon: <UserIcon />,
    name: "Admission",
    path: "/dashboard/admission",
    roles: ["ADMIN"], // allowed roles
  },
  {
    icon: <DocsIcon />,
    name: "Students",
    path: "/dashboard/student",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
  },
  {
    icon: <ShootingStarIcon />,
    name: "Student Course",
    path: "/dashboard/student-course",
    roles: ["ADMIN", "FRONT_DESK", "FACULTY"], // allowed roles
  },
  {
    icon: <BoltIcon />,
    name: "Payment",
    path: "/dashboard/payment",
    roles: ["ADMIN", "ACCOUNTANT"], // allowed roles
  },
  {
    icon: <TaskIcon />,
    name: "Batch",
    path: "/dashboard/batch",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
    // subItems: [
    //   { name: "Batch List", path: "/dashboard/batch" },
    //   { name: "Create Batch", path: "/dashboard/batch/create" },
    // ],
  },

  {
    icon: <LockIcon />,
    name: "Course",
    path: "/dashboard/course",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
    subItems: [
      { name: "Course List", path: "/dashboard/course" },
      { name: "Create Course", path: "/dashboard/course/create" },
    ],
  },
  {
    icon: <LockIcon />,
    name: "Lab",
    path: "/dashboard/lab",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
    subItems: [
      { name: "Lab List", path: "/dashboard/lab" },
      { name: "Create Lab", path: "/dashboard/lab/create" },
    ],
  },
  {
    icon: <PaperPlaneIcon />,
    name: "Faculty",
    path: "/dashboard/faculty",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
    subItems: [
      { name: "Faculty List", path: "/dashboard/faculty" },
      { name: "Create Faculty", path: "/dashboard/faculty/create" },
    ],
  },
  {
    icon: <LockIcon />,
    name: "Activity Logs",
    path: "/dashboard/activity",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
  },
  {
    icon: <LockIcon />,
    name: "Roles",
    path: "/dashboard/roles",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
    subItems: [
      { name: "Roles List", path: "/dashboard/roles" },
      { name: "Create Roles", path: "/dashboard/roles/create" },
    ],
  },
  {
    icon: <LockIcon />,
    name: "Attendance",
    path: "/dashboard/attendance",
    roles: ["ADMIN", "FACULTY"], // allowed roles
  },
  {
    icon: <LockIcon />,
    name: "Notification",
    path: "/dashboard/notification",
    roles: ["ADMIN", "FRONT_DESK"], // allowed roles
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
    roles: [], // allowed roles
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
    roles: [], // allowed roles
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    roles: [], // allowed roles
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
  {
    icon: <GridIcon />,
    name: "Company",
    path: "/master-dashboard",
    roles: ["MASTER_ADMIN"], // allowed roles
    subItems: [
      { name: "Company List", path: "/master-dashboard" },
      { name: "Create Company", path: "/master-dashboard/company" },
    ],
  },
  {
    icon: <EnvelopeIcon />,
    name: "Profile",
    path: "/master-dashboard/profile",
    roles: ["MASTER_ADMIN"], // allowed roles
  },
];

const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const userRole = user?.role;

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  const filteredOthersItems = othersItems.filter(
    (item) => !item.roles || item.roles.includes(userRole),
  );

  const renderMenuItems = (
    filteredNavItems: NavItem[],
    menuType: "main" | "others",
  ) => (
    <ul className="flex flex-col gap-4">
      {filteredNavItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
                // <span className="menu-item-text flex w-full items-center justify-between pr-2">
                //   <span>{nav.name}</span>

                //   {shortcuts[nav.name] && (
                //     <span className="text-[10px] opacity-70">
                //       {shortcuts[nav.name]}
                //     </span>
                //   )}
                // </span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "text-brand-500 rotate-180"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {/* {shortcuts[nav.name] && (
                  <span className="text-[10px] opacity-70">{shortcuts[nav.name]}</span>
                )} */}
                {/* {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex justify-between items-center w-full pr-2">
                    <span>{nav.name}</span>

                    {shortcuts[nav.name] && (
                      <span className="text-[10px] opacity-70">
                        {shortcuts[nav.name]}
                      </span>
                    )}
                  </span>
                )} */}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 ml-9 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      {/* {shortcuts[subItem.name] && (
                        <span className="text-[10px] opacity-70">
                          {shortcuts[subItem.name]}
                        </span>
                      )} */}

                      {/* <span className="menu-item-text flex w-full items-center justify-between pr-2">
                        {subItem.name}

                        {shortcuts[subItem.name] && (
                          <span className="text-[10px] opacity-70">
                            {shortcuts[subItem.name]}
                          </span>
                        )}
                      </span> */}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items =
        menuType === "main" ? filteredNavItems : filteredOthersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-90 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredNavItems, "main")}
            </div>

            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(filteredOthersItems, "others")}
            </div> */}
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
