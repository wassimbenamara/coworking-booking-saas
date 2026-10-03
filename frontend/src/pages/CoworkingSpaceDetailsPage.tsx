import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

import { getCoworkingSpaceById } from "@/services/coworking-space.service";
import { getCoworkingResources } from "@/services/coworking-resource.service";

import type { CoworkingSpace } from "@/types/coworking-space";
import type { CoworkingResource } from "@/types/coworking-resource";

import { buttonVariants } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CoworkingSpaceDetailsPage() {
  const { id } = useParams();
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  const [coworkingSpace, setCoworkingSpace] = useState<CoworkingSpace | null>(
    null,
  );

  const [resources, setResources] = useState<CoworkingResource[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoading, setResourcesLoading] = useState(true);

  const [error, setError] = useState("");
  const [resourcesError, setResourcesError] = useState("");

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

      try {
        setError("");
        setResourcesError("");

        const coworkingSpaceData = await getCoworkingSpaceById(
          coworkingSpaceId,
          accessToken,
        );

        setCoworkingSpace(coworkingSpaceData);

        try {
          const resourcesData = await getCoworkingResources(
            coworkingSpaceId,
            accessToken,
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
      } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
          setError("Your session has expired.");
        } else if (
          error instanceof Error &&
          error.message === "COWORKING_SPACE_NOT_FOUND"
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
        <p className="text-red-600">{error || "Coworking space not found."}</p>

        <Link
          to="/coworking-spaces"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Back to coworking spaces
        </Link>
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

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Resources</h2>

          <p className="text-muted-foreground">
            Available desks and meeting rooms.
          </p>
        </div>

        {resourcesLoading ? (
          <p>Loading resources...</p>
        ) : resourcesError ? (
          <p className="text-red-600">{resourcesError}</p>
        ) : resources.length === 0 ? (
          <p className="text-muted-foreground">No resources available yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle>{resource.name}</CardTitle>

                  <CardDescription>
                    {resource.type === "DESK" ? "Desk" : "Meeting room"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p>Capacity: {resource.capacity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Link
          to={`/coworking-spaces/${coworkingSpace.id}/resources/new`}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Add resource
        </Link>
      </section>
    </main>
  );
}
