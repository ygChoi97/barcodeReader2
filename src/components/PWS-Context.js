import React from "react";

const PwsContext = React.createContext({
    managementId : 'default value',
    setManagementId: () => {},
    // usage: '',
    // setUsage: () => {}
});

export default PwsContext;