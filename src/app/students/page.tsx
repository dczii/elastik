"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import Button from "devextreme-react/button";
import { useAuthentication } from "@/hooks/useAuthentication";
import DataGrid, { Column } from "devextreme-react/data-grid";

const columns = ["ID", "FirstName", "LastName", "DateOfBirth", "CreatedBy", ""];

const StudentsPage = () => {
  const { user, signOut } = useAuthentication();
  const [listData, setListData] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = user?.user && user.fullName;
    if (!isAuthenticated) {
      router.push("/");
    }
  }, []);

  const getStudentsList = async () => {
    const url = "https://vdr0g45lhg.execute-api.ap-southeast-2.amazonaws.com/students";
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

  const handleDelete = async (id) => {
    const url = `https://vdr0g45lhg.execute-api.ap-southeast-2.amazonaws.com/students/${id}`;
    await fetch(url, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setListData(listData.filter((item) => item.ID !== id));
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
        >
          {columns.map((column, index) => (
            <Column dataField={column} key={index} />
          ))}
        </DataGrid>
      </main>
    </div>
  );
};

export default StudentsPage;
