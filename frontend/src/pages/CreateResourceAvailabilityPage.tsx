import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createResourceAvailabilitySchema } from "@coworking/shared";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { createResourceAvailability } from "@/services/resource-availability.service";

export default function CreateResourceAvailabilityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const resourceId = Number(id);

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    const token: string = accessToken;

    setError(null);
    setFieldErrors({});

    const validation = createResourceAvailabilitySchema.safeParse({
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

      await createResourceAvailability(validation.data, token);

      navigate(-1);
    } catch (caughtError) {
      if (
        caughtError instanceof Error &&
        caughtError.message === "AVAILABILITY_CONFLICT"
      ) {
        setError("This availability overlaps an existing time range.");
      } else if (
        caughtError instanceof Error &&
        caughtError.message === "RESOURCE_NOT_FOUND"
      ) {
        setError("Resource not found.");
      } else {
        setError("Unable to create availability.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!Number.isInteger(resourceId) || resourceId <= 0) {
    return <p className="text-sm text-destructive">Invalid resource.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add availability</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Define when this resource can be booked.
        </p>
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Add availability"}
        </Button>
      </form>
    </div>
  );
}
