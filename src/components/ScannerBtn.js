import { AddAPhotoRounded,  FitScreen,  LinkedCameraRounded, PlaylistAddCheck } from "@mui/icons-material";
import React, { useState } from "react";
import LeftInfo from "./LeftInfo";
import BarcodeIcon from "../barcode-icon.bmp"
import '../css/header.css';
function ScannerBtn() {
    const [doScan, setDoScan] = useState(false);
    const onToggleScanHandler = e => {
        setDoScan(!doScan);
        console.log(doScan);
    }

    console.log('ScannerBtn() 렌더링');
    return(
        // <div className="wrapper" style={{border:'solid 1px', width: '70%'}}> #61cc53
        <div className="wrapper" style={{position: 'absolute', zIndex: 1}} >

            <div className="header" style={{ height: '50px',display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,borderBottom: '2px solid', margin: '0.1rem 0.3rem'}}>
                {doScan ?
                    <div onClick={onToggleScanHandler} style={{display: 'flex', alignItems: 'center', marginLeft: '0.5rem'}} >
                        <PlaylistAddCheck sx={{ fontSize: 35 }} />
                        <div style={{fontSize: '1.3rem', fontWeight: '600', color : '#444', marginLeft: '0.3rem'}}>Data</div>
                    </div>
                    :
                    // <AddAPhotoRounded sx={{ fontSize: 25 }} onClick={onToggleScanHandler} />
                    // <img src={BarcodeIcon} style={{width: '3rem', margin: '0.2rem 0.2rem'}} alt="barcode" onClick={onToggleScanHandler}/>
                    <div onClick={onToggleScanHandler} style={{display: 'flex', alignItems: 'center', marginLeft: '0.5rem'}} >
                        <FitScreen sx={{ fontSize: 35 }} />
                        <div style={{fontSize: '1.3rem', fontWeight: '600', color : '#444', marginLeft: '0.3rem'}}>Scan</div>
                    </div>
                    
                }
                <div style={{fontSize: '1.2rem', fontWeight: '900', fontStyle: 'oblique', textShadow: '2px 2px 3px black',color : 'whitesmoke', marginRight: '1rem'}}>PWS Survey Manager</div>
            </div>

            <div className="" >
                <LeftInfo doScan={doScan} />
            </div>
        </div>
    );
}

export default ScannerBtn;