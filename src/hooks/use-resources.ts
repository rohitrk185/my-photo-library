import { CloudinaryResouce } from "@/types/cloudinary";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type UseResourcesPropType = {
  initialResources?: Array<CloudinaryResouce>;
  disableFetch?: boolean;
  tag?: string;
};

export function useResources(options?: UseResourcesPropType) {
  const { disableFetch = false, tag } = options || {};

  const queryClient = useQueryClient();

  const { data: resources } = useQuery({
    queryKey: ["resources", tag],
    queryFn: async () => {
      const res = await fetch("/api/resources");
      const { data } = await res.json();

      return data;
    },
    initialData: options?.initialResources,
    enabled: !disableFetch,
  });

  function addResources(results: CloudinaryResouce[]) {
    queryClient.setQueryData(
      ["resources", String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG)],
      (old: CloudinaryResouce[]) => {
        return [...results, ...old];
      },
    );
    queryClient.invalidateQueries({
      queryKey: [
        "resources",
        String(process.env.NEXT_PUBLIC_CLOUDINARY_LIBRARY_TAG),
      ],
    });
  }

  return { resources, addResources };
}
