import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Users,
  CalendarDays,
  ClipboardList,
  FolderOpen,
  FileCheck,
  ChartNoAxesCombined,
  MessageCircle,
  User,
  Settings,
} from "lucide-react";
import "./Sidebar.css";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import useUnreadMessages from "./useUnreadMessages";
const teacherMenu = [
  {
    items: [
      {
        to: "/main",
        label: "Ana səhifə",
        icon: LayoutDashboard,
        end: true,
      },
      { to: "/teacher/notifications", label: "Bildirişlər", icon: Bell },
      { to: "/teacher/students", label: "Şagirdlər", icon: Users },
      { to: "/teacher/schedule", label: "Dərs cədvəli", icon: CalendarDays },
      { to: "/teacher/assignments", label: "Tapşırıqlar", icon: ClipboardList },
      { to: "/teacher/groups", label: "Qruplar", icon: Users },
      { to: "/teacher/materials", label: "Materiallar", icon: FolderOpen },
      { to: "/teacher/quizzes", label: "Sınaqlar", icon: FileCheck },
      {
        to: "/teacher/grades",
        label: "Qiymətləndirmə və nəticələr",
        icon: ChartNoAxesCombined,
      },
      {
        to: "/teacher/messages",
        label: "Mesajlar",
        icon: MessageCircle,
        badge: "messages",
      },
    ],
  },
  {
    divider: true,
    items: [
      { to: "/teacher/profile", label: "Profil", icon: User },
      { to: "/teacher/settings", label: "Ayarlar", icon: Settings },
    ],
  },
];

const studentMenu = [
  {
    title: "ÖYRƏNMƏ",
    items: [
      {
        to: "/main",
        label: "Ana səhifə",
        icon: LayoutDashboard,
        end: true,
      },
      { to: "/student/schedule", label: "Dərs cədvəlim", icon: CalendarDays },
      { to: "/student/assignments", label: "Tapşırıqlar", icon: ClipboardList },
      { to: "/student/quizzes", label: "Sınaqlarım", icon: FileCheck },
      { to: "/student/materials", label: "Materiallar", icon: FolderOpen },
      { to: "/student/groups", label: "Qruplarım", icon: Users },
    ],
  },
  {
    title: "şəxsi",
    items: [
      {
        to: "/student/results",
        label: "Nəticələrim",
        icon: ChartNoAxesCombined,
      },
      { to: "/student/notifications", label: "Bildirişlər", icon: Bell },
      {
        to: "/student/messages",
        label: "Mesajlar",
        icon: MessageCircle,
        badge: "messages",
      },
      { to: "/student/profile", label: "Profil", icon: User },
      { to: "/student/settings", label: "Ayarlar", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const [role, setRole] = useState(null);
  const unreadMessages = useUnreadMessages();
  const counts = { messages: unreadMessages };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setRole(data.session?.user?.user_metadata?.role ?? "student");
    });
  }, []);

  if (!role) return null;

  const menu = role === "teacher" ? teacherMenu : studentMenu;
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <svg className="brand-icon" width="34" height="34" viewBox="0 0 48 48">
          <path d="M12 21v9c0 4 5 7 12 7s12-3 12-7v-9l-12 6z" fill="#3d8fc6" />

          <path d="M24 6 45 15 24 24 3 15z" fill="#62b8e8" />

          <path
            d="M41 16.5v12"
            stroke="#62b8e8"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="41" cy="31" r="2.6" fill="#62b8e8" />
        </svg>
        <p className="cite-name">Dərsim</p>
      </div>

      <nav className="sidebar-nav">
        {menu.map((section, i) => (
          <div key={i} className="sidebar-section">
            {section.divider && <hr className="sidebar-divider" />}
            {section.title && (
              <span className="sidebar-title">{section.title}</span>
            )}
            {section.items.map(({ to, label, icon: Icon, end, badge }) => {
              const count = badge ? counts[badge] : 0;
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    "sidebar-link" + (isActive ? " active" : "")
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{label}</span>
                  {count > 0 && <span className="sidebar-badge">{count}</span>}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
