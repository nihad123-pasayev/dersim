import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CalendarDays,
  Bell,
  MessageCircle,
  Users,
  BookOpen,
  Plus,
  Check,
  ArrowRight,
  UserPlus,
  CalendarPlus,
  TrendingUp,
  Search,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { supabase } from "../supabaseClient";
import "./MainPage.css";
import useUnreadMessages from "./useUnreadMessages";

/* ---------- nümunə data (sonra Supabase) ---------- */
const sampleLessons = {
  teacher: [
    {
      id: 1,
      start: "09:00",
      end: "10:00",
      subject: "Riyaziyyat",
      with: "Aysel Məmmədova",
    },
    {
      id: 2,
      start: "11:00",
      end: "12:30",
      subject: "Fizika",
      with: "11-A qrupu",
    },
    {
      id: 3,
      start: "15:00",
      end: "16:00",
      subject: "Riyaziyyat",
      with: "Orxan Quliyev",
    },
    {
      id: 4,
      start: "17:30",
      end: "18:30",
      subject: "Kimya",
      with: "Leyla Əliyeva",
    },
  ],
  student: [
    {
      id: 1,
      start: "10:00",
      end: "11:00",
      subject: "Riyaziyyat",
      with: "Nigar müəllimə",
    },
    {
      id: 2,
      start: "14:00",
      end: "15:30",
      subject: "Fizika",
      with: "Rauf müəllim",
    },
    {
      id: 3,
      start: "17:00",
      end: "18:00",
      subject: "İngilis dili",
      with: "Səbinə müəllimə",
    },
  ],
};

const sampleMessages = [
  {
    id: 1,
    from: "Aysel Məmmədova",
    text: "Salam, sabahkı dərs saat neçədədir?",
    time: "09:15",
    unread: true,
  },
  {
    id: 2,
    from: "Orxan Quliyev",
    text: "Tapşırığı göndərdim, baxarsınız.",
    time: "Dünən",
    unread: true,
  },
  {
    id: 3,
    from: "Leyla Əliyeva",
    text: "Təşəkkür edirəm, çox kömək oldu!",
    time: "Dünən",
    unread: false,
  },
  {
    id: 4,
    from: "11-A qrupu",
    text: "Dərsi cümə günü keçə bilərikmi?",
    time: "Bazar ertəsi",
    unread: false,
  },
];

const sampleReminders = [
  {
    id: 1,
    text: "Sabah üçün Fizika sınağı hazırla",
    when: "Sabah",
    done: false,
  },
  { id: 2, text: "Orxanın valideyni ilə danış", when: "Bu gün", done: false },
  { id: 3, text: "Yeni materialları yüklə", when: "Cümə", done: true },
];

const weekLessons = [3, 2, 4, 0, 3, 1, 0]; // B.e → Baz (təqvimdə dərs günləri)
const weekHours = [3, 2.5, 4, 0, 3, 1, 0];
const dayNames = ["B.e", "Ç.a", "Çər", "C.a", "Cüm", "Şən", "Baz"];
const avatarColors = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];
/* -------------------------------------------------- */

const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const lessonStatus = (l, now) => {
  if (now > toMin(l.end)) return "done";
  if (now >= toMin(l.start)) return "live";
  return "wait";
};

const statusText = { done: "Keçib", live: "Davam edir", wait: "Gözləyir" };

const remainingText = (l, now) => {
  const diff = toMin(l.start) - now;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? `${h} saat ${m} dəq sonra` : `${m} dəq sonra`;
};

