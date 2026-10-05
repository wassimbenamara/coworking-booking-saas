import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createCoworkingSpaceSchema,
  type CreateCoworkingSpaceInput,
} from "@coworking/shared";

import { useAuth } from "@/contexts/AuthContext";
import { createCoworkingSpace } from "@/services/coworking-space.service";

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

type FormErrors = Partial<Record<keyof CreateCoworkingSpaceInput, string>>;

export default function CreateCoworkingSpacePage() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState<CreateCoworkingSpaceInput>({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: keyof CreateCoworkingSpaceInput, value: string) {
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

    setMessage("");
    setErrors({});

    if (!accessToken) {
      setMessage("You must be authenticated.");
      return;
    }

    const validation = createCoworkingSpaceSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        description: fieldErrors.description?.[0],
        address: fieldErrors.address?.[0],
        city: fieldErrors.city?.[0],
        country: fieldErrors.country?.[0],
      });

      return;
    }

    setIsLoading(true);

    try {
      const coworkingSpace = await createCoworkingSpace(
        validation.data,
        accessToken,
      );

      navigate(`/coworking-spaces/${coworkingSpace.id}`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "UNAUTHORIZED") {
          setMessage("Your session has expired.");
        } else if (error.message === "INVALID_DATA") {
          setMessage("The submitted data is invalid.");
        } else {
          setMessage("Unable to create coworking space.");
        }
      } else {
        setMessage("Unable to create coworking space.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a coworking space</CardTitle>

          <CardDescription>
            Add a new coworking space to the platform.
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
              <Label htmlFor="description">Description</Label>

              <Input
                id="description"
                value={formData.description ?? ""}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                aria-invalid={Boolean(errors.description)}
              />

              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>

              <Input
                id="address"
                value={formData.address}
                onChange={(event) => updateField("address", event.target.value)}
                aria-invalid={Boolean(errors.address)}
              />

              {errors.address && (
                <p className="text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>

              <Input
                id="city"
                value={formData.city}
                onChange={(event) => updateField("city", event.target.value)}
                aria-invalid={Boolean(errors.city)}
              />

              {errors.city && (
                <p className="text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>

              <Input
                id="country"
                value={formData.country}
                onChange={(event) => updateField("country", event.target.value)}
                aria-invalid={Boolean(errors.country)}
              />

              {errors.country && (
                <p className="text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create coworking space"}
            </Button>

            {message && <p className="text-sm text-red-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
