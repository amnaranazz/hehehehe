import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'];

// Generate mock data for the heatmap
const generateHeatmapData = () => {
  const data = [];
  for (let d = 0; d < DAYS.length; d++) {
    for (let h = 0; h < HOURS.length; h++) {
      // Create some peak hours around 12PM-2PM and 6PM-8PM, mostly weekdays
      let intensity = Math.random() * 20;
      if (h >= 2 && h <= 3) intensity += 40; // Lunch peak
      if (h >= 5 && h <= 6) intensity += 50; // Evening peak
      if (d >= 5) intensity *= 0.6; // Lower on weekends
      
      data.push({
        day: d,
        hour: h,
        value: Math.floor(intensity)
      });
    }
  }
  return data;
};

const heatmapData = generateHeatmapData();
const maxValue = Math.max(...heatmapData.map(d => d.value));

export default function SalesHeatmap({ selectedPeriod }) {
  return (
    <div className="dash-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(249,115,22,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Clock size={16} color="var(--orange, #f97316)" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--navy)' }}>
            Sales Heatmap
          </h3>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--gray-400)' }}>
            Order frequency by day & time
          </p>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 250 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(${DAYS.length}, 1fr)`, gap: 4, flex: 1 }}>
          {/* Top-left empty cell */}
          <div></div>
          
          {/* Day headers */}
          {DAYS.map(day => (
            <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', alignSelf: 'end', paddingBottom: 8 }}>
              {day}
            </div>
          ))}

          {/* Grid rows */}
          {HOURS.map((hour, hIndex) => (
            <React.Fragment key={hour}>
              {/* Hour label */}
              <div style={{ textAlign: 'right', paddingRight: 8, fontSize: '0.7rem', fontWeight: 500, color: 'var(--gray-400)', alignSelf: 'center' }}>
                {hour}
              </div>
              
              {/* Cells */}
              {DAYS.map((day, dIndex) => {
                const cellData = heatmapData.find(d => d.day === dIndex && d.hour === hIndex) || { value: 0 };
                const intensity = cellData.value / maxValue;
                
                // Color scale from light orange to dark orange/red
                const bgColor = `rgba(249, 115, 22, ${0.1 + intensity * 0.9})`;
                
                return (
                  <motion.div
                    key={`${day}-${hour}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: (dIndex * HOURS.length + hIndex) * 0.005 }}
                    style={{
                      background: bgColor,
                      borderRadius: 4,
                      minHeight: 24,
                      cursor: 'pointer',
                      border: '1px solid rgba(0,0,0,0.03)'
                    }}
                    title={`${day} ${hour}: ${cellData.value} orders`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: '1rem', fontSize: '0.7rem', color: 'var(--gray-500)' }}>
        <span>Less</span>
        <div style={{ display: 'flex', gap: 2 }}>
          {[0.2, 0.4, 0.6, 0.8, 1].map(op => (
            <div key={op} style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(249, 115, 22, ${op})` }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
