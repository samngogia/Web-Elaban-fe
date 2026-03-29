
// function FormatNumber(x?: number): string {
//     if (x == null || Number.isNaN(x)) {
//         return "0";
//     }

//     return x.toLocaleString("vi-VN");
// }

// export default FormatNumber;

// File: src/layout/utils/FormatNumber.tsx
import React from "react";

// Định nghĩa Interface cho Props (dùng khi gọi kiểu <FormatNumber />)
interface FormatNumberProps {
    number?: number;
}

// 1. Định nghĩa hàm logic riêng
export const formatNumberFunction = (x?: number): string => {
    if (x == null || Number.isNaN(x)) {
        return "0";
    }
    return x.toLocaleString("vi-VN");
};

// 2. Định nghĩa Component (dùng hàm logic ở trên)
const FormatNumber: React.FC<FormatNumberProps> = ({ number }) => {
    return <span>{formatNumberFunction(number)}</span>;
};

// Vừa cho phép gọi FormatNumber(value) vừa cho phép gọi <FormatNumber number={value} />
// Chúng ta gán hàm vào chính object Component
Object.assign(FormatNumber, {
    toString: () => "FormatNumber", // Tránh lỗi log
});

// Xuất ra để dùng như một hàm ở các file báo lỗi
export default Object.assign(
    (x: any) => {
        if (typeof x === 'object' && 'number' in x) {
            return <FormatNumber number={x.number} />;
        }
        return formatNumberFunction(x);
    },
    FormatNumber
) as any;