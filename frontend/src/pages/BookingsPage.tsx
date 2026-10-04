import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getMyBookings } from "@/services/booking.service";
import type { Booking } from "@/types/booking";
import PageNavigation from "@/components/navigation/PageNavigation";

export default function BookingsPage() {
  const { accessToken } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const token: string = accessToken;

    async function loadBookings() {
      try {
        setError(null);

        const response = await getMyBookings(token);

        setBookings(response.bookings);
      } catch {
        setError("Unable to load your bookings.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadBookings();
  }, [accessToken]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading bookings...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

        <PageNavigation />
      <div>
        <h1 className="text-2xl font-semibold">My bookings</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View your coworking reservations.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {bookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You do not have any bookings yet.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-lg border p-4">
              <div className="space-y-1">
                <h2 className="font-medium">{booking.resource.name}</h2>

                <p className="text-sm text-muted-foreground">
                  {booking.resource.type === "MEETING_ROOM"
                    ? "Meeting room"
                    : "Desk"}
                </p>

                {booking.resource.coworkingSpace ? (
                  <p className="text-sm text-muted-foreground">
                    {booking.resource.coworkingSpace.name}
                    {" — "}
                    {booking.resource.coworkingSpace.city}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 text-sm">
                <p>
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(booking.startsAt).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">End:</span>{" "}
                  {new Date(booking.endsAt).toLocaleString()}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
