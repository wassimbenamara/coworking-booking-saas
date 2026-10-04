import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";

interface PageNavigationProps {
  backTo?: string;
  backLabel?: string;
}

export default function PageNavigation({
  backTo,
  backLabel = "Back",
}: PageNavigationProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        to="/dashboard"
        className={buttonVariants({
          variant: "outline",
        })}
      >
        Dashboard
      </Link>

      {backTo ? (
        <Link
          to={backTo}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          {backLabel}
        </Link>
      ) : null}
    </div>
  );
}