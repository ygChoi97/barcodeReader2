import React, { useState } from "react";
import ContentList from "./components/ContentList";
import ScannerBtn from "./components/ScannerBtn";
import PwsContext from "./components/PWS-Context";
import SN_Context from "./components/SN-Context";
import R_Context from "./components/R-Context"
import './css/main.css';
function Home() {
    const [managementId, setManagementId] = useState("");
    const [serialNo, setSerialNo] = useState("");
    const [refresh, setRefresh] = useState(false);
    const value1 = { managementId, setManagementId };
    const value2 = { serialNo, setSerialNo };
    const value3 = { refresh, setRefresh };
    
    // 배포 환경에서 console.log, console.warn 지우기
    if (process.env.NODE_ENV) {
        // console.log = function no_console() { };
        // console.warn = function no_console() { };
    }
    
    console.log('Home() 렌더링');
    return (
        <PwsContext.Provider value={value1}>
            <SN_Context.Provider value={value2}>
                <R_Context.Provider value={value3}>
                    <div className="wrapper">
                        <ScannerBtn />
                        {/* <ContentList /> */}
                    </div>
                </R_Context.Provider>
            </SN_Context.Provider>
        </PwsContext.Provider>
    );
}

export default Home;