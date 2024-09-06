import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TaskDocument } from "@/state/task/taskSlice";

interface TaskCarouselProps {
  images: TaskDocument[];
}

export function TaskCarousel({ images }: TaskCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto w-[600px] flex flex-col items-center justify-center">
      <Carousel setApi={setApi} className="w-[500px]">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex items-center justify-center p-2">
                  <img
                    key={image.id}
                    src={image.file_url_with_protocol}
                    className="h-[500px] w-[500px] object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
