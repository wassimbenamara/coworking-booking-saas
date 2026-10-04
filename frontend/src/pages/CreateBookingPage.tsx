import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBookingSchema } from "@coworking/shared";

import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { createBooking } from "../services/booking.service";
import { getResourceAvailabilities } from "../services/resource-availability.service";
import type { ResourceAvailability } from "../types/resource-availability";
import PageNavigation from "@/components/navigation/PageNavigation";

export function CreateBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const resourceId = Number(id);

  const [availabilities, setAvailabilities] = useState<ResourceAvailability[]>(
    [],
  );

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken || !Number.isInteger(resourceId) || resourceId <= 0) {
      return;
    }

    const token: string = accessToken;

    async function loadAvailabilities() {
      try {
        const response = await getResourceAvailabilities(resourceId, token);

        setAvailabilities(response.availabilities);
      } catch {
        setError("Unable to load resource availability.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadAvailabilities();
  }, [accessToken, resourceId]);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    const token: string = accessToken;

    setError(null);
    setFieldErrors({});

    const validation = createBookingSchema.safeParse({
      resourceId,
      startsAt: startsAt ? new Date(startsAt).toISOString() : "",
      endsAt: endsAt ? new Date(endsAt).toISOString() : "",
    });

    if (!validation.success) {
      const errors = validation.error.issues.reduce<Record<string, string>>(
        (accumulator, issue) => {
          const field = issue.path[0];

          if (typeof field === "string" && !accumulator[field]) {
            accumulator[field] = issue.message;
          }

          return accumulator;
        },
        {},
      );

      setFieldErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);

      await createBooking(validation.data, token);

      navigate("/bookings");
    } catch (caughtError) {
      if (
        caughtError instanceof Error &&
        caughtError.message === "BOOKING_CONFLICT"
      ) {
        setError(
          "This booking conflicts with the resource availability or another booking.",
        );
      } else if (
        caughtError instanceof Error &&
        caughtError.message === "RESOURCE_NOT_FOUND"
      ) {
        setError("Resource not found.");
      } else {
        setError("Unable to create booking.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!Number.isInteger(resourceId) || resourceId <= 0) {
    return <p className="text-sm text-destructive">Invalid resource.</p>;
  }

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading availability...</p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageNavigation
        backTo="/coworking-spaces"
        backLabel="Back to coworking spaces"
      />

      <div>
        <h1 className="text-2xl font-semibold">Book resource</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose a start and end time inside an available range.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="font-medium">Available time ranges</h2>

        {availabilities.length > 0 ? (
          availabilities.map((availability) => (
            <div
              key={availability.id}
              className="rounded-md border p-3 text-sm"
            >
              {new Date(availability.startsAt).toLocaleString()}
              {" → "}
              {new Date(availability.endsAt).toLocaleString()}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No availability configured.
          </p>
        )}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="startsAt" className="text-sm font-medium">
            Start
          </label>

          <input
            id="startsAt"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          {fieldErrors.startsAt ? (
            <p className="text-sm text-destructive">{fieldErrors.startsAt}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="endsAt" className="text-sm font-medium">
            End
          </label>

          <input
            id="endsAt"
            type="datetime-local"
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />

          {fieldErrors.endsAt ? (
            <p className="text-sm text-destructive">{fieldErrors.endsAt}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || availabilities.length === 0}
        >
          {isSubmitting ? "Booking..." : "Create booking"}
        </Button>
      </form>
    </div>
  );
}
