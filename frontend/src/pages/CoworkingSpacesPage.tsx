import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { getCoworkingSpaces } from "@/services/coworking-space.service";
import type { CoworkingSpace } from "@/types/coworking-space";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CoworkingSpacesPage() {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  const [coworkingSpaces, setCoworkingSpaces] = useState<CoworkingSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    async function loadCoworkingSpaces() {
      if (!accessToken) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getCoworkingSpaces(accessToken);

        setCoworkingSpaces(data);
      } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
          setError("Your session has expired.");
        } else {
          setError("Unable to load coworking spaces.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadCoworkingSpaces();
  }, [accessToken, isAuthLoading]);

  if (isAuthLoading || isLoading) {
    return (
      <main className="p-6">
        <p>Loading coworking spaces...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Coworking Spaces</h1>

        <p className="mt-2 text-muted-foreground">
          Discover available coworking spaces.
        </p>
      </div>

      {coworkingSpaces.length === 0 ? (
        <p className="text-muted-foreground">
          No coworking spaces available yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coworkingSpaces.map((space) => (
            <Link
              key={space.id}
              to={`/coworking-spaces/${space.id}`}
              className="block"
            >
              <Card className="h-full transition hover:shadow-md">
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>

                  <CardDescription>
                    {space.city}, {space.country}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {space.description ?? "No description available."}
                  </p>

                  <p className="mt-4 text-sm">{space.address}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
