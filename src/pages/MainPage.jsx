import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock, CalendarDays, Bell, MessageCircle, Users, BookOpen, Plus, Check,
  ArrowRight, UserPlus, CalendarPlus, TrendingUp, Search, MapPin,
  GraduationCap, ChevronLeft, ChevronRight, Trash2, BellOff, Inbox,
} from "lucide-react";
import Sidebar from "./Sidebar";
import useUnreadMessages from "./useUnreadMessages";
import { supabase } from "../supabaseClient";
import "./MainPage.css";

/* ---------- data (hələlik boş, sonra Supabase) ---------- */
const lessons = []; // { id, start: "09:00", end: "10:00", subject, with }
const messages = []; // { id, from, text, time, unread }
const weekHours = [0, 0, 0, 0, 0, 0, 0]; // B.e → Baz
const counts = { students: 0, weekLessons: 0, groups: 0 };
/* ------------------------------------------------------- */

const dayNames = ["B.e", "Ç.a", "Çər", "C.a", "Cüm", "Şən", "Baz"];
const avatarColors = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

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
  (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

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

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon size={22} />
      </span>
      <p className="empty-title">{title}</p>
      {text && <p className="empty-text">{text}</p>}
    </div>
  );
}

function MiniCalendar() {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const view = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const first = (view.getDay() + 6) % 7; // bazar ertəsi = 0
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const isThisMonth = offset === 0;

  const cells = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const title = view.toLocaleDateString("az-AZ", { month: "long", year: "numeric" });

  return (
    <section className="card">
      <div className="card-head">
        <h2><CalendarDays size={18} /> Təqvim</h2>
        <div className="cal-nav">
          <button type="button" onClick={() => setOffset(offset - 1)} aria-label="Əvvəlki ay">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => setOffset(offset + 1)} aria-label="Növbəti ay">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="cal-title">{title}</p>
      <div className="cal-grid">
        {dayNames.map((d) => (
          <span key={d} className="cal-dayname">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} />;
          const isToday = isThisMonth && day === base.getDate();
          return (
            <span key={day} className={`cal-cell ${isToday ? "is-today" : ""}`}>
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
  const [profile, setProfile] = useState({ name: "", full: "", fenn: "", seher: "", avatar: "" });
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const unread = useUnreadMessages();
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
  const doneCount = lessons.filter((l) => lessonStatus(l, now) === "done").length;
  const nextLesson = lessons.find((l) => lessonStatus(l, now) !== "done");
  const todayIdx = (new Date().getDay() + 6) % 7;
  const maxHours = Math.max(...weekHours, 1);
  const totalHours = weekHours.reduce((a, b) => a + b, 0);
  const roleLabel =
    role === "teacher"
      ? profile.fenn ? `${profile.fenn} müəllimi` : "Müəllim"
      : "Şagird";

  const today = new Date().toLocaleDateString("az-AZ", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const stats =
    role === "teacher"
      ? [
          { label: "Şagird", value: counts.students, icon: Users, color: "#0ea5e9" },
          { label: "Bu gün dərs", value: lessons.length, icon: CalendarDays, color: "#8b5cf6" },
          { label: "Bu həftə dərs", value: counts.weekLessons, icon: BookOpen, color: "#10b981" },
          { label: "Oxunmamış mesaj", value: unread, icon: MessageCircle, color: "#f59e0b" },
        ]
      : [
          { label: "Bu gün dərs", value: lessons.length, icon: CalendarDays, color: "#8b5cf6" },
          { label: "Bu həftə dərs", value: counts.weekLessons, icon: BookOpen, color: "#10b981" },
          { label: "Qruplarım", value: counts.groups, icon: Users, color: "#0ea5e9" },
          { label: "Oxunmamış mesaj", value: unread, icon: MessageCircle, color: "#f59e0b" },
        ];

  const quick =
    role === "teacher"
      ? [
          { to: `${base}/students`, label: "Şagird əlavə et", icon: UserPlus },
          { to: `${base}/schedule`, label: "Dərs əlavə et", icon: CalendarPlus },
          { to: `${base}/messages`, label: "Mesaj yaz", icon: MessageCircle },
        ]
      : [
          { to: `${base}/schedule`, label: "Dərs cədvəlim", icon: CalendarDays },
          { to: `${base}/materials`, label: "Materiallar", icon: BookOpen },
          { to: `${base}/messages`, label: "Mesaj yaz", icon: MessageCircle },
        ];

  const toggleReminder = (id) =>
    setReminders((r) => r.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const deleteReminder = (id) =>
    setReminders((r) => r.filter((x) => x.id !== id));

  const addReminder = (e) => {
    e.preventDefault();
    const text = newReminder.trim();
    if (!text) return;
    setReminders((r) => [{ id: Date.now(), text, when: "Bu gün", done: false }, ...r]);
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
            <Link to={`${base}/notifications`} className="icon-btn" aria-label="Bildirişlər">
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
                ? "Bu gün üçün planlaşdırılmış dərsin yoxdur."
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
                  <span>{nextLesson.start} - {nextLesson.end}</span>
                  <strong>
                    {lessonStatus(nextLesson, now) === "live"
                      ? "Davam edir"
                      : remainingText(nextLesson, now)}
                  </strong>
                </div>
              </>
            ) : (
              <>
                <p className="hero-next-subject">Dərs yoxdur</p>
                <p className="hero-next-with">Yaxın vaxtda planlaşdırılmış dərs görünmür.</p>
              </>
            )}
          </div>
        </section>

        {/* ---------- Say kartları ---------- */}
        <section className="stats">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat" style={{ "--c": color }}>
              <div className="stat-icon">
                <Icon size={22} />
              </div>
              <div>
                <p className="stat-value">{value}</p>
                <p className="stat-label">{label}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="grid">
          {/* ---------- Sol sütun ---------- */}
          <div className="col">
            <section className="card">
              <div className="card-head">
                <h2><CalendarDays size={18} /> Bu günün dərsləri</h2>
                {lessons.length > 0 && (
                  <span className="chip">{doneCount}/{lessons.length} tamamlanıb</span>
                )}
              </div>

              {lessons.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="Bu gün dərs yoxdur"
                  text={
                    role === "teacher"
                      ? "Dərs cədvəlinə dərs əlavə etdikdə burada görünəcək."
                      : "Müəllimin əlavə etdiyi dərslər burada görünəcək."
                  }
                />
              ) : (
                <>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${(doneCount / lessons.length) * 100}%` }}
                    />
                  </div>
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
                              <span className="muted small">{l.start} - {l.end}</span>
                              <span className={`badge badge-${st}`}>{statusText[st]}</span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </section>

            <div className="row-2">
              <MiniCalendar />

              <section className="card">
                <div className="card-head">
                  <h2><TrendingUp size={18} /> Dərs saatları</h2>
                  <span className="chip">{totalHours} saat</span>
                </div>
                {totalHours === 0 ? (
                  <EmptyState
                    icon={TrendingUp}
                    title="Bu həftə dərs yoxdur"
                    text="Dərs keçdikcə saatlar burada görünəcək."
                  />
                ) : (
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
                )}
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
                  <span className="tag"><GraduationCap size={14} /> {profile.fenn}</span>
                )}
                {profile.seher && (
                  <span className="tag"><MapPin size={14} /> {profile.seher}</span>
                )}
              </div>

              <Link to={`${base}/profile`} className="profile-btn">
                Profilə keç <ArrowRight size={16} />
              </Link>
            </section>

            <section className="card">
              <div className="card-head">
                <h2><MessageCircle size={18} /> Son mesajlar</h2>
                {unread > 0 && <span className="chip chip-hot">{unread} yeni</span>}
              </div>

              {messages.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="Mesajınız yoxdur"
                  text="Yeni mesajlar burada görünəcək."
                />
              ) : (
                <>
                  <ul className="msgs">
                    {messages.map((m, i) => (
                      <li key={m.id} className="msg">
                        <span
                          className="avatar"
                          style={{ background: avatarColors[i % avatarColors.length] }}
                        >
                          {initials(m.from)}
                        </span>
                        <div className="msg-body">
                          <div className="msg-top">
                            <span className={`msg-from ${m.unread ? "is-unread" : ""}`}>{m.from}</span>
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
                </>
              )}
            </section>

            <section className="card">
              <div className="card-head">
                <h2><Bell size={18} /> Xatırlatmalar</h2>
                {reminders.length > 0 && (
                  <span className="chip">{reminders.filter((r) => !r.done).length} aktiv</span>
                )}
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

              {reminders.length === 0 ? (
                <EmptyState
                  icon={BellOff}
                  title="Xatırlatma yoxdur"
                  text="Yuxarıdan yeni xatırlatma əlavə edə bilərsən."
                />
              ) : (
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
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}