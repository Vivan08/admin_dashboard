import React, { useEffect, useRef } from 'react';
import './Chart.css';

const Chart = ({ type = 'line', data, options = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (type === 'line') {
      drawLineChart(ctx, data, width, height, padding);
    } else if (type === 'bar') {
      drawBarChart(ctx, data, width, height, padding);
    } else if (type === 'doughnut') {
      drawDoughnutChart(ctx, data, width, height);
    }
  }, [data, type]);

  const drawLineChart = (ctx, data, width, height, padding) => {
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data.datasets[0].data);
    const minValue = 0;
    const valueRange = maxValue - minValue;

    const xStep = chartWidth / (data.labels.length - 1);
    const yScale = chartHeight / valueRange;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw line
    data.datasets.forEach((dataset, datasetIndex) => {
      ctx.strokeStyle = dataset.borderColor || '#00e5ff';
      ctx.lineWidth = 2;
      ctx.beginPath();

      dataset.data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - (value - minValue) * yScale;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw gradient fill
      if (dataset.fill) {
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, dataset.backgroundColor || 'rgba(0, 229, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.lineTo(width - padding, height - padding);
        ctx.lineTo(padding, height - padding);
        ctx.closePath();
        ctx.fill();
      }

      // Draw points
      ctx.fillStyle = dataset.pointBackgroundColor || '#00e5ff';
      dataset.data.forEach((value, index) => {
        const x = padding + index * xStep;
        const y = height - padding - (value - minValue) * yScale;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Space Mono';
    ctx.textAlign = 'center';
    data.labels.forEach((label, index) => {
      const x = padding + index * xStep;
      ctx.fillText(label, x, height - padding + 20);
    });
  };

  const drawBarChart = (ctx, data, width, height, padding) => {
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...data.datasets[0].data);
    const barWidth = chartWidth / data.labels.length * 0.6;
    const barSpacing = chartWidth / data.labels.length;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw bars
    data.datasets[0].data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * barSpacing + (barSpacing - barWidth) / 2;
      const y = height - padding - barHeight;

      // Gradient for bars
      const gradient = ctx.createLinearGradient(x, y, x, height - padding);
      gradient.addColorStop(0, data.datasets[0].backgroundColor[index] || '#00e5ff');
      gradient.addColorStop(1, 'rgba(0, 229, 255, 0.3)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Value on top
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillText(value, x + barWidth / 2, y - 8);
    });

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Space Mono';
    ctx.textAlign = 'center';
    data.labels.forEach((label, index) => {
      const x = padding + index * barSpacing + barSpacing / 2;
      ctx.fillText(label, x, height - padding + 20);
    });
  };

  const drawDoughnutChart = (ctx, data, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.6;

    let currentAngle = -Math.PI / 2;
    const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);

    data.datasets[0].data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();

      ctx.fillStyle = data.datasets[0].backgroundColor[index];
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelRadius = radius + 30;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillText(`${data.labels[index]}: ${value}`, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Syne';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, centerX, centerY);
    ctx.font = '12px Space Mono';
    ctx.fillText('Total', centerX, centerY + 20);
  };

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} className="chart-canvas" />
    </div>
  );
};

export default Chart;