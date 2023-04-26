import Reader from "./Reader";
import EnhancedTable from "./DataTable";
import AutoComplete from "./AutoComplete";
import Pws from "./Pws";
import Reader2 from "./Reader2";
import MyInputComponent from "./MyInputComponent";
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
        <div className="wrapper" style={{border: '1px solid', }}>
            {/* <EnhancedTable doScan={doScan}/> */}
            <Pws doScan={doScan} />

            
            {doScan ? 
            <Reader2 doScan={doScan}/>
            // <MyInputComponent></MyInputComponent>
            : <></>
            }   
        </div>
    );
}

export default LeftInfo;