const initials = (name) =>
  (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const greetingFor = (now) => {
  if (now < 12 * 60) return "Sabahınız xeyir";
  if (now < 17 * 60) return "Günortanız xeyir";
  return "Axşamınız xeyir";
};

function MeAvatar({ src, full, size = 40, className = "" }) {
  return (
    <span
      className={`me-avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {src ? <img src={src} alt="" /> : initials(full)}
    </span>
  );
}

function MiniCalendar() {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const view = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const first = (view.getDay() + 6) % 7; // bazar ertəsi = 0
  const daysInMonth = new Date(
    view.getFullYear(),
    view.getMonth() + 1,
    0,
  ).getDate();
  const isThisMonth = offset === 0;

  const cells = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const title = view.toLocaleDateString("az-AZ", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="card">
      <div className="card-head">
        <h2>
          <CalendarDays size={18} /> Təqvim
        </h2>
        <div className="cal-nav">
          <button
            type="button"
            onClick={() => setOffset(offset - 1)}
            aria-label="Əvvəlki ay"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setOffset(offset + 1)}
            aria-label="Növbəti ay"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="cal-title">{title}</p>
      <div className="cal-grid">
        {dayNames.map((d) => (
          <span key={d} className="cal-dayname">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} />;
          const weekday = (first + day - 1) % 7;
          const hasLesson = weekLessons[weekday] > 0;
          const isToday = isThisMonth && day === base.getDate();
          return (
            <span
              key={day}
              className={`cal-cell ${isToday ? "is-today" : ""} ${hasLesson ? "has-lesson" : ""}`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export default function MainPage() {
  const [role, setRole] = useState(null);
  const unread = useUnreadMessages();
  const [profile, setProfile] = useState({
    name: "",
    full: "",
    fenn: "",
    seher: "",
    avatar: "",
  });
  const [reminders, setReminders] = useState(sampleReminders);
  const [newReminder, setNewReminder] = useState("");
  const [now, setNow] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const meta = data.session?.user?.user_metadata;
      setRole(meta?.role ?? "student");
      const full = meta?.ad_soyad || meta?.istifadeci_adi || "";
      setProfile({
        full,
        name: full.split(" ")[0],
        fenn: meta?.fenn || "",
        seher: meta?.seher || "",
        avatar: meta?.avatar_url || "",
      });
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d.getHours() * 60 + d.getMinutes());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  if (!role) return null;

  const base = role === "teacher" ? "/teacher" : "/student";
  const lessons = sampleLessons[role];
  const doneCount = lessons.filter(
    (l) => lessonStatus(l, now) === "done",
  ).length;
  const nextLesson = lessons.find((l) => lessonStatus(l, now) !== "done");
  const todayIdx = (new Date().getDay() + 6) % 7;
  const maxHours = Math.max(...weekHours, 1);
  const totalHours = weekHours.reduce((a, b) => a + b, 0);
  const roleLabel =
    role === "teacher"
      ? profile.fenn
        ? `${profile.fenn} müəllimi`
        : "Müəllim"
      : "Şagird";

  const today = new Date().toLocaleDateString("az-AZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats =
    role === "teacher"
      ? [
          {
            label: "Şagird",
            value: 24,
            note: "+2 bu ay",
            icon: Users,
            color: "#0ea5e9",
          },
          {
            label: "Bu gün dərs",
            value: lessons.length,
            note: `${doneCount} keçib`,
            icon: CalendarDays,
            color: "#8b5cf6",
          },
          {
            label: "Bu həftə dərs",
            value: 14,
            note: `${totalHours} saat`,
            icon: BookOpen,
            color: "#10b981",
          },
          {
            label: "Oxunmamış mesaj",
            value: unread,
            note: "cavab gözləyir",
            icon: MessageCircle,
            color: "#f59e0b",
          },
        ]
      : [
          {
            label: "Bu gün dərs",
            value: lessons.length,
            note: `${doneCount} keçib`,
            icon: CalendarDays,
            color: "#8b5cf6",
          },
          {
            label: "Bu həftə dərs",
            value: 9,
            note: `${totalHours} saat`,
            icon: BookOpen,
            color: "#10b981",
          },
          {
            label: "Qruplarım",
            value: 2,
            note: "aktiv qrup",
            icon: Users,
            color: "#0ea5e9",
          },
          {
            label: "Oxunmamış mesaj",
            value: unread,
            note: "yeni mesaj",
            icon: MessageCircle,
            color: "#f59e0b",
          },
        ];

  const quick =
    role === "teacher"
      ? [
          { to: `${base}/students`, label: "Şagird əlavə et", icon: UserPlus },
          {
            to: `${base}/schedule`,
            label: "Dərs əlavə et",
            icon: CalendarPlus,
          },
          { to: `${base}/messages`, label: "Mesaj yaz", icon: MessageCircle },
        ]
      : [
          {
            to: `${base}/schedule`,
            label: "Dərs cədvəlim",
            icon: CalendarDays,
          },
          { to: `${base}/materials`, label: "Materiallar", icon: BookOpen },
          { to: `${base}/messages`, label: "Mesaj yaz", icon: MessageCircle },
        ];

  const toggleReminder = (id) =>
    setReminders((r) =>
      r.map((x) => (x.id === id ? { ...x, done: !x.done } : x)),
    );

  const deleteReminder = (id) =>
    setReminders((r) => r.filter((x) => x.id !== id));

  const addReminder = (e) => {
    e.preventDefault();
    const text = newReminder.trim();
    if (!text) return;
    setReminders((r) => [
      { id: Date.now(), text, when: "Bu gün", done: false },
      ...r,
    ]);
    setNewReminder("");
  };

  return (
    <div className="ana-sehife">
      <Sidebar />

      <main className="ana-sehife-content">
        {/* ---------- Üst panel ---------- */}
        <header className="topbar">
          <label className="search">
            <Search size={18} />
            <input placeholder="Şagird, dərs və ya material axtar..." />
          </label>

          <div className="topbar-right">
            <Link
              to={`${base}/notifications`}
              className="icon-btn"
              aria-label="Bildirişlər"
            >
              <Bell size={20} />
              {unread > 0 && <i className="icon-dot" />}
            </Link>

            <Link to={`${base}/profile`} className="user-chip">
              <MeAvatar src={profile.avatar} full={profile.full} size={40} />
              <div className="user-chip-text">
                <p className="user-name">{profile.full || "İstifadəçi"}</p>
                <p className="user-role">{roleLabel}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* ---------- Banner ---------- */}
        <section className="hero">
          <div className="hero-text">
            <p className="hero-date">{today}</p>
            <h1>
              {greetingFor(now)}
              {profile.name && `, ${profile.name}`}
            </h1>
            <p className="hero-sub">
              {lessons.length === 0
                ? "Bu gün dərsin yoxdur, rahat gün."
                : `Bu gün ${lessons.length} dərsin var, ${doneCount}-i artıq keçib.`}
            </p>
            <div className="hero-actions">
              {quick.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className="hero-btn">
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-next">
            <span className="hero-next-label">
              <Clock size={14} /> Növbəti dərs
            </span>
            {nextLesson ? (
              <>
                <p className="hero-next-subject">{nextLesson.subject}</p>
                <p className="hero-next-with">{nextLesson.with}</p>
                <div className="hero-next-foot">
                  <span>
                    {nextLesson.start} - {nextLesson.end}
                  </span>
                  <strong>
                    {lessonStatus(nextLesson, now) === "live"
                      ? "Davam edir"
                      : remainingText(nextLesson, now)}
                  </strong>
                </div>
              </>
            ) : (
              <p className="hero-next-with">Bu gün üçün dərs qalmayıb.</p>
            )}
          </div>
        </section>

        {/* ---------- Say kartları ---------- */}
        <section className="stats">
          {stats.map(({ label, value, note, icon: Icon, color }) => (
            <div key={label} className="stat" style={{ "--c": color }}>
              <div className="stat-icon">
                <Icon size={22} />
              </div>
              <div>
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
                <p className="stat-note">{note}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="grid">
          {/* ---------- Sol sütun ---------- */}
          <div className="col">
            <section className="card">
              <div className="card-head">
                <h2>
                  <CalendarDays size={18} /> Bu günün dərsləri
                </h2>
                <span className="chip">
                  {doneCount}/{lessons.length} tamamlanıb
                </span>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${lessons.length ? (doneCount / lessons.length) * 100 : 0}%`,
                  }}
                />
              </div>

              {lessons.length === 0 ? (
                <p className="muted">Bu gün dərs yoxdur.</p>
              ) : (
                <ul className="timeline">
                  {lessons.map((l) => {
                    const st = lessonStatus(l, now);
                    return (
                      <li key={l.id} className={`tl-item tl-${st}`}>
                        <span className="tl-time">{l.start}</span>
                        <span className="tl-dot" />
                        <div className="tl-card">
                          <div>
                            <p className="tl-subject">{l.subject}</p>
                            <p className="muted">{l.with}</p>
                          </div>
                          <div className="tl-right">
                            <span className="muted small">
                              {l.start} - {l.end}
                            </span>
                            <span className={`badge badge-${st}`}>
                              {statusText[st]}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <div className="row-2">
              <MiniCalendar />

              <section className="card">
                <div className="card-head">
                  <h2>
                    <TrendingUp size={18} /> Dərs saatları
                  </h2>
                  <span className="chip">{totalHours} saat</span>
                </div>
                <div className="bars">
                  {weekHours.map((h, i) => (
                    <div key={i} className="bar-col">
                      <div className="bar-track">
                        <div
                          className={`bar ${i === todayIdx ? "bar-today" : ""}`}
                          style={{ height: `${(h / maxHours) * 100}%` }}
                        />
                      </div>
                      <span className="bar-label">{dayNames[i]}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* ---------- Sağ sütun ---------- */}
          <div className="col">
            <section className="card profile-card">
              <div className="profile-cover" />
              <MeAvatar
                src={profile.avatar}
                full={profile.full}
                size={84}
                className="profile-avatar"
              />
              <h3 className="profile-name">{profile.full || "İstifadəçi"}</h3>
              <p className="muted">{roleLabel}</p>

              <div className="profile-tags">
                {role === "teacher" && profile.fenn && (
                  <span className="tag">
                    <GraduationCap size={14} /> {profile.fenn}
                  </span>
                )}
                {profile.seher && (
                  <span className="tag">
                    <MapPin size={14} /> {profile.seher}
                  </span>
                )}
              </div>

              <Link to={`${base}/profile`} className="profile-btn">
                Profilə keç <ArrowRight size={16} />
              </Link>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>
                  <MessageCircle size={18} /> Son mesajlar
                </h2>
                {unread > 0 && (
                  <span className="chip chip-hot">{unread} yeni</span>
                )}
              </div>
              <ul className="msgs">
                {sampleMessages.map((m, i) => (
                  <li key={m.id} className="msg">
                    <span
                      className="avatar"
                      style={{
                        background: avatarColors[i % avatarColors.length],
                      }}
                    >
                      {initials(m.from)}
                    </span>
                    <div className="msg-body">
                      <div className="msg-top">
                        <span
                          className={`msg-from ${m.unread ? "is-unread" : ""}`}
                        >
                          {m.from}
                        </span>
                        <span className="muted small">{m.time}</span>
                      </div>
                      <p className="msg-text">{m.text}</p>
                    </div>
                    {m.unread && <i className="dot" />}
                  </li>
                ))}
              </ul>
              <Link to={`${base}/messages`} className="card-link">
                Hamısına bax <ArrowRight size={15} />
              </Link>
            </section>

            <section className="card">
              <div className="card-head">
                <h2>
                  <Bell size={18} /> Xatırlatmalar
                </h2>
                <span className="chip">
                  {reminders.filter((r) => !r.done).length} aktiv
                </span>
              </div>

              <form className="rem-form" onSubmit={addReminder}>
                <input
                  value={newReminder}
                  onChange={(e) => setNewReminder(e.target.value)}
                  placeholder="Yeni xatırlatma yaz..."
                />
                <button type="submit" aria-label="Əlavə et">
                  <Plus size={18} />
                </button>
              </form>

              <ul className="rems">
                {reminders.map((r) => (
                  <li key={r.id} className={`rem ${r.done ? "is-done" : ""}`}>
                    <button
                      type="button"
                      className="check"
                      onClick={() => toggleReminder(r.id)}
                      aria-label="Tamamla"
                    >
                      {r.done && <Check size={14} />}
                    </button>
                    <span className="rem-text">{r.text}</span>
                    <span className="badge badge-wait">{r.when}</span>
                    <button
                      type="button"
                      className="rem-delete"
                      onClick={() => deleteReminder(r.id)}
                      aria-label="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
