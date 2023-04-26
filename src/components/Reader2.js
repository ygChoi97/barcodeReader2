import React, { useContext, useEffect, useRef, useState } from 'react';
import PwsContext from './PWS-Context';
import useConfirm from "./useConfirm";

const Reader2 = ({doScan}) => {
    const [isScanning, setIsScanning] = useState(true);
    const { managementId, setManagementId } = useContext(PwsContext);
    const [ , , getConfirmationOK, ConfirmationOK ] = useConfirm();
    const [inputValue, setInputValue] = useState('');
    const inputCodeRef = useRef(null);
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

    const hSubmit = (event) => {
        const koreanKeys =  ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', 'ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ'];
        const englishKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E', 'R', 'T'];
        event.preventDefault();
        const v = [...event.target.elements[0].value];
        for(let i=0; i<v.length; i++) {
            const c = v[i];
            const index = koreanKeys.indexOf(c);

            if(index !== -1) {
                const englishValue = englishKeys[index];
                v[i] = englishValue;
            }
        }
        console.log(v);
        const value = v.join('');
        console.log(value);
        setInputValue(value);
        if(isCodePWSFormat(value)) {
            if(value === managementId) {
                getConfirmationOK(`스캔한 ${value} 은(는) 이미 등록 진행중인 자산관리번호입니다.`);
            }
            setManagementId(value);
            // inputCodeRef.current.value = null;
            setInputValue('');
            setIsScanning(false);
        }
        else {
            console.log('It is not PWS barcode. ', value);
        }
        event.target.elements[0].value = '';     
    }

    useEffect(() => {
        inputCodeRef.current.focus();
    }, []);
    
    function handleChange(event) {
        // const keyCode = event.keyCode || event.which;
        // const keyCode = event.code;
        // const keyValue = String.fromCharCode(keyCode);
        const koreanKeys = ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', 'ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ'];
        const englishKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

        const keyValue = [...event.target.value];
        console.log(keyValue);
        const key = keyValue[keyValue.length-1];
        console.log('key:', key);
        // const englishKeys = [
        //     'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
        // ];

        // const koreanKeys = ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP',
        //                     'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 
        //                     'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'];

        
        // console.log(event.target.value);
        const index = koreanKeys.indexOf(key);
        console.log(index);
        if (index !== -1) {
            const englishValue = englishKeys[index];
            event.preventDefault();
            
            keyValue[keyValue.length-1] = englishValue;
            console.log(keyValue);
            setInputValue(keyValue);
        }
    }

    const inputHandler = (e) => {
        const inputText = e.target.value;
        setInputValue(inputText);
      }

    return(
        <div className={doScan ? "show-reader" : "hide-reader"} style={{height: '70px' ,display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <ConfirmationOK/>
            {/* { isScanning ? */}
        <form style={{border: '1px solid', }} onSubmit={hSubmit}>
            <input ref={inputCodeRef} type='text' name='code' style={{position: 'absolute', right:'0%'}} onChange={inputHandler} value={inputValue}/> 
            {/* <button hidden>조회</button> */}

        </form>
        <h3>Scanning...</h3>
        
        {/* :
        <></>
            } */}
        </div>
    );
}

export default Reader2;