import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

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


<div className="flex flex-wrap gap-3">
  <Link
    to="/coworking-spaces"
    className={buttonVariants()}
  >
    Browse coworking spaces
  </Link>

  <Link
    to="/bookings"
    className={buttonVariants({
      variant: "outline",
    })}
  >
    My bookings
  </Link>
</div>

      <Button className="mt-6" onClick={logout}>
        Logout
      </Button>
    </main>
  );
}