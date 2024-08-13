"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import { Toast } from "devextreme-react/toast";
import LoadIndicator from "devextreme-react/load-indicator";
import { useAuthentication } from "@/hooks/useAuthentication";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    type: "info",
    message: "",
  } as {
    isVisible: boolean;
    type: "info" | "error" | "success";
    message: string;
  });
  const { user, setAuthData } = useAuthentication();

  const onHiding = useCallback(() => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }, [toastConfig, setToastConfig]);

  const handleRegister = async () => {
    if (!username || !fullName || !password) {
      setToastConfig({
        isVisible: true,
        type: "error",
        message: "Fill In neccessary fields",
      });
      return;
    }
    setIsLoading(true);
    const url = "https://bwppjmz9pg.execute-api.ap-southeast-2.amazonaws.com/register";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Include your request body here as an object
        user: username,
        fullName,
        password,
      }),
    };

    const response = await fetch(url, options)
      .then((response) => response.json())
      .then((data) => JSON.parse(data.body))
      .catch((error) => {
        console.error("Error:", error);
      });

    if (response.message === "User already exists") {
      setToastConfig({
        isVisible: true,
        type: "error",
        message: response.message,
      });
    } else {
      setToastConfig({
        isVisible: true,
        type: "success",
        message: "Register Successfully! Redirecting.... ",
      });
      setAuthData({
        user: response.user,
        fullName: response.fullname,
      });

      setTimeout(() => {
        router.push("/register");
      }, 3000);
    }

    setIsLoading(false);
  };

  return (
    <div className='flex w-full justify-center flex-col max-w-[50vw] mx-auto h-full gap-5'>
      <h1>Register</h1>
      <TextBox placeholder='Username' onValueChanged={(e) => setUsername(e.value)} />
      <TextBox placeholder='Full Name' onValueChanged={(e) => setFullName(e.value)} />
      <TextBox
        placeholder='Password'
        mode='password'
        onValueChanged={(e) => setPassword(e.value)}
      />
      <Button text={isLoading ? undefined : "Register"} onClick={handleRegister}>
        {isLoading && (
          <div className='flex items-center justify-center w-full h-full'>
            <LoadIndicator width={24} height={24} />
          </div>
        )}
      </Button>
      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHiding={onHiding}
        displayTime={5000}
        position='top'
      />
    </div>
  );
};

export default RegisterPage;
