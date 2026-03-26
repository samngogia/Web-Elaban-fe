import { useEffect, useState } from "react";

function ActivateAccount() {
    const [email, setEmail] = useState("");
    const [activationCode, setActivationCode] = useState("");
    const [isActivated, setIsActivated] = useState(false);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const emailParam = searchParams.get("email");
        const activationCodeParam = searchParams.get("activationCode");

        if (emailParam && activationCodeParam) {
            setEmail(emailParam);
            setActivationCode(activationCodeParam);
            handleActivation(emailParam, activationCodeParam);
        }
    }, []);

    const handleActivation = async (emailAddr: string, code: string) => {
        try {
            // Sử dụng tham số truyền trực tiếp để đảm bảo giá trị mới nhất
            const url = `http://localhost:8089/account/activate?email=${emailAddr}&activationCode=${code}`;
            const response = await fetch(url, { method: "GET" });

            if (response.ok) {
                setIsActivated(true);
            } else {
                const errorText = await response.text();
                setNotification(errorText);
            }
        } catch (error) {
            console.log("Error during activation: ", error);
            setNotification("An error occurred during account activation.");
        }
    }

    return (
        <div className="container mt-5 text-center">
            <h1>Account Activation</h1>
            {
                isActivated
                ? ( 
                    <div className="alert alert-success mt-4">
                        <p>Your account has been activated successfully!</p>
                        <p>Please <a href="/login">Login</a> to continue using our services.</p>
                    </div>
                )
                : (
                    <div className="alert alert-danger mt-4">
                        <p>{notification || "Activating your account, please wait..."}</p>
                    </div>
                )
            }
        </div>
    );
}

export default ActivateAccount;