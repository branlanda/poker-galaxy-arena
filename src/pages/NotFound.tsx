
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="text-center px-4">
          <h1 className="text-8xl font-bold text-emerald mb-4">404</h1>
          <div className="h-2 w-20 bg-gold mx-auto mb-8"></div>
          <h2 className="h2 mb-6">Table Not Found</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-lg mx-auto">
            The poker table you're looking for doesn't exist or has been moved to a different location.
          </p>
          <Link to="/">
            <Button variant="default" size="lg">
              Back to Lobby
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
