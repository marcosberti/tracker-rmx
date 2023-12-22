import { ErrorMessage } from "~/components/components";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { ErrorTypes } from "../route";

interface Props {
  errors: ErrorTypes | undefined;
}

export default function CurrencyForm({ errors }: Props) {
  return (
    <div className="flex gap-4">
      <div className="basis-[50%]">
        <Label htmlFor="name">
          Name
          <ErrorMessage message={errors?.name} />
        </Label>
        <Input
          id="name"
          name="name"
          aria-invalid={Boolean(errors?.name) || undefined}
          aria-errormessage={errors?.name ? "name-error" : undefined}
        />
      </div>
      <div className="basis-[50%]">
        <Label htmlFor="code">
          Code
          <ErrorMessage message={errors?.code} />
        </Label>
        <Input
          id="code"
          name="code"
          aria-invalid={Boolean(errors?.code) || undefined}
          aria-errormessage={errors?.code ? "code-error" : undefined}
        />
      </div>
    </div>
  );
}
