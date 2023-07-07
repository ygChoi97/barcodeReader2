import Reader from "./Reader";
import EnhancedTable from "./DataTable";
import AutoComplete from "./AutoComplete";
import Pws from "./Pws";
import Reader2 from "./Reader2";
import "../css/foot.css";
import COMNPRO from "../comnpro_logo_white.png"
import MyInputComponent from "./MyInputComponent";
import ContentList from "./ContentList";
const BASE_URL = 'http://localhost:8181/api/pws';

function LeftInfo({doScan}) {

    // return(
    //     // <div className="wrapper" style={{border:'solid 1px'}}>
    //     <div className="wrapper">
    //         {
    //         doScan ? 
    //             <Reader/>
    //              :
    //             <EnhancedTable item={menu}/>
    //         }
    //     </div>
    // );

    console.log('LeftInfo() 렌더링')
    return (
        <div className="wrapper">
            <ContentList doScan={doScan} />
            {/* <EnhancedTable doScan={doScan}/> */}
            <Pws doScan={doScan} />

            
            {doScan ? 
            <Reader2 doScan={doScan}/>
            : <></>
            }  
            {/* <div className="foot-container" >
                <div className="company-foot"><img src={COMNPRO} alt="컴앤프로정보기술" width='23rem' /><div style={{ marginLeft: '0.2rem' }}>컴앤프로정보기술(주)</div></div> 
            </div> */}
            <div className="foot-container" >
                <div className="company-foot"><img src={COMNPRO} alt="컴앤프로정보기술" width='37rem' />
                    <div style={{ fontSize: '0.7rem', margin: '0 0.8rem'}}>
                        <div>Com & Pro</div>
                        {/* <div>Information Technology</div> */}
                        <div>컴앤프로 정보기술(주)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeftInfo;