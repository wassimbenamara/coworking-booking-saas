import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  createCoworkingResourceSchema,
  type CreateCoworkingResourceInput,
} from "@coworking/shared";

import { useAuth } from "@/contexts/AuthContext";
import { createCoworkingResource } from "@/services/coworking-resource.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormErrors = Partial<Record<keyof CreateCoworkingResourceInput, string>>;

export default function CreateCoworkingResourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const coworkingSpaceId = Number(id);

  const [formData, setFormData] = useState({
    name: "",
    type: "DESK" as const,
    capacity: 1,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(
    field: "name" | "type" | "capacity",
    value: string | number,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});
    setMessage("");

    if (!Number.isInteger(coworkingSpaceId) || coworkingSpaceId <= 0) {
      setMessage("Invalid coworking space.");
      return;
    }

    if (!accessToken) {
      setMessage("You must be authenticated.");
      return;
    }

    const payload: CreateCoworkingResourceInput = {
      ...formData,
      coworkingSpaceId,
    };

    const validation = createCoworkingResourceSchema.safeParse(payload);

    if (!validation.success) {
      const fieldErrors = validation.error.issues.reduce<FormErrors>(
        (accumulator, issue) => {
          const field = issue.path[0];

          if (typeof field === "string" && !(field in accumulator)) {
            accumulator[field as keyof CreateCoworkingResourceInput] =
              issue.message;
          }

          return accumulator;
        },
        {},
      );

      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      await createCoworkingResource(validation.data, accessToken);

      navigate(`/coworking-spaces/${coworkingSpaceId}`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
          setMessage("Your session has expired.");
        } else if (error.message === "COWORKING_SPACE_NOT_FOUND") {
          setMessage("Coworking space not found.");
        } else if (error.message === "INVALID_DATA") {
          setMessage("The submitted data is invalid.");
        } else {
          setMessage("Unable to create resource.");
        }
      } else {
        setMessage("Unable to create resource.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a resource</CardTitle>

          <CardDescription>
            Add a desk or meeting room to this coworking space.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
              />

              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>

              <select
                id="type"
                value={formData.type}
                onChange={(event) =>
                  updateField(
                    "type",
                    event.target.value as "DESK" | "MEETING_ROOM",
                  )
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="DESK">Desk</option>
                <option value="MEETING_ROOM">Meeting room</option>
              </select>

              {errors.type && (
                <p className="text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>

              <Input
                id="capacity"
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(event) =>
                  updateField("capacity", Number(event.target.value))
                }
                aria-invalid={Boolean(errors.capacity)}
              />

              {errors.capacity && (
                <p className="text-sm text-red-600">{errors.capacity}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create resource"}
            </Button>

            {message && <p className="text-sm text-red-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
