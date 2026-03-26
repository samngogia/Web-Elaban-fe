import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    isAdmin: boolean;
    isStaff: boolean;
    isCustomer: boolean;
}

const RequireAdmin = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const WithAdminCheck: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const token = localStorage.getItem('token');
            console.log("Token: " + token);
            //Trong tinh huong chua dang nhap

            if (!token) {
                navigate("/login");
                return ;
            } else {
                //Giai ma token

                const decodedToken = jwtDecode(token) as JwtPayload;
                console.log(decodedToken);

                //lay thong tin cu the
                const isAdmin = decodedToken.isAdmin;

                //kiem tra khong phai la admin
                if (!isAdmin) {
                    navigate("/login");
                    return;
                }
            }
        }, [navigate]);

        return <WrappedComponent {...props} />
    }
    return WithAdminCheck;
}
export default RequireAdmin;