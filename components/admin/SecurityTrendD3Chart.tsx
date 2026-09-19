'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Clock,
  Cpu,
} from 'lucide-react';
import { SecurityTelemetryHourPoint } from '@/lib/types';

interface SecurityTrendD3ChartProps {
  timeline: SecurityTelemetryHourPoint[];
  currentScore: number;
  blockedCount: number;
}

export default function SecurityTrendD3Chart({
  timeline,
  currentScore,
  blockedCount,
}: SecurityTrendD3ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'score' | 'threats'>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '12h' | '6h'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<SecurityTelemetryHourPoint | null>(null);

  // Filter data according to timeRange
  const filteredData = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    if (timeRange === '6h') return timeline.slice(-6);
    if (timeRange === '12h') return timeline.slice(-12);
    return timeline;
  }, [timeline, timeRange]);

  // Calculations for executive stats
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { avgScore: 98, minScore: 94, totalThreats: 0, safeRatio: 100 };
    }
    const sum = filteredData.reduce((acc, p) => acc + p.zeroTrustScore, 0);
    const avgScore = (sum / filteredData.length).toFixed(1);
    const minScore = Math.min(...filteredData.map((p) => p.zeroTrustScore));
    const totalThreats = filteredData.reduce((acc, p) => acc + p.blockedThreats, 0);
    const safeCount = filteredData.filter((p) => p.zeroTrustScore >= 95).length;
    const safeRatio = Math.round((safeCount / filteredData.length) * 100);

    return { avgScore, minScore, totalThreats, safeRatio };
  }, [filteredData]);

  // Draw D3 Visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 700;
    const height = 280;
    const margin = { top: 25, right: 48, bottom: 42, left: 45 };
    const width = Math.max(320, containerWidth);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height)
      .style('overflow', 'visible');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Definitions: Gradients and Glow filters
    const defs = svg.append('defs');

    // Score Area Gradient
    const scoreGradient = defs
      .append('linearGradient')
      .attr('id', 'score-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    scoreGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.45);

    scoreGradient
      .append('stop')
      .attr('offset', '85%')
      .attr('stop-color', '#064e3b')
      .attr('stop-opacity', 0.05);

    scoreGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#0f172a')
      .attr('stop-opacity', 0.0);

    // Threats Bar Gradient
    const threatGradient = defs
      .append('linearGradient')
      .attr('id', 'threat-bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    threatGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f59e0b')
      .attr('stop-opacity', 0.85);

    threatGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#b45309')
      .attr('stop-opacity', 0.2);

    // Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(filteredData.map((d) => d.hour))
      .range([0, innerWidth])
      .padding(0.3);

    // Left Y Axis: Zero-Trust Score (88 to 100)
    const yScaleScore = d3
      .scaleLinear()
      .domain([88, 100])
      .range([innerHeight, 0])
      .nice();

    // Right Y Axis: Threats count (0 to max + 2)
    const maxThreats = Math.max(5, d3.max(filteredData, (d) => d.blockedThreats) || 5);
    const yScaleThreats = d3
      .scaleLinear()
      .domain([0, maxThreats + 1])
      .range([innerHeight, 0]);

    // Background Grid lines
    const yScoreTicks = [90, 95, 100];
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yScoreTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScaleScore(d))
      .attr('y2', (d) => yScaleScore(d))
      .attr('stroke', (d) => (d === 95 ? '#10b98133' : '#334155'))
      .attr('stroke-width', (d) => (d === 95 ? 1.5 : 1))
      .attr('stroke-dasharray', (d) => (d === 95 ? '4 4' : '2 2'));

    // Threshold label for NIS2 / NÚKIB safe zone
    g.append('text')
      .attr('x', 6)
      .attr('y', yScaleScore(95) - 6)
      .attr('fill', '#10b981')
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '600')
      .text('NIS2 / NÚKIB limitní pásmo (≥ 95)');

    // 1. Render Threat Bars (if activeFilter is 'all' or 'threats')
    if (activeFilter === 'all' || activeFilter === 'threats') {
      const barWidth = Math.min(22, Math.max(8, innerWidth / (filteredData.length * 2.2)));

      const threatBars = g
        .append('g')
        .attr('class', 'threat-bars')
        .selectAll('rect')
        .data(filteredData)
        .enter()
        .append('rect')
        .attr('x', (d) => (xScale(d.hour) || 0) - barWidth / 2)
        .attr('y', (d) => yScaleThreats(d.blockedThreats))
        .attr('width', barWidth)
        .attr('height', (d) => Math.max(0, innerHeight - yScaleThreats(d.blockedThreats)))
        .attr('fill', (d) => (d.blockedThreats >= 3 ? '#ef4444' : 'url(#threat-bar-gradient)'))
        .attr('rx', 3)
        .attr('opacity', 0.85);

      threatBars
        .on('mouseenter', (_, d) => setHoveredPoint(d))
        .on('mouseleave', () => setHoveredPoint(null));
    }

    // 2. Render Score Area & Line (if activeFilter is 'all' or 'score')
    if (activeFilter === 'all' || activeFilter === 'score') {
      const areaGenerator = d3
        .area<SecurityTelemetryHourPoint>()
        .x((d) => xScale(d.hour) || 0)
        .y0(innerHeight)
        .y1((d) => yScaleScore(d.zeroTrustScore))
        .curve(d3.curveMonotoneX);

      const lineGenerator = d3
        .line<SecurityTelemetryHourPoint>()
        .x((d) => xScale(d.hour) || 0)
        .y((d) => yScaleScore(d.zeroTrustScore))
        .curve(d3.curveMonotoneX);

      // Area path
      g.append('path')
        .datum(filteredData)
        .attr('fill', 'url(#score-area-gradient)')
        .attr('d', areaGenerator);

      // Trend Line path
      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#34d399')
        .attr('stroke-width', 2.5)
        .attr('d', lineGenerator);

      // Interactive circles for points
      const circlesGroup = g.append('g').attr('class', 'score-points');

      circlesGroup
        .selectAll('circle')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(d.hour) || 0)
        .attr('cy', (d) => yScaleScore(d.zeroTrustScore))
        .attr('r', (d, i) => (i === filteredData.length - 1 ? 5 : 3.5))
        .attr('fill', (d) => (d.zeroTrustScore < 95 ? '#f59e0b' : '#10b981'))
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', (_, d) => setHoveredPoint(d))
        .on('mouseleave', () => setHoveredPoint(null));

      // Pulse ring for the live/current hour point
      const lastPoint = filteredData[filteredData.length - 1];
      if (lastPoint) {
        g.append('circle')
          .attr('cx', xScale(lastPoint.hour) || 0)
          .attr('cy', yScaleScore(lastPoint.zeroTrustScore))
          .attr('r', 9)
          .attr('fill', 'none')
          .attr('stroke', '#34d399')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.75)
          .attr('class', 'animate-ping')
          .style('transform-origin', `${xScale(lastPoint.hour)}px ${yScaleScore(lastPoint.zeroTrustScore)}px`);
      }
    }

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(10);
    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#475569');
    xAxisGroup
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Left Y Axis: Score
    const yAxisLeft = d3
      .axisLeft(yScaleScore)
      .tickValues([90, 95, 100])
      .tickFormat((d) => `${d}`);
    const yAxisLeftGroup = g.append('g').call(yAxisLeft);
    yAxisLeftGroup.select('.domain').attr('stroke', '#475569');
    yAxisLeftGroup
      .selectAll('text')
      .attr('fill', '#34d399')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -32)
      .attr('text-anchor', 'middle')
      .attr('fill', '#34d399')
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif')
      .text('Zero-Trust Skóre');

    // Right Y Axis: Threats
    const yAxisRight = d3
      .axisRight(yScaleThreats)
      .ticks(4)
      .tickFormat(d3.format('d'));
    const yAxisRightGroup = g
      .append('g')
      .attr('transform', `translate(${innerWidth},0)`)
      .call(yAxisRight);

    yAxisRightGroup.select('.domain').attr('stroke', '#475569');
    yAxisRightGroup
      .selectAll('text')
      .attr('fill', '#f59e0b')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    g.append('text')
      .attr('transform', 'rotate(90)')
      .attr('x', innerHeight / 2)
      .attr('y', -innerWidth - 34)
      .attr('text-anchor', 'middle')
      .attr('fill', '#f59e0b')
      .attr('font-size', '10px')
      .attr('font-family', 'sans-serif')
      .text('Blokováno hrozeb');
  }, [filteredData, activeFilter]);

  return (
    <div
      id="zero-trust-d3-chart-wrapper"
      className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4 text-xs shadow-xl"
    >
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-white text-sm font-serif">
              Reálný trend Zero-Trust skóre & hrozeb (24 hodin)
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
              LIVE TELEMETRIE
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Interaktivní D3.js vizualizace stability bezpečnostního perimetru Titan Core a zablokovaných kybernetických incidentů.
          </p>
        </div>

        {/* View Mode & Timeframe Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layer switcher */}
          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                activeFilter === 'all'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kombinovaný
            </button>
            <button
              onClick={() => setActiveFilter('score')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                activeFilter === 'score'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jen skóre
            </button>
            <button
              onClick={() => setActiveFilter('threats')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                activeFilter === 'threats'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Jen hrozby
            </button>
          </div>

          {/* Timeframe switcher */}
          <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800 text-[11px]">
            <button
              onClick={() => setTimeRange('6h')}
              className={`px-2 py-1 rounded-md font-mono ${
                timeRange === '6h' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'
              }`}
            >
              6h
            </button>
            <button
              onClick={() => setTimeRange('12h')}
              className={`px-2 py-1 rounded-md font-mono ${
                timeRange === '12h' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'
              }`}
            >
              12h
            </button>
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-2 py-1 rounded-md font-mono ${
                timeRange === '24h' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'
              }`}
            >
              24h
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Průměrné 24h Skóre
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-400">{stats.avgScore}</span>
            <span className="text-[10px] text-slate-500">/ 100</span>
            <span className="text-[10px] text-emerald-400 font-mono ml-auto">▲ Stabilní</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Minimální pokles
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-amber-400">{stats.minScore}</span>
            <span className="text-[10px] text-slate-500">/ 100</span>
            <span className="text-[10px] text-slate-400 ml-auto font-mono">Zotaveno</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            Neutralizováno útoků
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-amber-300">{stats.totalThreats}</span>
            <span className="text-[10px] text-slate-400">za {timeRange}</span>
            <span className="text-[10px] text-emerald-400 ml-auto font-mono">100% WAF</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">
            NIS2 Bezpečná zóna
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-400">{stats.safeRatio}%</span>
            <span className="text-[10px] text-slate-400">času</span>
            <span className="text-[10px] text-emerald-400 ml-auto font-mono">Certifikováno</span>
          </div>
        </div>
      </div>

      {/* D3 Graph Area */}
      <div ref={containerRef} className="relative w-full overflow-hidden pt-1">
        <svg ref={svgRef} className="w-full select-none" />

        {/* Hover / Point Details Card */}
        {hoveredPoint && (
          <div
            ref={tooltipRef}
            className="absolute top-2 right-2 sm:right-6 p-3 rounded-xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md max-w-xs space-y-1.5 pointer-events-none transition-all"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                {hoveredPoint.timeLabel}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                  hoveredPoint.zeroTrustScore >= 96
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {hoveredPoint.zeroTrustScore >= 96 ? 'Optimální' : 'Mírné riziko'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px] block">Zero-Trust:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {hoveredPoint.zeroTrustScore} / 100
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Hrozeb zablokováno:</span>
                <span className="font-mono font-bold text-amber-400">
                  {hoveredPoint.blockedThreats} incidentů
                </span>
              </div>
            </div>

            <div className="pt-1 text-[10px] border-t border-slate-800 text-slate-300">
              <strong className="text-white block font-sans">{hoveredPoint.threatCategory}</strong>
              <p className="text-slate-400 mt-0.5 leading-tight">{hoveredPoint.mitigationDetail}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend and Open-Source Compliance Statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" />
            <span className="text-slate-300">Zero-Trust Score (90–100%)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2.5 rounded bg-amber-500/80 inline-block" />
            <span className="text-slate-300">Blokované kybernetické útoky (WAF)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            <span className="text-slate-400 font-mono">Aktuální hodina</span>
          </div>
        </div>

        {/* Open-Source Transparency Badge */}
        <div className="inline-flex items-center gap-1.5 text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="text-[10px]">
            100% Open-Source Engine (<strong className="text-slate-200">D3.js v7</strong> • Bez vendor lock-inu)
          </span>
        </div>
      </div>
    </div>
  );
}
