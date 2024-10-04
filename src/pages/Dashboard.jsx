import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  const [data, setData] = useState([]); // Store fetched data
  const [statusFilter, setStatusFilter] = useState('All'); // Store selected status
  const [chartType, setChartType] = useState('Bar'); // Store selected chart type

  const statuses = ['All', 'Pending', 'Approved', 'Rejected']; // Status options
  const chartTypes = ['Bar', 'Pie', 'Line']; // Chart type options

  // Fetch data from users.json on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/users.json');
        const jsonData = await response.json();
        setData(jsonData); // Store fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Generate months for the year 2021
  const generateMonths = () => {
    const months = [];
    const year = 2021;

    for (let month = 0; month < 12; month++) {
      months.push(new Date(year, month).toLocaleString('default', { month: 'long' }));
    }

    return months;
  };

  // Group data by month and status
  const groupByMonthAndStatus = () => {
    const groupedData = {};
    const allMonths = generateMonths();

    data.forEach((conn) => {
      const date = new Date(conn.Date_of_Application); // Parse date
      if (date.getFullYear() === 2021) { // Ensure year is 2021
        const monthYear = date.toLocaleString('default', { month: 'long' });
        const status = conn.Status;

        if (!groupedData[monthYear]) {
          groupedData[monthYear] = { Pending: 0, Approved: 0, Rejected: 0 };
        }
        if (status in groupedData[monthYear]) {
          groupedData[monthYear][status]++;
        }
      }
    });

    // Fill in months without data
    allMonths.forEach((month) => {
      if (!groupedData[month]) {
        groupedData[month] = { Pending: 0, Approved: 0, Rejected: 0 };
      }
    });

    return Object.entries(groupedData).map(([month, statuses]) => ({
      month,
      Pending: statuses.Pending,
      Approved: statuses.Approved,
      Rejected: statuses.Rejected,
      Total: statuses.Pending + statuses.Approved + statuses.Rejected, // Total connections for the month
    }));
  };

  // Filter data based on status selection
  const filteredData = () => {
    const grouped = groupByMonthAndStatus();

    // Sort the grouped data based on the order in generateMonths
    const monthsOrder = generateMonths(); // Get the correct order of months

    return grouped
      .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month)) // Sort based on monthsOrder
      .map(({ month, Pending, Approved, Rejected, Total }) => ({
        month,
        Pending: statusFilter === 'All' || statusFilter === 'Pending' ? Pending : 0,
        Approved: statusFilter === 'All' || statusFilter === 'Approved' ? Approved : 0,
        Rejected: statusFilter === 'All' || statusFilter === 'Rejected' ? Rejected : 0,
        Total,
      }))
      .filter(({ Pending, Approved, Rejected }) =>
        Pending > 0 || Approved > 0 || Rejected > 0 || statusFilter === 'All'
      );
  };

  // Render the appropriate chart based on the selected chart type
  const renderChart = () => {
    const data = filteredData();

    switch (chartType) {
      case 'Bar':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Number of Connections', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pending" fill="#ff7f0e" />
            <Bar dataKey="Approved" fill="#2ca02c" />
            <Bar dataKey="Rejected" fill="#d62728" />
            <Bar dataKey="Total" fill="#8884d8" /> {/* Total connections for each month */}
          </BarChart>
        );
      case 'Pie':
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey="Total"
              nameKey="month"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            />
          </PieChart>
        );
      case 'Line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Number of Connections', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Pending" stroke="#ff7f0e" />
            <Line type="monotone" dataKey="Approved" stroke="#2ca02c" />
            <Line type="monotone" dataKey="Rejected" stroke="#d62728" />
            <Line type="monotone" dataKey="Total" stroke="#8884d8" /> {/* Total connections */}
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Connection Requests Dashboard - 2021</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '80px' }}>
        {/* Status filter dropdown */}
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

        {/* Chart type filter dropdown */}
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

      {/* Render the selected chart */}
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
