import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TestsAPI } from "@api/endpoints";
import { useNotifications } from "@hooks/useNotifications";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

// PUBLIC_INTERFACE
export default function TestWizard({ onCreated }: { onCreated?: () => void }) {
  /** Simple 2-step wizard to create a Test */
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });
  const { notify } = useNotifications();

  const next = () => setStep((s) => Math.min(2, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = handleSubmit(async (values) => {
    await TestsAPI.create(values);
    notify("Test created", "success");
    onCreated?.();
  });

  return (
    <div className="wizard" role="region" aria-label="Create test wizard">
      <ol className="steps" aria-label="Steps">
        <li aria-current={step === 1 ? "step" : undefined}>Details</li>
        <li aria-current={step === 2 ? "step" : undefined}>Review</li>
      </ol>
      {step === 1 && (
        <form onSubmit={onSubmit} noValidate>
          <label htmlFor="tw-name">Name</label>
          <input id="tw-name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <span role="alert" className="field-error">{errors.name.message}</span>}

          <label htmlFor="tw-desc">Description</label>
          <textarea id="tw-desc" {...register("description")} />

          <div className="wizard-actions">
            <button type="button" className="btn" onClick={next}>Next</button>
          </div>
        </form>
      )}
      {step === 2 && (
        <div>
          <p>Review your details and create the test.</p>
          <div className="wizard-actions">
            <button type="button" className="btn" onClick={prev}>Back</button>
            <button type="button" className="btn primary" onClick={() => onSubmit()} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
