import React, { useState } from "react";
import ContentList from "./components/ContentList";
import ScannerBtn from "./components/ScannerBtn";
import PwsContext from "./components/PWS-Context";

function Home() {
    const [managementId, setManagementId] = useState("");
    const value = { managementId, setManagementId };

    console.log('Home() 렌더링');
    return(
        <PwsContext.Provider value={value}>
            <div className="wrapper" style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
                <ScannerBtn />
                <ContentList />
            </div>
        </PwsContext.Provider>
    );
}

export default Home;