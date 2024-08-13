"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "devextreme-react/button";
import TextBox from "devextreme-react/text-box";
import { useAuthentication } from "@/hooks/useAuthentication";
import LoadIndicator from "devextreme-react/load-indicator";

function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, setAuthData } = useAuthentication();
  useEffect(() => {
    console.log("user", user);

    const isAuthenticated = user?.user && user.fullName;
    if (isAuthenticated) {
      router.push("/students");
    }
  }, [user, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    const url = "https://sp2wgsw2ti.execute-api.ap-southeast-2.amazonaws.com/DEV";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Include your request body here as an object
        user: username,
        password,
      }),
    };

    const response = await fetch(url, options)
      .then((response) => response.json())
      .then((data) => JSON.parse(data.body).data)
      .catch((error) => {
        console.error("Error:", error);
      });

    if (response && response.user) {
      setAuthData({
        user: response.user,
        fullName: response.fullName,
      });
      router.push("students");
    } else {
      setError("Invalid Credentials!"); // Set error message
      setTimeout(() => {
        setError("");
      }, 5000);
    }
    setIsLoading(false);
  };

  return (
    <div className='flex w-full justify-center flex-col max-w-[50vw] mx-auto h-full gap-5'>
      <h1>Login</h1>
      <TextBox placeholder='Username' onValueChanged={(e) => setUsername(e.value)} />
      <TextBox
        placeholder='Password'
        mode='password'
        onValueChanged={(e) => setPassword(e.value)}
      />
      {error && <p className='text-red-500'>{error}</p>} {/* Render error message */}
      <Button
        disabled={isLoading}
        text={isLoading ? undefined : "Submit"}
        onClick={handleLogin}
        type='normal'
        stylingMode='outlined'
        className='text-white'
      >
        {isLoading && (
          <div className='flex items-center justify-center w-full h-full'>
            <LoadIndicator width={24} height={24} />
          </div>
        )}
      </Button>
      <Button
        disabled={isLoading}
        text='Create New Account'
        onClick={() => router.push("/register")}
        type='normal'
        stylingMode='outlined'
      />
    </div>
  );
}

export default LoginPage;
