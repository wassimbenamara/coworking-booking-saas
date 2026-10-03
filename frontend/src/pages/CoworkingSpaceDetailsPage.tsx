import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { getCoworkingSpaceById } from "@/services/coworking-space.service";
import type { CoworkingSpace } from "@/types/coworking-space";

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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    async function loadCoworkingSpace() {
      const coworkingSpaceId = Number(id);

      if (!Number.isInteger(coworkingSpaceId) || coworkingSpaceId <= 0) {
        setError("Invalid coworking space.");
        setIsLoading(false);
        return;
      }

      if (!accessToken) {
        setError("Authentication required.");
        setIsLoading(false);
        return;
      }

      try {
        setError("");

        const data = await getCoworkingSpaceById(coworkingSpaceId, accessToken);

        setCoworkingSpace(data);
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
      } finally {
        setIsLoading(false);
      }
    }

    loadCoworkingSpace();
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
          className={buttonVariants({ variant: "outline" })}
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
        className={buttonVariants({ variant: "outline" })}
      >
        Back to coworking spaces
      </Link>

      <Card>
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
    </main>
  );
}
