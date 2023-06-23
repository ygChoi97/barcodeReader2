import { Button, List, Paper } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Content from "./Content";
import '../css/contentlist.css';
import PwsContext from "./PWS-Context";
import SN_Context from "./SN-Context";
import R_Context from "./R-Context";
import useConfirm from "./useConfirm";

const BASE_URL = 'http://localhost:8181/api/pws';

function ContentList() {
    const { managementId, setManagementId } = useContext(PwsContext);
    const { serialNo, setSerialNo } = useContext(SN_Context);
    const { refresh, setRefresh} = useContext(R_Context);
    // PWS UI정보
    const [contents, setContents] = useState([]);

    // pws json
    const [pwsInfo, setPwsInfo] = useState({});

    const [bUploadDisabled, setBUploadDisabled] = useState(true);
    const [bModifyDisabled, setBModifyDisabled] = useState(true);
    const [btnMode, setBtnMode] = useState(true);

    const [getConfirmationYN, ConfirmationYN, getConfirmationOK, ConfirmationOK] = useConfirm();

    const [isOpen, setIsOpen] = useState(false);

    // 자산 초기화 함수 (idasset 스캔)
    function initContentsWithIdAsset() {
        let copyContents = [...contents];

        for (let i = 0; i < copyContents.length; i++) {
            if (copyContents[i].dbColumn === 'idasset') {
                copyContents[i].data = managementId;
                console.log('idasset : ', copyContents[i].data);
            }  
            else if (copyContents[i].dbColumn === 'introductiondate')
                copyContents[i].data = null;

            else
                copyContents[i].data = '';
        }
        setContents(copyContents);
        console.log('contents updated: ', contents);

        let info = {};
        for (let i = 0; i < copyContents.length; i++) {
            info[copyContents[i].dbColumn] = copyContents[i].data;
        }
        setPwsInfo(info);

        console.log(pwsInfo);
    }

    // 자산 초기화 함수 (sn 스캔)
    function initContentsWithSN() {
        let copyContents = [...contents];

        for (let i = 0; i < copyContents.length; i++) {
            if (copyContents[i].dbColumn === 'sn') {
                copyContents[i].data = serialNo;
                console.log('sn : ', copyContents[i].data);
            }
            else if (copyContents[i].dbColumn === 'introductiondate')
                copyContents[i].data = null;

            else
                copyContents[i].data = '';
        }
        setContents(copyContents);
        console.log('contents updated: ', contents);

        let info = {};
        for (let i = 0; i < copyContents.length; i++) {
            info[copyContents[i].dbColumn] = copyContents[i].data;
        }
        setPwsInfo(info);

        console.log(pwsInfo);
    }

    // 각 PWS 입력 항목 update 함수
    const update = item => {
        let copyContents = [...contents];
        for (let i = 0; i < copyContents.length; i++) {
            if (copyContents[i].columnName === item.columnName) {
                copyContents[i].data = item.data;
                break;
            }
        }
        setContents(copyContents);
        console.log('contents updated: ', contents);
        let info = {};
        for (let i = 0; i < copyContents.length; i++) {
            info[copyContents[i].dbColumn] = copyContents[i].data;
        }
        setPwsInfo(info);
        console.log(pwsInfo);
        if (contents[0].data != null)
            setBtnMode(false);
        else
            setBtnMode(true);
    };

    // DB에서 읽은 PWS정보를 PWS UI정보에 저장
    function insertPwsFromDB(pws) {
        let copyContents = [...contents];
        for (let dbCol in pws) {
            loop: for (let i = 0; i < copyContents.length; i++) {
                for (let item in copyContents[i]) {
                    if (dbCol === copyContents[i][item]) {
                        copyContents[i].data = pws[dbCol];
                        break loop;
                    }
                }
            }
        }
        setContents(copyContents);
        console.log('contents updated: ', contents);
    }

    // PWS 정보 렌더링 
    const items = contents.map(item => {
        // console.log(item);
        if (item.data === null) {

            console.log(item)
            if (item.dbColumn === 'introductiondate')
                item.data = null;
            else
                item.data = '';
        }
        if(item.dbColumn !== 'id')
            return <Content key={item.dbColumn} item={item} update={update} />;
    });

    useEffect(() => {
        fetch(BASE_URL + `/menu`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status);
                }
                else {
                    return res.json();
                }
            })
            .then(json => {
                // 메뉴등록     
                console.log(json);
                let copyContents = [...contents];
                for (let i = 0; i < json.length; i++) {
                    /* if (json[i].column_name === 'id')
                        continue; */
                    let copyContent = {};
                    copyContent.columnName = json[i].column_comment;
                    copyContent.dbColumn = json[i].column_name;
                    if (json[i].column_name === 'idasset' || json[i].column_name === 'sn' || json[i].column_name === 'introductiondate')
                        copyContent.req = 'y';
                    copyContents.push(copyContent);
                }
                setContents(copyContents);
                console.log(copyContents);
                console.log('자산 세부항목 정보 fetch 완료!');
            })
            .catch((error) => {
                console.log('error: ' + error);
                getConfirmationOK(`DB에서 자산 세부항목 정보를 가져오지 못했습니다. ${error}`);
            })
    }, []);

    // 자산관리번호 스캔 발생하면 자산관리번호 update 함수 호출하고 재랜더링
    useEffect(() => {
        if (managementId !== '' && managementId !== null && managementId !== undefined ) {
            fetch(BASE_URL + `/idasset/${managementId}`)
                .then(res => {
                    if (res.status === 404) {

                        const onRegPWS = async () => {

                            const status = await getConfirmationYN(`자산관리번호(${managementId}) 자산을 등록하겠습니까?`);
                            console.log('getConfirmationYN returns : ', status);

                            if (status) {
                                initContentsWithIdAsset();
                                setBtnMode(true);
                                setBUploadDisabled(false);
                                setBModifyDisabled(true);
                                console.log('reg returned!');
                                return;
                            }
                            else {
                                console.log('return null!');
                                setManagementId('');
                                setIsOpen(false);
                                return;
                            }
                        };
                        onRegPWS();
                    }
                    else if (!res.ok) {
                        throw new Error(res.status);
                    }
                    else {
                        setBtnMode(true);
                        setBModifyDisabled(false);
                        setBUploadDisabled(true);
                        return res.json();
                    }
                })
                .then(json => {
                    console.log('json : ', json);
                    insertPwsFromDB(json);
                })
                .catch((error) => {
                    console.log('error: ' + error);
                    getConfirmationOK(`자산관리번호(${managementId}) 자산 조회 실패(${error})`);
                })
            setIsOpen(true);
        }
    }, [managementId]);

    // SN 스캔 발생하면 SN update 함수 호출하고 재랜더링
    useEffect(() => {
        console.log(serialNo)
        if (serialNo !== '' && serialNo !== null && serialNo !== undefined) {
            fetch(BASE_URL + `/sn/${serialNo}`)
                .then(res => {
                    if (res.status === 404) {

                        const onRegPWS = async () => {

                            const status = await getConfirmationYN(`S/N(${serialNo}) 자산을 등록하겠습니까?`);
                            console.log('getConfirmationYN returns : ', status);

                            if (status) {
                                initContentsWithSN();
                                setBtnMode(true);
                                setBUploadDisabled(false);
                                setBModifyDisabled(true);
                                console.log('reg returned!');
                                return;
                            }
                            else {
                                console.log('return null!');
                                setSerialNo('');
                                setIsOpen(false);
                                return;
                            }
                        };
                        onRegPWS();
                    }
                    else if (!res.ok) {
                        throw new Error(res.status);
                    }
                    else {
                        setBtnMode(true);
                        setBModifyDisabled(false);
                        setBUploadDisabled(true);
                        return res.json();
                    }
                })
                .then(json => {
                    console.log('json : ', json);
                    insertPwsFromDB(json);
                })
                .catch((error) => {
                    console.log('error: ' + error);
                    getConfirmationOK(`S/N(${serialNo}) 자산 조회 실패(${error})`);
                })
            setIsOpen(true);
        }

    }, [serialNo]);

    const onClickUploadHandler = e => {
        
        for (let key in pwsInfo) {
            const value = pwsInfo[key];
            if(value != null)
                if(value.trim() === '')
                    pwsInfo[key] = null;
                else
                    pwsInfo[key] = value.trim();
        }
        console.log('pwsInfo : ', pwsInfo);

        let msg = '';
        fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(pwsInfo)
        })
            .then(res => {
                if (!res.ok) {
                    msg = `status(${res.status}) `
                    return res.json();
                }
                else {
                    setBtnMode(true);
                    setBUploadDisabled(true);
                    setBModifyDisabled(false);
                    return res.json();
                }
            })
            .then(json => {    
                if(json.count && json.pwsDtos) {   // SQL이 정상동작했다면 PwsDto을 response            
                    if (pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                        getConfirmationOK(`${pwsInfo.idasset} DB 저장 완료!`);
                    else
                        getConfirmationOK(`${pwsInfo.sn} DB 저장 완료!`);

                    setRefresh(!refresh);
                }
                else
                    throw new Error(msg.concat(json.cause.message));
            })
            .catch(error => {
                if(pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                    getConfirmationOK(`${pwsInfo.idasset} DB 저장 실패 (${error})`);
                else
                    getConfirmationOK(`${pwsInfo.sn} DB 저장 실패 (${error})`);
            });
    };


    const onClickModifyHandler = e => {
        
        for (let key in pwsInfo) {
            const value = pwsInfo[key];
            console.log(typeof value)
            
            if(typeof value === 'string' && value != null)
                if(value.trim() === '')
                    pwsInfo[key] = null;
                else
                    pwsInfo[key] = value.trim();
        }
        console.log('pwsInfo : ', pwsInfo);
        console.log(`managementId: ${managementId}, serialNo: ${serialNo}`)

        if ((pwsInfo.idasset === null || pwsInfo.idasset === '') && (pwsInfo.sn === null || pwsInfo.sn === '')) {
            getConfirmationOK('해당 PWS의 자산관리번호와 S/N 중에서 최소 하나는 입력되어야 수정이 가능합니다.');
            return;
        }
        let msg = '';
        fetch(BASE_URL, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(pwsInfo)
        })
            .then(res => {
                if (!res.ok) {
                    msg = `status(${res.status}) `
                    return res.json();
                }
                else {
                    setBtnMode(true);
                    return res.json();
                }
            })
            .then(json => {
                console.log(json)
                if (json.count) {   // SQL이 정상동작했다면 PwsDto을 response
                    if (pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                        getConfirmationOK(`${pwsInfo.idasset} DB 저장 완료!`);
                    else
                        getConfirmationOK(`${pwsInfo.sn} DB 저장 완료!`);

                    setRefresh(!refresh);
                }
                else
                    throw new Error(msg.concat(json.cause.message));

            })
            .catch(error => {
                if(pwsInfo.idasset !== null && pwsInfo.idasset !== '')
                    getConfirmationOK(`${pwsInfo.idasset} DB 저장 실패 (${error})`);
                else
                    getConfirmationOK(`${pwsInfo.sn} DB 저장 실패 (${error})`);
                
            });
    };

    const onClickCloseHanler = (e) => {
        setIsOpen(!isOpen);
        setManagementId('');
        setSerialNo('');
        const inputScanCode = document.getElementById("inputScanCode");
        if(inputScanCode)
            inputScanCode.focus();
    };

    return (
        <div className={isOpen ? "show-list" : "hide-list"}>
            <ConfirmationYN />
            <ConfirmationOK />
            <Paper sx={{
                width: 400,
                borderRadius: 1, borderColor: "#000",
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFC',
            }} elevation={8}>
                <List>
                    {items}
                </List>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="secondary" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} disabled={Boolean(bUploadDisabled | btnMode)} onClick={onClickUploadHandler}>upload</Button>
                    <Button variant="contained" color="success" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} disabled={Boolean(bModifyDisabled | btnMode)} onClick={onClickModifyHandler}>modify</Button>
                    <Button variant="contained" sx={{ width: 80, height: 19, padding: 1, mb: 1, mr: 1 }} onClick={onClickCloseHanler}>close</Button>
                </div>
            </Paper>
        </div>
    );
}

export default ContentList;