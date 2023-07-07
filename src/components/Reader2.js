import React, { useContext, useEffect, useRef, useState } from 'react';
import PwsContext from './PWS-Context';
import SN_Context from "./SN-Context";
import useConfirm from "./useConfirm";
import "../css/scanning.css";
import ContentList from './ContentList';

const Reader2 = ({ doScan }) => {
    const { managementId, setManagementId } = useContext(PwsContext);
    const { serialNo, setSerialNo } = useContext(SN_Context);
    const [, , getConfirmationOK, ConfirmationOK] = useConfirm();
    const [inputValue, setInputValue] = useState('');
    const inputCodeRef = useRef(null);
    const isCodePWSFormat = function (str_code) {

        console.log(str_code);
        //if(str_code.length !== 9) {console.log('code length is not 9.');return false;}

        if (str_code.charAt(0) !== 'H' && str_code.charAt(0) !== 'K') {
            console.log(`index of 0 is not 'H(K)'`);
            return false;
        }

        const ltxt = str_code.substr(1, 2);
        console.log(ltxt)
        if (isNaN(ltxt) || ltxt === '') {
            console.log('year code is not number');
            return false;
        }

        if (str_code.charAt(3) !== 'N' && str_code.charAt(3) !== 'S' && str_code.charAt(3) !== 'U') {
            console.log(`index of 3 is not 'N'`); return false;
        }
        const rtxt = str_code.substr(4, 5);
        console.log(rtxt)

        if (rtxt.length !== 5) {
            return 'wrong_length';
        }

        if (isNaN(rtxt)) {
            console.log('last 5 character is not number.');
            return 'mistake';
        }

        console.log(`It's PWS barcode type.`);
        return true;
    };

    const hSubmit = (event) => {
        const koreanKeys = ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ', 'ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ', 'ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ', 'ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ'];
        const englishKeys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E', 'R', 'T'];
        event.preventDefault();
        const v = [...event.target.elements[0].value];
        for (let i = 0; i < v.length; i++) {
            const c = v[i];
            const index = koreanKeys.indexOf(c);

            if (index !== -1) {
                const englishValue = englishKeys[index];
                v[i] = englishValue;
            }
        }
        console.log(v);
        const value = v.join('').trim().toUpperCase();
        console.log(value);
        setInputValue(value);

        if (value.length < 1)    // 입력내용이 없으면 패스
            return;

        if (isCodePWSFormat(value) === 'wrong_length') {
            getConfirmationOK(`입력한 ${value} 자산관리번호는 9글자가 아닙니다. 다시 입력하세요.`);
            return;
        }

        if (isCodePWSFormat(value) === 'mistake') {
            getConfirmationOK(`입력한 ${value} 자산관리번호의 마지막 5자리는 숫자가 아닙니다. 다시 입력하세요.`);
            return;
        }

        else if (isCodePWSFormat(value)) {
            if (value === managementId) {
                getConfirmationOK(`스캔한 ${value} 은(는) 이미 등록(조회) 진행중인 자산관리번호입니다.`);
            }
            setManagementId(value);
            console.log(value);
            setInputValue('');
        }
        else {
            console.log('It is not PWS barcode. ', value);

            if (value === serialNo) {
                getConfirmationOK(`스캔한 ${value} 은(는) 이미 등록(조회) 진행중인 S/N입니다.`);
            }
            setSerialNo(value);
            console.log(value);
            setInputValue('');
        }
        event.target.elements[0].value = '';
    }

    useEffect(() => {
        inputCodeRef.current.focus();
    }, []);

    const inputHandler = (e) => {
        const inputText = e.target.value;
        setInputValue(inputText);
    }

    return (
        <>
        <div className={doScan ? "show-reader" : "hide-reader"} style={{ height: '70px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <ConfirmationOK />
            
            {/* { isScanning ? */}
            <form style={{}} onSubmit={hSubmit}>
                <input id="inputScanCode" ref={inputCodeRef} type='text' name='code' style={{ position: 'relative', right: '0%', fontSize: '1.2rem', fontWeight: '600', borderWidth: '2px', outline: 'none'}} onChange={inputHandler} value={inputValue} />
                {/* <button >조회</button> */}
            </form>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 0 }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 600 }}>Scanning</div><div className='line anim-typewriter' >....</div>
            </div>
        </div>
        </>
    );
}

export default Reader2;