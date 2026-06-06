import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Box,
  ChevronLeft,
  CircleCheckBig,
  Clock3,
  Globe,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Truck,
  UserCircle2,
  XCircle,
} from "lucide-react";

const ui = {
  en: {
    dir: "ltr",
    localeLabel: "EN",
    welcome: "Welcome back",
    role: "Patient",
    accountType: "Account Type",
    title: "Orders",
    subtitle: "Track and manage your orders",
    newOrder: "New Order",
    tabs: ["All", "Pending", "Processing", "Delivered", "Cancelled"],
    sidebar: [
      "Dashboard",
      "My Orders",
      "Saved Medicines",
      "Reminders",
      "Notifications",
    ],
    settings: "Settings",
    logout: "Log Out",
    order: "Order",
    delivered: "delivered",
    processing: "processing",
    pending: "pending",
    cancelled: "cancelled",
    progress: "Delivery Progress",
  },
  ar: {
    dir: "rtl",
    localeLabel: "ع",
    welcome: "مرحبا",
    role: "مريض",
    accountType: "نوع الحساب",
    title: "الطلبات",
    subtitle: "تتبع وإدارة طلباتك",
    newOrder: "طلب جديد",
    tabs: ["الكل", "معلق", "قيد المعالجة", "تم التوصيل", "ملغي"],
    sidebar: ["لوحة التحكم", "طلباتي", "الأدوية المحفوظة", "التذكيرات", "الإشعارات"],
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    order: "طلب",
    delivered: "تم التوصيل",
    processing: "قيد المعالجة",
    pending: "معلق",
    cancelled: "ملغي",
    progress: "تقدم التوصيل",
  },
};

const statusStyles = {
  delivered: {
    wrapper: "bg-emerald-50 text-emerald-600",
    pill: "bg-emerald-100 text-emerald-700",
  },
  processing: {
    wrapper: "bg-blue-50 text-blue-600",
    pill: "bg-blue-100 text-blue-700",
  },
  pending: {
    wrapper: "bg-amber-50 text-amber-600",
    pill: "bg-amber-100 text-amber-700",
  },
  cancelled: {
    wrapper: "bg-rose-50 text-rose-600",
    pill: "bg-rose-100 text-rose-700",
  },
};

const OrderIcon = ({ type, status }) => {
  const base =
    "h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm ring-1 ring-black/5";
  const styles = statusStyles[status] ?? statusStyles.pending;

  if (type === "truck") {
    return (
      <div className={`${base} ${styles.wrapper}`}>
        <Truck className="h-5 w-5" />
      </div>
    );
  }
  if (type === "clock") {
    return (
      <div className={`${base} ${styles.wrapper}`}>
        <Clock3 className="h-5 w-5" />
      </div>
    );
  }
  if (type === "x") {
    return (
      <div className={`${base} ${styles.wrapper}`}>
        <XCircle className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className={`${base} ${styles.wrapper}`}>
      <CircleCheckBig className="h-5 w-5" />
    </div>
  );
};

function App() {
  const [locale, setLocale] = useState("ar");
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const copy = ui[locale];
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const controller = new AbortController();

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/orders`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadOrders();

    return () => controller.abort();
  }, [apiUrl]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [activeTab, orders]);

  const sidebarItems = [
    { label: copy.sidebar[0], icon: LayoutDashboard, active: false },
    { label: copy.sidebar[1], icon: Box, active: true },
    { label: copy.sidebar[2], icon: Heart, active: false },
    { label: copy.sidebar[3], icon: Clock3, active: false },
    { label: copy.sidebar[4], icon: Bell, active: false },
  ];

  return (
    <div dir={copy.dir} className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={`hidden w-[292px] shrink-0 border-slate-200 bg-white/90 backdrop-blur xl:flex xl:flex-col ${
            locale === "ar" ? "border-l" : "border-r"
          }`}
        >
          <div className="flex items-center gap-3 px-6 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm">
              <Box className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-sky-600">PharmaLink</div>
            </div>
          </div>

          <div className="mx-3 rounded-3xl bg-gradient-to-r from-sky-50 to-blue-50 p-4 ring-1 ring-slate-200/70">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-slate-500">{copy.accountType}</div>
                <div className="font-semibold">{copy.role}</div>
              </div>
            </div>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      item.active
                        ? "bg-sky-50 text-sky-600 ring-1 ring-sky-100"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mt-auto space-y-2 border-t border-slate-200 p-4">
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100">
              <Settings className="h-4 w-4" />
              <span>{copy.settings}</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-500 hover:bg-rose-50">
              <LogOut className="h-4 w-4" />
              <span>{copy.logout}</span>
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3 xl:hidden">
              <button className="rounded-2xl p-2 text-slate-600 hover:bg-slate-100">
                <Menu className="h-5 w-5" />
              </button>
              <div className="text-lg font-bold text-sky-600">PharmaLink</div>
            </div>

            <div className="hidden xl:block">
              <div className="text-sm text-slate-500">{copy.welcome}</div>
              <div className="font-semibold">{copy.role}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocale((value) => (value === "ar" ? "en" : "ar"))}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Globe className="h-4 w-4" />
                {copy.localeLabel}
              </button>
              <button className="relative rounded-2xl p-2 text-slate-600 hover:bg-slate-100">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>
            </div>
          </header>

          <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{copy.title}</h1>
                <p className="mt-1 text-sm text-slate-500">{copy.subtitle}</p>
              </div>

              <button className="inline-flex items-center gap-2 self-start rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-105">
                <Plus className="h-4 w-4" />
                {copy.newOrder}
              </button>
            </div>

            <div className="rounded-3xl bg-slate-100/90 p-1 ring-1 ring-slate-200/70">
              <div className="flex flex-wrap gap-1">
                {copy.tabs.map((tab, idx) => {
                  const value = idx === 0 ? "all" : ["pending", "processing", "delivered", "cancelled"][idx - 1];
                  const active = activeTab === value;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(value)}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
                  Loading orders...
                </div>
              )}

              {error && (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-sm">
                  {error}
                </div>
              )}

              {filteredOrders.map((order) => {
                const styles = statusStyles[order.status] ?? statusStyles.pending;
                const statusText = copy[order.status] ?? order.status;
                return (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <OrderIcon type={order.icon} status={order.status} />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 text-sm sm:text-base">
                              <span className="font-semibold text-slate-900">{copy.order} #{order.id}</span>
                              <span className="text-slate-300">—</span>
                              <span className="truncate text-slate-600">{order.pharmacy}</span>
                            </div>
                            <div className="mt-1 text-xs text-slate-400">{order.date}</div>
                          </div>

                          <div className={`text-right ${copy.dir === "rtl" ? "md:text-left" : "md:text-right"}`}>
                            <div className="text-xl font-bold tracking-tight">{order.amount}</div>
                            <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles.pill}`}>
                              {statusText}
                            </span>
                          </div>
                        </div>

                        {(order.status === "processing" || order.status === "pending") && (
                          <div className="mt-4">
                            <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                              <span>{copy.progress}</span>
                              <span>{order.progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400"
                                style={{ width: `${order.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 text-slate-300">
                        <ChevronLeft className={`h-5 w-5 ${copy.dir === "rtl" ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
