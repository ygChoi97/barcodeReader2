import { AddAPhotoRounded,  FitScreen,  LinkedCameraRounded, PlaylistAddCheck } from "@mui/icons-material";
import React, { useState } from "react";
import LeftInfo from "./LeftInfo";
import BarcodeIcon from "../barcode-icon.bmp"

function ScannerBtn() {
    const [doScan, setDoScan] = useState(false);
    const onToggleScanHandler = e => {
        setDoScan(!doScan);
        console.log(doScan);
    }

    console.log('ScannerBtn() 렌더링');
    return(
        // <div className="wrapper" style={{border:'solid 1px', width: '70%'}}>
        <div className="wrapper" style={{position: 'relative', zIndex: 1}}>

            <div>
                {doScan ?
                    <PlaylistAddCheck sx={{ fontSize: 35 }} onClick={onToggleScanHandler} />
                    :
                    // <AddAPhotoRounded sx={{ fontSize: 25 }} onClick={onToggleScanHandler} />
                    // <img src={BarcodeIcon} style={{width: '3rem', margin: '0.2rem 0.2rem'}} alt="barcode" onClick={onToggleScanHandler}/>
                    <FitScreen sx={{ fontSize: 35 }} onClick={onToggleScanHandler} />
                }
            </div>

            <div className="wrapper">
                <LeftInfo doScan={doScan} />
            </div>
        </div>
    );
}

export default ScannerBtn;