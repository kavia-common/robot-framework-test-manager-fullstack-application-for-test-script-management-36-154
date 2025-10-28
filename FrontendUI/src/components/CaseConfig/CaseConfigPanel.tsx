import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AccessControl from "@components/Common/AccessControl";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  variables: z.string().optional() // JSON string for simplicity
});

type FormValues = z.infer<typeof schema>;

type Props = {
  defaultValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => Promise<void> | void;
};

// PUBLIC_INTERFACE
export default function CaseConfigPanel({ defaultValues, onSubmit }: Props) {
  /** Panel for editing test case configuration (variables as JSON string for scaffold). */
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const submit = handleSubmit(async (values) => onSubmit(values));

  return (
    <form className="panel" onSubmit={submit} noValidate aria-label="Case configuration">
      <label htmlFor="cc-name">Name</label>
      <input id="cc-name" {...register("name")} aria-invalid={!!errors.name} />
      {errors.name && <span role="alert" className="field-error">{errors.name.message}</span>}

      <label htmlFor="cc-desc">Description</label>
      <textarea id="cc-desc" {...register("description")} />

      <label htmlFor="cc-vars">Variables (JSON)</label>
      <textarea id="cc-vars" {...register("variables")} aria-describedby="vars-help" />
      <p id="vars-help" className="muted">Provide key/value pairs as JSON.</p>

      <div className="panel-actions">
        <AccessControl roles={["admin", "tester"]}>
          <button className="btn primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </AccessControl>
      </div>
    </form>
  );
}
