import React from "react";

const PwsContext = React.createContext({
    managementId : null,
    setManagementId: () => {},
});

export default PwsContext;