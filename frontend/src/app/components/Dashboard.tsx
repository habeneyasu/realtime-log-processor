"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import FileUpload from './FileUpload';
import StatsTable from './StatsTable';

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [jobStatus, setJobStatus] = useState<Record<string, string>>({});
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  // Check if the user is authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login'); // Redirect to login if no session
      }
    };
    checkSession();
  }, [router]);

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching stats from /api/stats...');
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Stats fetched successfully:', data);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Log Analytics Dashboard</h1>
      <FileUpload />
      <StatsTable stats={stats} />
      <div>
        <h2>Job Status</h2>
        {Object.entries(jobStatus).map(([jobId, status]) => (
          <p key={jobId}>{`Job ID: ${jobId} - Status: ${status}`}</p>
        ))}
      </div>
    </div>
  );
}