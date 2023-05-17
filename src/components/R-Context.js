import React from "react";

const R_Context = React.createContext({
    refresh: '',
    setRefresh: () => {},
});

export default R_Context;