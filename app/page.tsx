import { MainNav } from "@/component/MainNav";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black h-full text-white" >
     <MainNav />
   
    <BackgroundBeams />
    </div>
  );
}
