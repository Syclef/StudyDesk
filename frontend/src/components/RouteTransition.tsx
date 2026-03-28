import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteTransition = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  // ✅ ONLY apply to Card Hunter routes
  const isCardHunter = location.pathname.startsWith(
    "/game-center/card-hunter"
  );

  useEffect(() => {
    if (!isCardHunter) return;

    setVisible(true);

    const id = requestAnimationFrame(() => {
      setTimeout(() => setVisible(false), 80);
    });

    return () => cancelAnimationFrame(id);
  }, [location.pathname, isCardHunter]);

  if (!visible || !isCardHunter) return null;

  return <div className="route-transition-overlay" />;
};

export default RouteTransition;
