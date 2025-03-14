import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SyncLoader,PuffLoader } from 'react-spinners';

const Loading = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 700); // Show loader for 700ms

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-md z-50 transition-opacity duration-500">
          {/* <SyncLoader color="#1d5921" /> */}
          <PuffLoader color="#1d5921" />
        </div>
      )}

      {/* Page Content (Smooth Transition) */}
      <div className={`transition-opacity duration-700 ease-in-out ${loading ? "opacity-50" : "opacity-100"}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Loading;
