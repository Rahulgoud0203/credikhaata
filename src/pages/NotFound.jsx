import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg mb-4">Page not found</p>
        <Link to="/" className="text-primary underline">Go back home</Link>
      </div>
    </div>
  );
};

export default NotFound;
