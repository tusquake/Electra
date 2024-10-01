// src/components/Dashboard.js
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [chartType, setChartType] = useState('Bar');

  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];
  const chartTypes = ['Bar', 'Pie', 'Line'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/users.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const groupByMonthAndStatus = () => {
    const groupedData = {};

    data.forEach((conn) => {
      const date = new Date(conn.Date_of_Application.split('/').reverse().join('-'));
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      const status = conn.Status;

      if (!groupedData[month]) {
        groupedData[month] = { Pending: 0, Approved: 0, Rejected: 0 };
      }
      if (status in groupedData[month]) {
        groupedData[month][status]++;
      }
    });

    return Object.entries(groupedData).map(([month, statuses]) => ({
      month,
      ...statuses,
    }));
  };

  const filteredData = () => {
    const grouped = groupByMonthAndStatus();
    return grouped
      .map(({ month, Pending, Approved, Rejected }) => ({
        month,
        Pending: statusFilter === 'All' || statusFilter === 'Pending' ? Pending : 0,
        Approved: statusFilter === 'All' || statusFilter === 'Approved' ? Approved : 0,
        Rejected: statusFilter === 'All' || statusFilter === 'Rejected' ? Rejected : 0,
      }))
      .filter(({ Pending, Approved, Rejected }) =>
        Pending > 0 || Approved > 0 || Rejected > 0
      );
  };

  const pieChartData = [
    { name: 'Pending', value: data.filter(conn => conn.Status === 'Pending').length },
    { name: 'Approved', value: data.filter(conn => conn.Status === 'Approved').length },
    { name: 'Rejected', value: data.filter(conn => conn.Status === 'Rejected').length },
  ];

  return (
    <div className="dashboard-container">
      <h2>Connection Requests Dashboard</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '100px' }}>
        {/* Status Selection */}
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Chart Type Selection */}
        <FormControl variant="outlined" style={{ minWidth: 120 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            label="Chart Type"
          >
            {chartTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Chart Rendering */}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'Bar' && (
          <BarChart data={filteredData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pending" fill="#ff7f0e" />
            <Bar dataKey="Approved" fill="#2ca02c" />
            <Bar dataKey="Rejected" fill="#d62728" />
          </BarChart>
        )}

        {chartType === 'Pie' && (
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={['#ff7f0e', '#2ca02c', '#d62728'][index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}

        {chartType === 'Line' && (
          <LineChart data={filteredData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Pending" stroke="#ff7f0e" />
            <Line type="monotone" dataKey="Approved" stroke="#2ca02c" />
            <Line type="monotone" dataKey="Rejected" stroke="#d62728" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
