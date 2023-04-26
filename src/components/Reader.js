import React, { useContext } from 'react';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import beepScan from '../sounds/Barcode-scanner-beep-sound.mp3';
import PwsContext from './PWS-Context';
import useConfirm from "./useConfirm";
import "../css/reader.css";
import { Loop } from '@mui/icons-material';

const Reader = ({doScan}) => {
    const [localStream, setLocalStream] = useState();
    const [cameraDir, setCameraDir] = useState('environment');
    const [text, setText] = useState('');
    const Camera = useRef(null);
    const scanSound = new Audio(beepScan);

    const [isScanning, setIsScanning] = useState(true);
    const [streamWidth, setStreamWidth] = useState(0);
    const [streamHeight, setStreamHeight] = useState(0);

    const hints = new Map();
    // const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.CODE_128, BarcodeFormat.CODABAR, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.CODE_39, BarcodeFormat.CODE_93];
    const formats = [BarcodeFormat.CODABAR];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    
    const Scan = new BrowserMultiFormatReader(hints, 100);
  
    const { managementId, setManagementId } = useContext(PwsContext);

    const [ , , getConfirmationOK, ConfirmationOK ] = useConfirm();

    const facingModeFlip = () => {
        if(cameraDir === 'environment') setCameraDir('user');
        if(cameraDir === 'user') setCameraDir('environment');
    }
    
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    // const [ctx, setCtx] = useState();  //캔버스 컨텍스트를 useState로 상태관리
    let canvas = null;
    useEffect(() => {

        //setManagementId('H22N21044'); // 카메라 없는 환경 테스트
        //Scan.stopStreams();
        navigator.mediaDevices.getUserMedia({
            video: { width:{min:320, ideal:640, max:1280}, height:{min:180, ideal:360, max:720}, facingMode: { exact: cameraDir } },
        })
            .then(stream => {
            
                setLocalStream(stream);
                let {width, height} = stream.getTracks()[0].getSettings();
                console.log(`${width}x${height}`);
                setStreamWidth(width);
                setStreamHeight(height);
        })
        .catch((err) => {
            if(err.name === 'OverconstrainedError' && err.constraint === 'facingMode')  {
                facingModeFlip();
                console.log('camera direction : ', cameraDir);
            }
        });
        return () => {
            Stop();
        };
    }, [cameraDir]);
    useEffect(() => {
        if (!Camera.current)
            return;
        if (localStream && Camera.current) {
            Scanning();        
            
        }
        return () => {
            Stop();
        };
    }, [localStream]);

    useEffect(()=>{
        canvas = canvasRef.current;
        console.log('innerWidth : ', window.innerWidth);
        console.log('innerHeight : ', window.innerHeight);

        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;

        canvas.width = streamWidth;
        canvas.height = streamHeight;

        const w = 4;
        const h = 6;
        const wf = 95;
        const hf = 60;

        const context = canvas.getContext('2d');
        context.strokeStyle = "#FF0000";
        context.lineWidth = '1.0';
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(0, streamHeight/2);
        context.lineTo(streamWidth, streamHeight/2);
        context.stroke();

        context.strokeStyle = "#ffcc00";
        context.lineWidth = '1.0';
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(streamWidth/2-streamWidth/w, streamHeight/2-streamHeight/h + streamHeight/hf);
        context.lineTo(streamWidth/2-streamWidth/w, streamHeight/2-streamHeight/h);
        context.lineTo(streamWidth/2-streamWidth/w + streamWidth/wf, streamHeight/2-streamHeight/h);
        
        context.moveTo(streamWidth/2+streamWidth/w - streamWidth/wf, streamHeight/2-streamHeight/h);
        context.lineTo(streamWidth/2+streamWidth/w, streamHeight/2-streamHeight/h);
        context.lineTo(streamWidth/2+streamWidth/w, streamHeight/2-streamHeight/h + streamHeight/hf);

        context.moveTo(streamWidth/2+streamWidth/w, streamHeight/2 + streamHeight/h - streamHeight/hf);
        context.lineTo(streamWidth/2+streamWidth/w, streamHeight/2 + streamHeight/h);
        context.lineTo(streamWidth/2+streamWidth/w - streamWidth/wf, streamHeight/2 + streamHeight/h);

        context.moveTo(streamWidth/2-streamWidth/w + streamWidth/wf, streamHeight/2 + streamHeight/h);
        context.lineTo(streamWidth/2-streamWidth/w, streamHeight/2 + streamHeight/h);
        context.lineTo(streamWidth/2-streamWidth/w, streamHeight/2 + streamHeight/h - streamHeight/hf);

        context.stroke();
        contextRef.current = context;

        // setCtx(contextRef.current);
        
    },[streamHeight]);

    const isCodePWSFormat = function(str_code) {
        console.log(str_code);
        if(str_code.length !== 9) {console.log('code length is not 9.');return false;}
        
        if(str_code.charAt(0) !== 'H') {console.log(`index of 0 is not 'H'`);return false;}
        
        const ltxt = str_code.substr(1, 2);
        if(isNaN(ltxt)) {console.log('year code is not number');return false;}

        if(str_code.charAt(3) !== 'N') {console.log(`index of 3 is not 'N'`);return false;}
        const rtxt = str_code.substr(4, 5);
        if(isNaN(rtxt)) {console.log('last 5 character is not number.');return false;}

        console.log(`It's PWS barcode type.`);
        return true;
    };

    const Scanning = async () => {
        // const t = await Scan.decodeOnce();
        console.log('scan');
        if (localStream && Camera.current) {
            try {
                const data = await Scan.decodeFromStream(localStream, Camera.current, (data, err) => {
                    if (data) {
                        if(isCodePWSFormat(data.getText())) {
                            Scan.stopStreams();  // 카메라 스트림 중지
                            scanSound.loop = false;
                            scanSound.play();
                            
                            setText(data.getText());
                            console.log('It is PWS barcode.',data);
                            if(data.getText() === managementId){
                                getConfirmationOK(`스캔한 ${data.getText()} 은(는) 이미 등록 진행중인 자산관리번호입니다.`);
                            }
                            else   ;    
                                setManagementId(data.getText());    // 자산관리번호 바코드 스캔 결과 Context 에 저장
                            setIsScanning(false);
                        }
                        else {
                            console.log('It is not PWS barcode.',data);
                        }          
                    }
                    else {
                        ; //setText("");
                    }                    
                });
                
            }
            catch (error) {
                console.log(error);
            }
        }
    };
    
    const Stop = () => {
        if (localStream) {
            const vidTrack = localStream.getVideoTracks();
            vidTrack.forEach(track => {
                localStream.removeTrack(track);
            });
        }
    };
    
    // 카메라아이콘 클릭 핸들러 (카메라 전환)
    const onToggleCemeraHandler = e => {
        if(cameraDir === 'environment') {
            console.log('user');
            setCameraDir('user');
        }
        else {
            console.log('environment');
            setCameraDir('environment');
        }
        setIsScanning(true);
    };   
    
    
    console.log('Reader() 렌더링 : ', isScanning);
    return (
        <div className={doScan ? "show-reader" : "hide-reader"}>
            <ConfirmationOK/>
            { isScanning ?
                <canvas ref={canvasRef} style={{position: 'absolute', zIndex: 2}}/>
             :
             <canvas ref={canvasRef} style={{position: 'absolute', zIndex: 2, visibility: 'hidden'}}/>
            }
            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <video ref={Camera} id="video"/>
                
                <Loop sx={{ fontSize: 35, color:'inherit' }} style={{marginLeft:'30px'}} onClick={onToggleCemeraHandler}/>
            </div>
            <div style={{margin:'20px 0px'}}>
                <p>{text}</p>
            </div>
        </div>
    );
};
export default Reader;