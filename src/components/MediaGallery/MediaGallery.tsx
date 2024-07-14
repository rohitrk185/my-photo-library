"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  X,
  Save,
  Loader2,
  SquareStack,
  Droplet,
  LayoutPanelLeft,
} from "lucide-react";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// import { CldImage } from "next-cloudinary";
import CldImage from "@/components/CldImage";
import { CloudinaryResouce } from "@/types/cloudinary";

import { useResources } from "@/hooks/use-resources";
import { getAnimation, getCollage } from "@/lib/creations";
import { useRouter } from "next/navigation";
import { getCldImageUrl } from "next-cloudinary";

interface MediaGalleryProps {
  resources: CloudinaryResouce[];
  tag?: string;
}

interface Creation {
  state: string;
  url?: string;
  type: string;
}

const MediaGallery = ({
  resources: initialResources,
  tag,
}: MediaGalleryProps) => {
  const router = useRouter();

  const { resources, addResources } = useResources({ initialResources, tag });

  const [selected, setSelected] = useState<Array<string>>([]);
  const [creation, setCreation] = useState<Creation>();

  /**
   * handleOnClearSelection
   */

  function handleOnClearSelection() {
    setSelected([]);
  }

  /**
   * handleOnCreationOpenChange
   */

  function handleOnCreationOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setCreation(undefined);
    }
  }

  async function handleOnCreateCollage() {
    setCreation({
      state: "created",
      url: getCollage(selected),
      type: "collage",
    });
  }

  async function handleOnSaveCreation() {
    if (!creation?.url) {
      return;
    }

    setCreation((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        state: "saving",
      };
    });

    await fetch(creation.url);

    const { data } = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        url: creation.url,
        tags: [String(process.env.NEXT_PUBLIC_CREATIONS_TAG)],
      }),
    }).then((res) => res.json());

    addResources([data]);
    setCreation(undefined);
    setSelected([]);

    router.push(`/resources/${data.asset_id}`);
  }

  async function handleOnCreateAnimation() {
    setCreation({
      state: "created",
      url: getAnimation(selected),
      type: "animation",
    });
  }

  async function handleOnCreateColorPop() {
    setCreation({
      state: "creating",
      url: undefined,
      type: "color-pop",
    });

    const { url } = await fetch("/api/creations/color-pop", {
      method: "POST",
      body: JSON.stringify({
        publicId: selected[0],
      }),
    }).then((res) => res.json());

    setCreation({
      state: "created",
      url,
      type: "color-pop",
    });
  }

  return (
    <>
      {/** Popup modal used to preview and confirm new creations */}

      <Dialog open={!!creation} onOpenChange={handleOnCreationOpenChange}>
        <DialogContent>
          {["creating"].includes(creation?.state || "") ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-12 w-12 mr-2 animate-spin" />
            </div>
          ) : null}

          {["created", "saving"].includes(creation?.state || "") ? (
            <>
              <DialogHeader>
                <DialogTitle>Save your creation?</DialogTitle>
              </DialogHeader>
              {creation?.url ? (
                <div>
                  <CldImage
                    width={1200}
                    height={1200}
                    src={creation.url}
                    alt={creation.type}
                    preserveTransformations
                  />
                </div>
              ) : null}
              <DialogFooter className="justify-end sm:justify-end">
                <Button
                  onClick={handleOnSaveCreation}
                  disabled={creation?.state === "saving"}
                >
                  {creation?.state === "saving" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin disabled:opacity-75" />
                  ) : null}
                  <Save className="h-4 w-4 mr-2" />
                  Save to Library
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/** Management navbar presented when assets are selected */}

      {selected.length > 0 && (
        <Container className="fixed z-50 top-0 left-0 w-full h-16 flex items-center justify-between gap-4 bg-white shadow-lg">
          <div className="flex items-center gap-4">
            <ul>
              <li>
                <Button variant="ghost" onClick={handleOnClearSelection}>
                  <X className="h-6 w-6" />
                  <span className="sr-only">Clear Selected</span>
                </Button>
              </li>
            </ul>
            <p>
              <span>{selected?.length} Selected</span>
            </p>
          </div>
          <ul className="flex items-center gap-4">
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <Plus className="h-6 w-6" />
                    <span className="sr-only">Create New</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    {selected.length > 1 ? (
                      <DropdownMenuItem
                        onClick={handleOnCreateCollage}
                        className="cursor-pointer"
                      >
                        <LayoutPanelLeft className="w-4 h-4 mr-2" />
                        <span>Collage</span>
                      </DropdownMenuItem>
                    ) : null}

                    {selected.length === 1 ? (
                      <DropdownMenuItem
                        onClick={handleOnCreateAnimation}
                        className="cursor-pointer"
                      >
                        <SquareStack className="w-4 h-4 mr-2" />
                        <span>Animation</span>
                      </DropdownMenuItem>
                    ) : null}

                    {selected.length === 1 ? (
                      <DropdownMenuItem
                        onClick={handleOnCreateColorPop}
                        className="cursor-pointer"
                      >
                        <Droplet className="w-4 h-4 mr-2" />
                        <span>Color Pop</span>
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </Container>
      )}

      {/** Gallery */}

      <Container>
        <form>
          {Array.isArray(resources) && (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
              {resources.map((resource) => {
                const isChecked = selected.includes(resource.public_id);

                function handleOnSelectResource(checked: boolean) {
                  setSelected((prev) => {
                    if (checked) {
                      return Array.from(
                        new Set([...(prev || []), resource.public_id]),
                      );
                    } else {
                      return prev.filter((id) => id !== resource.public_id);
                    }
                  });
                }

                return (
                  <li
                    key={resource.public_id}
                    className="bg-white dark:bg-zinc-700"
                  >
                    <div className="relative group">
                      <label
                        className={`absolute ${isChecked ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity top-3 left-3 p-1`}
                        htmlFor={resource.public_id}
                      >
                        <span className="sr-only">
                          Select Image &quot;{resource.public_id}&quot;
                        </span>
                        <Checkbox
                          className={`w-6 h-6 rounded-full bg-white shadow ${isChecked ? "border-blue-500" : "border-zinc-200"}`}
                          id={resource.public_id}
                          onCheckedChange={handleOnSelectResource}
                          checked={isChecked}
                        />
                      </label>
                      <Link
                        className={`block cursor-pointer border-8 transition-[border] ${isChecked ? "border-blue-500" : "border-white"}`}
                        href={`/resources/${resource.asset_id}`}
                      >
                        <CldImage
                          width={resource.width}
                          height={resource.height}
                          src={resource.public_id}
                          alt=""
                          sizes="(min-width: 768px) 33vw, (min-width: 1024px) 25vw, (min-width: 1280px) 20vw, 50vw"
                        />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </form>
      </Container>
    </>
  );
};

export default MediaGallery;
