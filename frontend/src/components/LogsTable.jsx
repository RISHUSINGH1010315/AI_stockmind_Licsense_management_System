import React from "react";

const LogsTable = ({ logs }) => {
  return (
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Role</th>
          <th>Action</th>
          <th>Details</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id}>
            <td>{log.user_id}</td>
            <td>{log.user_role}</td>
            <td>{log.action}</td>
            <td>{log.details}</td>
            <td>{new Date(log.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LogsTable;