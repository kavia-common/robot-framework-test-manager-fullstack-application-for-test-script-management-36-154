import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CasesAPI } from "@api/endpoints";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@components/Common/Loading";
import ErrorState from "@components/Common/ErrorState";
import CaseConfigPanel from "@components/CaseConfig/CaseConfigPanel";
import { useNotifications } from "@hooks/useNotifications";

export default function TestCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { notify } = useNotifications();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["case", id],
    queryFn: () => CasesAPI.get(id!),
    enabled: !!id
  });

  const update = useMutation({
    mutationFn: (payload: any) => CasesAPI.update(id!, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["case", id] });
      notify("Case saved", "success");
      navigate(-1);
    }
  });

  if (isLoading) return <Loading label="Loading case..." />;
  if (isError) return <ErrorState message={(error as any)?.message} onRetry={() => refetch()} />;

  const defaults = {
    name: data?.name,
    description: data?.description,
    variables: data?.variables ? JSON.stringify(data.variables, null, 2) : ""
  };

  return (
    <div className="page">
      <h2>Configure Case</h2>
      <CaseConfigPanel
        defaultValues={defaults}
        onSubmit={async (values) => {
          // parse variables JSON if provided
          let vars: any = undefined;
          if (values.variables) {
            try {
              vars = JSON.parse(values.variables);
            } catch {
              notify("Variables must be valid JSON", "error");
              return;
            }
          }
          await update.mutateAsync({ name: values.name, description: values.description, variables: vars });
        }}
      />
    </div>
  );
}
