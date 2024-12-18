import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { ExpandingIndicator } from "@/components/ui/expanding-indicator";

export default async function HomePage() {
  return (
    <section className="flex h-screen flex-col gap-3 px-5 py-4">
      <div className="flex select-none flex-row items-center justify-between">
        <PageTitle>Home</PageTitle>
        <div className="flex flex-row gap-2">
          <Button variant={"outline"} className="flex h-8 items-center gap-2">
            <ExpandingIndicator />
            Write feedback
          </Button>
        </div>
      </div>
    </section>
  );
}
