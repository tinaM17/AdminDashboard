import "./home.css";
import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editableRows, setEditableRows] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setUsers(res.data);
      setFilteredUsers(res.data); // Initial state for filteredUsers
    } catch (error) {
      console.log(error);
    }
  };

  // Handle search/filtering
  const handleSearch = (value) => {
    const filtered = users.filter((user) => {
      const lowerCasedValue = value.toLowerCase();
      return (
        user.name.toLowerCase().includes(lowerCasedValue) ||
        user.email.toLowerCase().includes(lowerCasedValue) ||
        user.role.toLowerCase().includes(lowerCasedValue)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset current page to 1 when filtering
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Paginate the users based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Change page function
  const changePage = (page) => {
    setCurrentPage(page);
  };

  const toggleSelectAll = () => {
    const allUsersOnCurrentPage = filteredUsers.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    const allUserIdsOnCurrentPage = allUsersOnCurrentPage.map(
      (user) => user.id
    );

    if (selectedRows.length === allUsersOnCurrentPage.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allUserIdsOnCurrentPage);
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const deleteSelectedRows = () => {
    const updatedUsers = filteredUsers.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  const toggleEditRow = (id) => {
    if (editableRows.includes(id)) {
      setEditableRows(editableRows.filter((editableId) => editableId !== id));
    } else {
      setEditableRows([...editableRows, id]);
    }
  };

  const handleEditChange = (id, field, value) => {
    const updatedUsers = filteredUsers.map((user) =>
      user.id === id ? { ...user, [field]: value } : user
    );
    setFilteredUsers(updatedUsers);
  };

  const deleteCurrentRow = (id) => {
    const updatedUsers = filteredUsers.filter((user) => user.id !== id);
    setFilteredUsers(updatedUsers);
  };


  return (
    <div className="home">
      <div className="search">
        <form className="form">
          <input
            type="text"
            name="search"
            placeholder="Enter Value"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <button
          type="button"
          className="allDelete"
          onClick={deleteSelectedRows}
          disabled={selectedRows.length === 0}
        >
          {selectedRows.length > 0 ? (
            <img src="./delete.png" alt="" />
          ) : (
            <span></span>
          )}
        </button>
      </div>
      <div className="content">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedRows.length === itemsPerPage}
                  onChange={toggleSelectAll}
                />
                <label htmlFor="selectAll" style={{ marginLeft: "10px" }}>
                  Select All
                </label>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                style={{
                  backgroundColor: selectedRows.includes(user.id)
                    ? "lightgray"
                    : "inherit",
                  color: selectedRows.includes(user.id) ? "black" : "inherit",
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => toggleSelectRow(user.id)}
                  />
                </td>
                <td>
                  {editableRows.includes(user.id) ? (
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        handleEditChange(user.id, "name", e.target.value)
                      }
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editableRows.includes(user.id) ? (
                    <input
                      type="text"
                      value={user.email}
                      onChange={(e) =>
                        handleEditChange(user.id, "email", e.target.value)
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editableRows.includes(user.id) ? (
                    <input
                      type="text"
                      value={user.role}
                      onChange={(e) =>
                        handleEditChange(user.id, "role", e.target.value)
                      }
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td>
                  <div className="actions">
                    {editableRows.includes(user.id) ? (
                      <button onClick={() => toggleEditRow(user.id)}>
                        <img src="./download.png" alt="" />
                      </button>
                    ) : (
                      <button onClick={() => toggleEditRow(user.id)}>
                        <img src="./pen.png" alt="" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteCurrentRow(user.id)}
                    >
                      <img src="./delete.png" alt="" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => changePage(1)}>First</button>
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button onClick={() => changePage(totalPages)}>Last</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
