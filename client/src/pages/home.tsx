import Navigation from "@/components/navigation";
import WorksFocusLens from "@/components/works-focus-lens";

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
      <Navigation />
      <WorksFocusLens />
    </div>
  );
}
