import React from "react";

const SN_Context = React.createContext({
    serialNo: null,
    setSerialNo: () => {},
});

export default SN_Context;