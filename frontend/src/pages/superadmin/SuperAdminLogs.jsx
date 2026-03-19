import React, { useEffect, useState } from "react";
import API from "../../services/api";
import LogsTable from "../../components/LogsTable";

const SuperAdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await API.get("/activity/logs");
      setLogs(res.data.data);
    } catch (error) {
      console.error("Error fetching logs", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    return roleFilter ? log.user_role === roleFilter : true;
  });

  return (
    <div>
      <h2>Super Admin Activity Logs</h2>

      {/* Filter */}
      <select onChange={(e) => setRoleFilter(e.target.value)}>
        <option value="">All</option>
        <option value="ADMIN">Admin</option>
        <option value="EMPLOYEE">Employee</option>
      </select>

      <LogsTable logs={filteredLogs} />
    </div>
  );
};

export default SuperAdminLogs;