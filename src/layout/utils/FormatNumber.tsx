// import {inUndefined} from "util";

// function FormatNumber(x: number | undefined){
//     if(x===undefined){
//         return 0;
//     }
    
//     if(isNaN(x)){
//         return 0;
//     }
//     //Sử dụng hàm toLocalesString để định dạng số
//     return x.toLocaleString("vi-VN");
// }
// export default FormatNumber;
function FormatNumber(x?: number): string {
    if (x == null || Number.isNaN(x)) {
        return "0";
    }

    return x.toLocaleString("vi-VN");
}

export default FormatNumber;
