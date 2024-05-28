import MediaGallery from "@/components/MediaGallery";
import { v2 as cloudinary } from "cloudinary";

export default async function Home() {
  return (
    <div className="h-full mt-6">
      <MediaGallery
        resources={[
          {
            id: "my-image",
          },
        ]}
      />
    </div>
  );
}
