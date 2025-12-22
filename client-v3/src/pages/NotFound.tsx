import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
      <div className="text-center">
        
        <h1 className="text-7xl font-bold text-slate-800">404</h1>
        
        <p className="mt-4 text-lg text-slate-600">
          Oops! The page you're looking for doesn't exist.
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl 
            bg-slate-800 text-white hover:bg-slate-900 transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back Home
          </Link>
        </div>

      </div>
    </div>
  );
}
