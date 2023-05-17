import React, { useState } from "react";
import ContentList from "./components/ContentList";
import ScannerBtn from "./components/ScannerBtn";
import PwsContext from "./components/PWS-Context";
import SN_Context from "./components/SN-Context";
import R_Context from "./components/R-Context"

function Home() {
    const [managementId, setManagementId] = useState("");
    const [serialNo, setSerialNo] = useState("");
    const [refresh, setRefresh] = useState(false);
    const value = { managementId, setManagementId };
    const value2 = { serialNo, setSerialNo };
    const value3 = { refresh, setRefresh };
    
    console.log('Home() 렌더링');
    return(
        <PwsContext.Provider value={value}>
            <SN_Context.Provider value={value2}>
                <R_Context.Provider value={value3}>
            <div className="wrapper"/*  style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}} */>
                <ScannerBtn />
                <ContentList />
            </div>
            </R_Context.Provider>
            </SN_Context.Provider>
        </PwsContext.Provider>
    );
}

export default Home;