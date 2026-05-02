// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import ContextPanel from '../components/layout/ContextPanel';
import { useWindowSize } from '../hooks/useWindowSize';

export default function DashboardLayout() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'var(--dash-bg)',
        overflow: 'hidden',
      }}
    >
      {/* Left: Sidebar */}
      <Sidebar />

      {/* Right: TopBar + Page content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <TopBar />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Right: Context Panel (Visible on Desktop) */}
      <ContextPanelWrapper />
    </div>
  );
}

function ContextPanelWrapper() {
  const { width } = useWindowSize();
  const isDesktop = width >= 1200;

  if (!isDesktop) return null;

  return <ContextPanel />;
}
