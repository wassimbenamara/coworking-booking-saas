import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/contexts/AuthContext";

import { getCoworkingResources } from "@/services/coworking-resource.service";
import { getCoworkingSpaceById } from "@/services/coworking-space.service";
import { getResourceAvailabilities } from "@/services/resource-availability.service";

import type { CoworkingResource } from "@/types/coworking-resource";
import type { CoworkingSpace } from "@/types/coworking-space";
import type { ResourceAvailability } from "@/types/resource-availability";
import PageNavigation from "@/components/navigation/PageNavigation";

export default function CoworkingSpaceDetailsPage() {
  const { id } = useParams();
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  const [coworkingSpace, setCoworkingSpace] = useState<CoworkingSpace | null>(
    null,
  );

  const [resources, setResources] = useState<CoworkingResource[]>([]);

  const [resourceAvailabilities, setResourceAvailabilities] = useState<
    Record<number, ResourceAvailability[]>
  >({});

  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [availabilitiesLoading, setAvailabilitiesLoading] = useState(false);

  const [error, setError] = useState("");
  const [resourcesError, setResourcesError] = useState("");
  const [availabilitiesError, setAvailabilitiesError] = useState("");

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    async function loadPage() {
      const coworkingSpaceId = Number(id);

      if (!Number.isInteger(coworkingSpaceId) || coworkingSpaceId <= 0) {
        setError("Invalid coworking space.");
        setIsLoading(false);
        setResourcesLoading(false);
        return;
      }

      if (!accessToken) {
        setError("Authentication required.");
        setIsLoading(false);
        setResourcesLoading(false);
        return;
      }

      const token: string = accessToken;

      try {
        setError("");
        setResourcesError("");

        const coworkingSpaceData = await getCoworkingSpaceById(
          coworkingSpaceId,
          token,
        );

        setCoworkingSpace(coworkingSpaceData);

        try {
          const resourcesData = await getCoworkingResources(
            coworkingSpaceId,
            token,
          );

          setResources(resourcesData);
        } catch (resourceError) {
          if (
            resourceError instanceof Error &&
            resourceError.message === "UNAUTHORIZED"
          ) {
            setResourcesError("Your session has expired.");
          } else {
            setResourcesError("Unable to load coworking resources.");
          }
        } finally {
          setResourcesLoading(false);
        }
      } catch (caughtError) {
        if (
          caughtError instanceof Error &&
          caughtError.message === "UNAUTHORIZED"
        ) {
          setError("Your session has expired.");
        } else if (
          caughtError instanceof Error &&
          caughtError.message === "COWORKING_SPACE_NOT_FOUND"
        ) {
          setError("Coworking space not found.");
        } else {
          setError("Unable to load coworking space.");
        }

        setResourcesLoading(false);
      } finally {
        setIsLoading(false);
      }
    }

    void loadPage();
  }, [id, accessToken, isAuthLoading]);

  useEffect(() => {
    if (!accessToken || resources.length === 0) {
      setResourceAvailabilities({});
      return;
    }

    const token: string = accessToken;

    async function loadAvailabilities() {
      try {
        setAvailabilitiesLoading(true);
        setAvailabilitiesError("");

        const entries = await Promise.all(
          resources.map(async (resource) => {
            try {
              const response = await getResourceAvailabilities(
                resource.id,
                token,
              );

              return [resource.id, response.availabilities] as const;
            } catch {
              return [resource.id, []] as const;
            }
          }),
        );

        setResourceAvailabilities(Object.fromEntries(entries));
      } catch {
        setAvailabilitiesError("Unable to load resource availabilities.");
        setResourceAvailabilities({});
      } finally {
        setAvailabilitiesLoading(false);
      }
    }

    void loadAvailabilities();
  }, [accessToken, resources]);

  if (isAuthLoading || isLoading) {
    return (
      <main className="p-6">
        <p>Loading coworking space...</p>
      </main>
    );
  }

  if (error || !coworkingSpace) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="space-y-4">
          <p className="text-red-600">
            {error || "Coworking space not found."}
          </p>

          <PageNavigation
            backTo="/coworking-spaces"
            backLabel="Back to coworking spaces"
          />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link
        to="/coworking-spaces"
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Back to coworking spaces
      </Link>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-3xl">{coworkingSpace.name}</CardTitle>

          <CardDescription>
            {coworkingSpace.city}, {coworkingSpace.country}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h2 className="font-medium">Description</h2>

            <p className="mt-1 text-muted-foreground">
              {coworkingSpace.description ?? "No description available."}
            </p>
          </div>

          <div>
            <h2 className="font-medium">Address</h2>

            <p className="mt-1 text-muted-foreground">
              {coworkingSpace.address}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="mt-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Resources</h2>

            <p className="text-muted-foreground">
              Available desks and meeting rooms.
            </p>
          </div>

          <Link
            to={`/coworking-spaces/${coworkingSpace.id}/resources/new`}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Add resource
          </Link>
        </div>

        {resourcesLoading ? (
          <p>Loading resources...</p>
        ) : resourcesError ? (
          <p className="text-red-600">{resourcesError}</p>
        ) : resources.length === 0 ? (
          <p className="text-muted-foreground">No resources available yet.</p>
        ) : (
          <>
            {availabilitiesError ? (
              <p className="text-sm text-red-600">{availabilitiesError}</p>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              {resources.map((resource) => {
                const availabilities =
                  resourceAvailabilities[resource.id] ?? [];

                const hasAvailabilities = availabilities.length > 0;

                return (
                  <Card key={resource.id}>
                    <CardHeader>
                      <CardTitle>{resource.name}</CardTitle>

                      <CardDescription>
                        {resource.type === "DESK" ? "Desk" : "Meeting room"}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5">
                      <p>Capacity: {resource.capacity}</p>

                      <div className="space-y-2">
                        <h3 className="font-medium">Available time ranges</h3>

                        {availabilitiesLoading ? (
                          <p className="text-sm text-muted-foreground">
                            Loading availability...
                          </p>
                        ) : hasAvailabilities ? (
                          <div className="space-y-2">
                            {availabilities.map((availability) => (
                              <div
                                key={availability.id}
                                className="rounded-md border p-3 text-sm text-muted-foreground"
                              >
                                {new Date(
                                  availability.startsAt,
                                ).toLocaleString()}
                                {" → "}
                                {new Date(availability.endsAt).toLocaleString()}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No availability configured.
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/coworking-resources/${resource.id}/availabilities/new`}
                          className={buttonVariants({
                            variant: "outline",
                          })}
                        >
                          Add availability
                        </Link>

                        {hasAvailabilities ? (
                          <Link
                            to={`/coworking-resources/${resource.id}/book`}
                            className={buttonVariants()}
                          >
                            Book
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className={buttonVariants({
                              variant: "secondary",
                            })}
                          >
                            Booking unavailable
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
