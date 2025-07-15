import { Loader2 } from "lucide-react";

const Loader = () => {

    return (
        <div className="flex h-screen justify-center items-center">
            <Loader2 className="text-black animate-spin w-10 h-10"/>
        </div>
    );
}

export default Loader;