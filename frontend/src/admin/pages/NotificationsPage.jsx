import { useCallback, useEffect, useState } from "react";
import { Bell, Check, RefreshCw } from "lucide-react";
import { loadNotifications, markNotificationRead } from "../services/adminApi";
import { PageHeader, Button } from "../components/ui";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const refresh = useCallback(async () => {
    try {
      setNotifications(await loadNotifications());
    } catch (error) {
      alert(error.message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markAsRead = async (notification) => {
    try {
      await markNotificationRead(notification.id);
      setNotifications((list) => list.map((x) => (x.id === notification.id ? { ...x, read: true } : x)));
      window.dispatchEvent(new Event("ancps-store-change"));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Contributions, documents manquants et échéances."
        action={
          <Button variant="secondary" icon={RefreshCw} onClick={refresh}>
            Actualiser
          </Button>
        }
      />

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${n.read ? "opacity-60" : ""}`}>
            <div className="flex gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <Bell />
              </div>

              <div className="flex-1">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{n.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{n.text}</p>
                  </div>

                  {!n.read && (
                    <Button variant="soft" icon={Check} onClick={() => markAsRead(n)}>
                      Marquer lu
                    </Button>
                  )}
                </div>

                <p className="mt-3 text-xs text-gray-400">{n.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}