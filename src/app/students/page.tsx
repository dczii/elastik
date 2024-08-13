"use client";
import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";
import Button from "devextreme-react/button";
import { useAuthentication } from "@/hooks/useAuthentication";
import DataGrid, { Column } from "devextreme-react/data-grid";
import { Toast } from "devextreme-react/toast";

const columns = ["ID", "FirstName", "LastName", "DateOfBirth", "CreatedBy", ""];
const url = "https://vdr0g45lhg.execute-api.ap-southeast-2.amazonaws.com/students";
const headers = {
  "Content-Type": "application/json",
};

const StudentsPage = () => {
  const { user, signOut } = useAuthentication();
  const [listData, setListData] = useState([]);
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    type: "info",
    message: "",
  } as {
    isVisible: boolean;
    type: "info" | "error" | "success";
    message: string;
  });

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = user?.user && user.fullName;
    if (!isAuthenticated) {
      router.push("/");
    }
  }, []);

  const getStudentsList = async () => {
    const response = await fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => JSON.parse(data.body))
      .catch((error) => {
        console.error("Error:", error);
      });

    setListData(
      response.map((res) => ({
        ID: res.user,
        FirstName: res.firstName,
        LastName: res.lastName,
        DateOfBirth: res.dateOfBirth,
        CreatedBy: res.createdBy,
      }))
    );
    console.log("response", response);
  };

  useEffect(() => {
    getStudentsList();
  }, []);

  const handleLogout = () => {
    signOut();
    router.push("/");
  };

  const onHiding = useCallback(() => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }, [toastConfig, setToastConfig]);

  const handleDelete = async (data: any) => {
    const body = { user: data.ID, firstName: data.FirstName, lastName: data.LastName };
    await fetch(url, {
      headers,
      method: "DELETE",
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.ok) {
          setToastConfig({
            isVisible: true,
            type: "success",
            message: `${body.firstName} ${body.lastName} is successfully Deleted!`,
          });
        } else {
          console.error("Failed to delete the item");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <header className='flex justify-between items-center'>
        <div>Welcome, {user?.fullName}</div>
        <Button text='Logout' onClick={handleLogout} />
      </header>
      <main>
        <h2>Student Dashboard</h2>
        {/* Your student content goes here */}
        <DataGrid
          dataSource={listData}
          keyExpr='ID'
          defaultColumns={columns}
          showBorders={true}
          editing={{ allowDeleting: true }}
          onRowRemoved={(e) => handleDelete(e.data)}
        >
          {columns.map((column, index) => (
            <Column dataField={column} key={index} />
          ))}
        </DataGrid>
      </main>
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

export default StudentsPage;
