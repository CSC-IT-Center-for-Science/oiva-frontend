import React, { useEffect } from "react";
import { MessageWrapper } from "../../modules/elements";

const Logout = () => {
  useEffect(() => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("oid");
    sessionStorage.removeItem("role");
  }, []);

  return (
    <div className="mx-4 sm:mx-24">
      <MessageWrapper>Olet kirjautunut ulos.</MessageWrapper>
    </div>
  );
};

export default Logout;
