import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">
        Welcome, {user?.firstName}
      </h1>

      <p className="mt-2 text-muted-foreground">
        {user?.email}
      </p>

      <Button className="mt-6" onClick={logout}>
        Logout
      </Button>
    </main>
  );
}