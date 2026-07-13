import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { initTracking, trackPageView, trackLeadEvent, trackServerLead } from './utils/tracking';

// Custom SVG Icons (to keep it clean and ultra-fast without external font libraries)
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

function Interactive3DCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    // Services orbits data
    const orbits = [
      {
        name: 'B2B SEO & Organic',
        color: '#00D0FF', // Cyan
        radius: 75,
        tiltX: 0.45,
        tiltZ: 0.25,
        speed: 0.007,
        nodes: ['Rankings', 'Backlinks', 'Audits', 'Content Map']
      },
      {
        name: 'Paid Ads & PPC',
        color: '#E17A00', // Logo Orange
        radius: 120,
        tiltX: -0.35,
        tiltZ: -0.45,
        speed: 0.004,
        nodes: ['ROI Funnel', 'Google Ads', 'Meta Ads', 'CPA Optimize']
      },
      {
        name: 'Custom Web Dev',
        color: '#8B5CF6', // Purple
        radius: 165,
        tiltX: 0.55,
        tiltZ: -0.2,
        speed: 0.003,
        nodes: ['Vite/React', 'Next.js', 'API Integra', 'Systems']
      },
      {
        name: 'Creative & Brand',
        color: '#EC4899', // Pink
        radius: 210,
        tiltX: -0.2,
        tiltZ: 0.6,
        speed: 0.002,
        nodes: ['UI/UX Design', 'Branding', 'Graphics', 'Logos']
      }
    ];

    // Orbit dynamic angles
    const orbitAngles = [0, 1.5, 3.0, 4.5];
    const dataPackets = [];

    let rotationY = 0.002;
    let rotationX = 0.001;
    let currentRotY = 0;
    let currentRotX = 0;

    let mouse = { x: 0, y: 0, active: false, targetX: 0, targetY: 0 };
    let hoveredNode = null;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetY = ((e.clientX - rect.left) / width - 0.5) * 1.5;
      mouse.targetX = ((e.clientY - rect.top) / height - 0.5) * 1.2;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      hoveredNode = null;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // 3D Rotation Math helpers
    const project3D = (x, y, z, cosY, sinY, cosX, sinX, focalLength) => {
      // Rotate Y
      let rx1 = x * cosY - z * sinY;
      let rz1 = z * cosY + x * sinY;

      // Rotate X
      let ry2 = y * cosX - rz1 * sinX;
      let rz2 = rz1 * cosX + y * sinX;

      // Perspective scale
      const scale = focalLength / (focalLength + rz2);
      const projX = rx1 * scale + width / 2;
      const projY = -ry2 * scale + height / 2;

      return { x: projX, y: projY, z: rz2, scale: scale };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse rotation tracking
      if (mouse.active) {
        currentRotX += (mouse.targetX - currentRotX) * 0.08;
        currentRotY += (mouse.targetY - currentRotY) * 0.08;
      } else {
        // Continuous slow rotation when idle
        currentRotY += rotationY;
        currentRotX = 0.2 + 0.05 * Math.sin(currentRotY * 0.5);
      }

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);
      const focalLength = 350;

      // 1. DRAW BACKGROUND NETWORK GLOW MESH
      ctx.strokeStyle = 'rgba(255,255,255,0.015)';
      ctx.lineWidth = 0.5;
      const gridCount = 6;
      for (let i = 0; i <= gridCount; i++) {
        const angle = (i / gridCount) * Math.PI;
        const p1 = project3D(Math.cos(angle) * 230, 0, Math.sin(angle) * 230, cosY, sinY, cosX, sinX, focalLength);
        const p2 = project3D(Math.cos(angle + Math.PI) * 230, 0, Math.sin(angle + Math.PI) * 230, cosY, sinY, cosX, sinX, focalLength);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // 2. RENDER CENTRAL B2B GROWTH CORE
      const core3D = project3D(0, 0, 0, cosY, sinY, cosX, sinX, focalLength);
      const coreSize = 38 * core3D.scale;
      const corePulse = 1 + 0.08 * Math.sin(Date.now() * 0.003);

      // Glowing central radial aura
      const coreGrad = ctx.createRadialGradient(core3D.x, core3D.y, 0, core3D.x, core3D.y, coreSize * 2.8 * corePulse);
      coreGrad.addColorStop(0, 'rgba(225, 122, 0, 0.22)'); // Orange core
      coreGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.06)'); // Purple shell
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(core3D.x, core3D.y, coreSize * 2.8 * corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Core Solid Sphere
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#E17A00'; // Orange glow
      ctx.beginPath();
      ctx.arc(core3D.x, core3D.y, coreSize * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // Core inner structure lines
      ctx.strokeStyle = 'rgba(225, 122, 0, 0.35)'; // Orange structure lines
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(core3D.x, core3D.y, coreSize * 1.1, 0, Math.PI * 2);
      ctx.stroke();

      // Core Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = `600 ${Math.max(9, 11 * core3D.scale)}px var(--font-heading)`;
      ctx.textAlign = 'center';
      ctx.fillText('B2B GROWTH', core3D.x, core3D.y + 4 * core3D.scale);

      // 3. RENDER ORBIT RINGS & NODE PORTS
      const renderedObjects = [];
      let tempHoveredNode = null;

      orbits.forEach((orbit, oIdx) => {
        // Increment orbit base angle
        orbitAngles[oIdx] += orbit.speed;
        const currentBaseAngle = orbitAngles[oIdx];

        // Draw Orbit Ring (Rendered as 64 points in 3D space connected by lines)
        const ringPoints = [];
        const segments = 64;
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          
          // Coordinate calculations in plane of orbit
          const px = orbit.radius * Math.cos(theta);
          const py = orbit.radius * Math.sin(theta);
          const pz = 0;

          // Apply Inclination Tilts
          const cosTX = Math.cos(orbit.tiltX);
          const sinTX = Math.sin(orbit.tiltX);
          const cosTZ = Math.cos(orbit.tiltZ);
          const sinTZ = Math.sin(orbit.tiltZ);

          // Tilt around X then Z
          let x1 = px;
          let y1 = py * cosTX - pz * sinTX;
          let z1 = pz * cosTX + py * sinTX;

          let x2 = x1 * cosTZ - y1 * sinTZ;
          let y2 = y1 * cosTZ + x1 * sinTZ;
          let z2 = z1;

          const proj = project3D(x2, y2, z2, cosY, sinY, cosX, sinX, focalLength);
          ringPoints.push(proj);
        }

        // Draw ring lines
        ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(ringPoints[0].x, ringPoints[0].y);
        for (let s = 1; s < ringPoints.length; s++) {
          ctx.lineTo(ringPoints[s].x, ringPoints[s].y);
        }
        ctx.stroke();

        // Render Service Nodes on this ring
        const numNodes = orbit.nodes.length;
        for (let n = 0; n < numNodes; n++) {
          const theta = currentBaseAngle + (n / numNodes) * Math.PI * 2;
          
          const px = orbit.radius * Math.cos(theta);
          const py = orbit.radius * Math.sin(theta);
          
          const cosTX = Math.cos(orbit.tiltX);
          const sinTX = Math.sin(orbit.tiltX);
          const cosTZ = Math.cos(orbit.tiltZ);
          const sinTZ = Math.sin(orbit.tiltZ);

          let x1 = px;
          let y1 = py * cosTX;
          let z1 = py * sinTX;

          let x2 = x1 * cosTZ - y1 * sinTZ;
          let y2 = y1 * cosTZ + x1 * sinTZ;
          let z2 = z1;

          const proj = project3D(x2, y2, z2, cosY, sinY, cosX, sinX, focalLength);

          // Check mouse hover on node
          if (mouse.active) {
            const dx = mouse.x - proj.x;
            const dy = mouse.y - proj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 18) {
              tempHoveredNode = {
                proj: proj,
                name: orbit.nodes[n],
                serviceName: orbit.name,
                color: orbit.color
              };
            }
          }

          renderedObjects.push({
            type: 'node',
            proj: proj,
            color: orbit.color,
            name: orbit.nodes[n],
            serviceName: orbit.name
          });
        }

        // Randomly spawn glowing data packets traversing the rings
        if (Math.random() < 0.015) {
          dataPackets.push({
            orbitIdx: oIdx,
            progress: 0,
            speed: 0.005 + Math.random() * 0.005,
            color: orbit.color
          });
        }
      });

      hoveredNode = tempHoveredNode;

      // Draw active data packets
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const dp = dataPackets[i];
        dp.progress += dp.speed;

        if (dp.progress >= 1) {
          dataPackets.splice(i, 1);
          continue;
        }

        const orbit = orbits[dp.orbitIdx];
        const theta = orbitAngles[dp.orbitIdx] + dp.progress * Math.PI * 2;
        
        const px = orbit.radius * Math.cos(theta);
        const py = orbit.radius * Math.sin(theta);
        
        const cosTX = Math.cos(orbit.tiltX);
        const sinTX = Math.sin(orbit.tiltX);
        const cosTZ = Math.cos(orbit.tiltZ);
        const sinTZ = Math.sin(orbit.tiltZ);

        let x1 = px;
        let y1 = py * cosTX;
        let z1 = py * sinTX;

        let x2 = x1 * cosTZ - y1 * sinTZ;
        let y2 = y1 * cosTZ + x1 * sinTZ;
        let z2 = z1;

        const proj = project3D(x2, y2, z2, cosY, sinY, cosX, sinX, focalLength);

        // Draw glowing packet spark
        ctx.fillStyle = dp.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = dp.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 3 * proj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // Sort nodes by depth for Z-buffering
      renderedObjects.sort((a, b) => b.proj.z - a.proj.z);

      // Draw all Service Nodes
      renderedObjects.forEach(obj => {
        const size = Math.max(1.5, 5 * obj.proj.scale);
        const alpha = Math.min(1.0, Math.max(0.2, obj.proj.scale));

        // Outer glow circle
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(obj.proj.x, obj.proj.y, size * 2.2, 0, Math.PI * 2);
        ctx.stroke();

        // Node Inner Core
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(obj.proj.x, obj.proj.y, size * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Node core solid white center
        ctx.fillStyle = `rgba(255,255,255, ${alpha * 0.95})`;
        ctx.beginPath();
        ctx.arc(obj.proj.x, obj.proj.y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Subtle connecting link from node back to the center core
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * obj.proj.scale})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(obj.proj.x, obj.proj.y);
        ctx.lineTo(core3D.x, core3D.y);
        ctx.stroke();
      });

      // RENDER INTERACTIVE FLOATING LABELS ON HOVER
      if (hoveredNode) {
        const { proj, name, serviceName, color } = hoveredNode;
        
        ctx.font = '600 12px var(--font-heading)';
        const nameWidth = ctx.measureText(name).width;
        const serviceWidth = ctx.measureText(serviceName).width;
        const boxWidth = Math.max(nameWidth, serviceWidth) + 16;
        const boxHeight = 36;
        
        const bx = proj.x + 15;
        const by = proj.y - 18;

        // Draw indicator connection line
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(proj.x, proj.y);
        ctx.lineTo(bx, by + boxHeight / 2);
        ctx.stroke();

        // Draw label box background (glass plate)
        ctx.fillStyle = 'rgba(10, 18, 30, 0.9)';
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, by, boxWidth, boxHeight, 6);
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.fillStyle = '#00D0FF';
        ctx.font = '700 9px var(--font-body)';
        ctx.textAlign = 'left';
        ctx.fillText(serviceName.toUpperCase(), bx + 8, by + 14);

        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = '600 11px var(--font-heading)';
        ctx.fillText(name, bx + 8, by + 27);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="canvas-3d-wrap">
      <canvas ref={canvasRef} className="canvas-3d" />
    </div>
  );
}


const teamMembers = [
  {
    name: 'Shahidul Bilash',
    role: 'Founder & Managing Director',
    dept: 'Executive Leadership',
    category: 'executive',
    bio: 'Bilash is the founder of NetGenius Consult. He oversees corporate strategy and global operations, driving performance-centric solutions for B2B enterprises.',
    skills: ['Corporate Strategy', 'B2B Consulting', 'Global Operations'],
    img: '/team/bilash.jpg'
  },
  {
    name: 'Zoya Vance',
    role: 'Team Leader',
    dept: 'Executive Leadership',
    category: 'executive',
    bio: 'Zoya leads our B2B strategy and client delivery teams, ensuring projects align with target timelines and commercial metrics.',
    skills: ['Strategic Leadership', 'Client Delivery', 'Project Governance'],
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Ritu Raka',
    role: 'Team Leader',
    dept: 'Executive Leadership',
    category: 'executive',
    bio: 'Ritu manages cross-functional client operations, optimizing workflows and setting quality standards for campaign execution.',
    skills: ['Operations Mgmt', 'Quality Assurance', 'Team Leadership'],
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Raj Gupta',
    role: 'Business Strategy',
    dept: 'Executive Leadership',
    category: 'executive',
    bio: 'Raj directs corporate strategy and market entry campaigns, developing actionable growth roadmaps for enterprise clients.',
    skills: ['Market Expansion', 'Corporate Strategy', 'Growth Hack'],
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Anika Sharma',
    role: 'Head of Web Development',
    dept: 'Technical Operations',
    category: 'technical',
    bio: 'Anika heads our engineering team, focusing on building high-performance, accessible, and secure React/Next.js applications.',
    skills: ['React/Vite', 'Next.js', 'Architecture'],
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Sarah Kabir',
    role: 'Head of IT',
    dept: 'Technical Operations',
    category: 'technical',
    bio: 'Sarah manages our IT infrastructure, cloud environments, and internal security, maintaining 99.9% uptime across all servers.',
    skills: ['DevOps', 'Cloud Infrastructure', 'SysOps'],
    img: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Sophia Taylor',
    role: 'SEO Team Lead',
    dept: 'Search Engine Optimization',
    category: 'marketing',
    bio: 'Sophia designs and executes comprehensive enterprise SEO frameworks, managing keyword targeting, content gap audits, and technical fixes.',
    skills: ['Technical SEO', 'Content Auditing', 'Rankings'],
    img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Maya Jama',
    role: 'PPC Specialist',
    dept: 'Paid Media (PPC)',
    category: 'marketing',
    bio: 'Maya creates and optimizes high-ROI paid media campaigns on Google Search, LinkedIn Ads, and Meta, focusing on B2B lead generation.',
    skills: ['Google Ads', 'Meta Ads', 'B2B Lead Gen'],
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Tipu Arzu',
    role: 'Lead, Content Development',
    dept: 'Content & Copywriting',
    category: 'creative',
    bio: 'Tipu oversees our content strategy, copywriting guidelines, technical B2B articles, and search-optimized copies for high-impact growth.',
    skills: ['Copywriting', 'Content Strategy', 'B2B Copy'],
    img: '/team/tipu_arzu.jpg'
  },
  {
    name: 'Saad Rahat',
    role: 'Client Service',
    dept: 'Client Relations',
    category: 'operations',
    bio: 'Saad manages daily communication and project milestones for client accounts, ensuring feedback is integrated on-time.',
    skills: ['Client Relations', 'Account Mgmt', 'Milestone Tracking'],
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Isabella Sermon',
    role: 'Social Media Manager',
    dept: 'Social Media & Organic Growth',
    category: 'marketing',
    bio: 'Isabella designs engaging organic social strategies, building brand recognition and community interaction for international clients.',
    skills: ['Content Strategy', 'Social Campaigns', 'Engagement'],
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&q=80'
  },
  {
    name: 'Li Xiong',
    role: 'Accounts',
    dept: 'Finance & Accounts',
    category: 'finance',
    bio: 'Li manages company accounts and financial forecasting, overseeing international transactions and billing operations.',
    skills: ['Financial Planning', 'Accounts', 'Billing Systems'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&q=80'
  }
];

function B2BAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('seo');
  const [seoMetric, setSeoMetric] = useState('impressions');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredFunnel, setHoveredFunnel] = useState(null);
  const [hoveredDial, setHoveredDial] = useState(null);
  const [compareCompetitors, setCompareCompetitors] = useState(true);

  // Speed Simulator State
  const [simState, setSimState] = useState('idle'); // 'idle', 'running', 'done'
  const [netProgress, setNetProgress] = useState(0);
  const [wpProgress, setWpProgress] = useState(0);
  const [simLogNet, setSimLogNet] = useState('');
  const [simLogWp, setSimLogWp] = useState('');

  const triggerSpeedSimulation = () => {
    setSimState('running');
    setNetProgress(0);
    setWpProgress(0);
    setSimLogNet('Connecting to Edge CDN...');
    setSimLogWp('Opening MySQL database connection...');

    // NetGenius completes in ~500ms
    let netVal = 0;
    const netTimer = setInterval(() => {
      netVal += 10;
      setNetProgress(netVal);
      if (netVal === 30) setSimLogNet('Injecting React markup...');
      if (netVal === 70) setSimLogNet('Optimizing layout stability...');
      if (netVal >= 100) {
        clearInterval(netTimer);
        setSimLogNet('Fully Interactive (0.4s)! 🚀');
      }
    }, 50);

    // WordPress completes in ~4000ms
    let wpVal = 0;
    const wpTimer = setInterval(() => {
      wpVal += 2.5;
      setWpProgress(wpVal);
      if (wpVal === 25) setSimLogWp('Loading 48 active plugins...');
      if (wpVal === 50) setSimLogWp('Render-blocked by layout CSS...');
      if (wpVal === 75) setSimLogWp('Compiling bloated footer scripts...');
      if (wpVal >= 100) {
        clearInterval(wpTimer);
        setSimLogWp('Loaded (3.8s) with CLS shifts 🐌');
        setSimState('done');
      }
    }, 100);
  };

  const metricConfigs = {
    impressions: {
      yLabelMax: '250K',
      yLabelMid2: '150K',
      yLabelMid1: '50K',
      labels: {
        m1: 'Organic Impressions', v1: '242,800', t1: '▲ +142.8% YoY',
        m2: 'Rankings in Top 3', v2: '58 Keywords', t2: '▲ +24 new this qtr',
        m3: 'B2B Pipeline ROI', v3: '4.6x Value', t3: '▲ Peak efficiency'
      },
      data: [
        { month: 'Jan', value: '48,200', cx: 50, cy: 141, change: '+12.4%', rank: '#28', kw: 'consulting agency', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Feb', value: '62,400', cx: 136, cy: 132, change: '+29.4%', rank: '#24', kw: 'b2b consult company', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Mar', value: '104,100', cx: 222, cy: 107, change: '+66.8%', rank: '#18', kw: 'consulting experts', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Apr', value: '138,600', cx: 308, cy: 86, change: '+33.1%', rank: '#12', kw: 'b2b consultant dhaka', url: 'netgeniusconsult.co.uk/consulting' },
        { month: 'May', value: '198,200', cx: 394, cy: 51, change: '+43.0%', rank: '#6', kw: 'best consulting partner', url: 'netgeniusconsult.co.uk/consulting' },
        { month: 'Jun', value: '242,800', cx: 480, cy: 24, change: '+142.8%', rank: '#4.2', kw: 'best B2B consulting partner', url: 'netgeniusconsult.co.uk/consulting' }
      ],
      linePath: "M 50 141 C 93 140, 93 132, 136 132 C 179 132, 179 107, 222 107 C 265 107, 265 86, 308 86 C 351 86, 351 51, 394 51 C 437 51, 437 24, 480 24",
      fillPath: "M 50 141 C 93 140, 93 132, 136 132 C 179 132, 179 107, 222 107 C 265 107, 265 86, 308 86 C 351 86, 351 51, 394 51 C 437 51, 437 24, 480 24 L 480 168 L 50 168 Z",
      competitorLinePath: "M 50 145 C 93 146, 93 148, 136 148 C 179 148, 179 150, 222 150 C 265 150, 265 152, 308 152 C 351 152, 351 154, 394 154 C 437 154, 437 155, 480 155"
    },
    clicks: {
      yLabelMax: '10K',
      yLabelMid2: '6K',
      yLabelMid1: '2K',
      labels: {
        m1: 'Search Clicks', v1: '8,400', t1: '▲ +89.2% YoY',
        m2: 'Avg. Click CTR', v2: '3.46%', t2: '▲ +18% vs standard',
        m3: 'Paid Traffic Value', v3: '$23,520', t3: '▲ Total budget saved'
      },
      data: [
        { month: 'Jan', value: '1,200', cx: 50, cy: 155, change: '+8.2%', rank: '#28', kw: 'consulting agency', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Feb', value: '1,800', cx: 136, cy: 148, change: '+50.0%', rank: '#24', kw: 'b2b consult company', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Mar', value: '3,400', cx: 222, cy: 132, change: '+88.9%', rank: '#18', kw: 'consulting experts', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Apr', value: '4,600', cx: 308, cy: 110, change: '+35.3%', rank: '#12', kw: 'b2b consultant dhaka', url: 'netgeniusconsult.co.uk/consulting' },
        { month: 'May', value: '6,800', cx: 394, cy: 70, change: '+47.8%', rank: '#6', kw: 'best consulting partner', url: 'netgeniusconsult.co.uk/consulting' },
        { month: 'Jun', value: '8,400', cx: 480, cy: 40, change: '+89.2%', rank: '#4.2', kw: 'best B2B consulting partner', url: 'netgeniusconsult.co.uk/consulting' }
      ],
      linePath: "M 50 155 C 93 155, 93 148, 136 148 C 179 148, 179 132, 222 132 C 265 132, 265 110, 308 110 C 351 110, 351 70, 394 70 C 437 70, 437 40, 480 40",
      fillPath: "M 50 155 C 93 155, 93 148, 136 148 C 179 148, 179 132, 222 132 C 265 132, 265 110, 308 110 C 351 110, 351 70, 394 70 C 437 70, 437 40, 480 40 L 480 168 L 50 168 Z",
      competitorLinePath: "M 50 160 C 93 160, 93 161, 136 161 C 179 161, 179 162, 222 162 C 265 162, 265 162, 308 162 C 351 162, 351 163, 394 163 C 437 163, 437 163, 480 163"
    },
    position: {
      yLabelMax: '#1 Top',
      yLabelMid2: '#10',
      yLabelMid1: '#25',
      labels: {
        m1: 'Avg. Search Pos', v1: '#4.2 Top', t1: '▲ +23.8 Pos YoY',
        m2: 'Ranked Pages', v2: '180 URLs', t2: '▲ +42 newly indexed',
        m3: 'Site Crawl Health', v3: '99.2%', t3: '▲ Excellent visibility'
      },
      data: [
        { month: 'Jan', value: '#28', cx: 50, cy: 160, change: 'Base', rank: '#28', kw: 'consulting agency', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Feb', value: '#24', cx: 136, cy: 150, change: '+4 Pos', rank: '#24', kw: 'b2b consult company', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Mar', value: '#18', cx: 222, cy: 130, change: '+6 Pos', rank: '#18', kw: 'consulting experts', url: 'netgeniusconsult.co.uk/services' },
        { month: 'Apr', value: '#12', cx: 308, cy: 105, change: '+6 Pos', rank: '#12', kw: 'b2b consultant dhaka', url: 'netgeniusconsult.co.uk/consulting' },
        { month: 'May', value: '#6', cx: 394, cy: 70, change: '+6 Pos', rank: '#6', kw: 'best consulting partner', url: 'netgeniusconsult.co.uk/consulting' },
        { month: 'Jun', value: '#4.2', cx: 480, cy: 32, change: '+1.8 Pos', rank: '#4.2', kw: 'best B2B consulting partner', url: 'netgeniusconsult.co.uk/consulting' }
      ],
      linePath: "M 50 160 C 93 160, 93 150, 136 150 C 179 150, 179 130, 222 130 C 265 130, 265 105, 308 105 C 351 105, 351 70, 394 70 C 437 70, 437 32, 480 32",
      fillPath: "M 50 160 C 93 160, 93 150, 136 150 C 179 150, 179 130, 222 130 C 265 130, 265 105, 308 105 C 351 105, 351 70, 394 70 C 437 70, 437 32, 480 32 L 480 168 L 50 168 Z",
      competitorLinePath: "M 50 150 C 93 150, 93 151, 136 151 C 179 151, 179 152, 222 152 C 265 152, 265 153, 308 153 C 351 153, 351 154, 394 154 C 437 154, 437 154, 480 154"
    }
  };

  const activeConfig = metricConfigs[seoMetric];

  const funnelDetails = [
    { title: 'Awareness', desc: 'Google/LinkedIn Search Ads Clicks', value: '100%', detail: 'Total 2.4M impressions, 142K search clicks.' },
    { title: 'Intent', desc: 'Landing Page Visitors', value: '45%', detail: '63.9K high-intent unique page view sessions.' },
    { title: 'Interest', desc: 'Consultation Form Bookings', value: '20%', detail: '12.7K custom audits requested via form.' },
    { title: 'Conversion', desc: 'Closed Retainer Partners', value: '6.8%', detail: '868 contract partner approvals executed.' }
  ];

  return (
    <div className="b2b-analytics-card glass-panel">
      <div className="analytics-header">
        <div className="status-indicator">
          <span className="dot pulse"></span>
          <span>NetGenius Real-time Growth Metrics</span>
        </div>
        <div className="analytics-tabs">
          <button 
            className={`analytics-tab-btn ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            📈 SEO Traffic Growth
          </button>
          <button 
            className={`analytics-tab-btn ${activeTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveTab('paid')}
          >
            🎯 Conversion Funnel
          </button>
          <button 
            className={`analytics-tab-btn ${activeTab === 'speed' ? 'active' : ''}`}
            onClick={() => setActiveTab('speed')}
          >
            ⚡ Site Speed (Lighthouse)
          </button>
        </div>
      </div>

      <div className="analytics-body">
        {activeTab === 'seo' && (
          <div className="analytics-view fade-in">
            {/* Header controls */}
            <div className="seo-control-header">
              {/* Metric Selector Tabs */}
              <div className="chart-sub-tabs">
                <button 
                  className={`chart-sub-tab-btn ${seoMetric === 'impressions' ? 'active' : ''}`} 
                  onClick={() => setSeoMetric('impressions')}
                >
                  Impressions
                </button>
                <button 
                  className={`chart-sub-tab-btn ${seoMetric === 'clicks' ? 'active' : ''}`} 
                  onClick={() => setSeoMetric('clicks')}
                >
                  Clicks
                </button>
                <button 
                  className={`chart-sub-tab-btn ${seoMetric === 'position' ? 'active' : ''}`} 
                  onClick={() => setSeoMetric('position')}
                >
                  Avg. Position
                </button>
              </div>

              {/* Compare toggle */}
              <label className="compare-toggle-label">
                <input 
                  type="checkbox" 
                  checked={compareCompetitors} 
                  onChange={() => setCompareCompetitors(!compareCompetitors)} 
                  className="compare-checkbox"
                />
                <span className="checkbox-text">Compare with Competitors</span>
              </label>
            </div>

            <div className="metrics-summary">
              <div className="mini-metric hover-glow-border">
                <span className="metric-label">{activeConfig.labels.m1}</span>
                <span className="metric-value">{activeConfig.labels.v1}</span>
                <span className="trend-up">{activeConfig.labels.t1}</span>
              </div>
              <div className="mini-metric hover-glow-border">
                <span className="metric-label">{activeConfig.labels.m2}</span>
                <span className="metric-value">{activeConfig.labels.v2}</span>
                <span className="trend-up">{activeConfig.labels.t2}</span>
              </div>
              <div className="mini-metric hover-glow-border">
                <span className="metric-label">{activeConfig.labels.m3}</span>
                <span className="metric-value">{activeConfig.labels.v3}</span>
                <span className="trend-up">{activeConfig.labels.t3}</span>
              </div>
            </div>

            {/* Split layout: Chart on left, Live SERP preview on right */}
            <div className="seo-visual-workspace">
              <div className="chart-container" style={{ position: 'relative' }}>
                <div className="chart-legend-row">
                  <span className="legend-dot netgenius"></span> <span className="legend-text mr-4">NetGenius Stack</span>
                  {compareCompetitors && (
                    <>
                      <span className="legend-dot competitor"></span> <span className="legend-text">Average B2B Competitor</span>
                    </>
                  )}
                </div>

                <svg viewBox="0 0 500 220" className="analytics-svg" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Y Axis Grid Lines & Labels */}
                  <line x1="50" y1="24" x2="480" y2="24" stroke="rgba(255,255,255,0.03)" />
                  <text x="12" y="28" fill="var(--text-muted)" fontSize="8">{activeConfig.yLabelMax}</text>
                  
                  <line x1="50" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.03)" />
                  <text x="12" y="64" fill="var(--text-muted)" fontSize="8">{activeConfig.yLabelMid2}</text>

                  <line x1="50" y1="96" x2="480" y2="96" stroke="rgba(255,255,255,0.03)" />
                  <text x="12" y="100" fill="var(--text-muted)" fontSize="8">{activeConfig.yLabelMid1}</text>

                  <line x1="50" y1="132" x2="480" y2="132" stroke="rgba(255,255,255,0.03)" />
                  <text x="12" y="136" fill="var(--text-muted)" fontSize="8">50K</text>

                  <line x1="50" y1="168" x2="480" y2="168" stroke="rgba(255,255,255,0.08)" />
                  <text x="12" y="172" fill="var(--text-muted)" fontSize="8">0</text>

                  {/* X Axis Labels */}
                  <text x="46" y="188" fill="var(--text-muted)" fontSize="9">Jan</text>
                  <text x="131" y="188" fill="var(--text-muted)" fontSize="9">Feb</text>
                  <text x="217" y="188" fill="var(--text-muted)" fontSize="9">Mar</text>
                  <text x="303" y="188" fill="var(--text-muted)" fontSize="9">Apr</text>
                  <text x="389" y="188" fill="var(--text-muted)" fontSize="9">May</text>
                  <text x="475" y="188" fill="var(--text-muted)" fontSize="9">Jun</text>

                  {/* Competitor Line (Dashed, Stagnant) */}
                  {compareCompetitors && (
                    <path 
                      d={activeConfig.competitorLinePath} 
                      fill="none" 
                      stroke="rgba(255, 255, 255, 0.25)" 
                      strokeWidth="2" 
                      strokeDasharray="4,4" 
                      style={{ transition: 'd 0.4s ease' }}
                    />
                  )}

                  {/* Filled Area */}
                  <path d={activeConfig.fillPath} fill="url(#chartGlow)" className="chart-line-path" />

                  {/* Curved line chart */}
                  <path 
                    d={activeConfig.linePath} 
                    fill="none" 
                    stroke="var(--secondary)" 
                    strokeWidth="3.5" 
                    className="chart-line-path"
                  />

                  {/* Secondary glowing line overlay that slides/pulses */}
                  <path 
                    d={activeConfig.linePath}
                    fill="none" 
                    stroke="var(--secondary)" 
                    strokeWidth="4.5" 
                    className="chart-line-pulse"
                    style={{ opacity: 0.8 }}
                  />

                  {/* Hover Guideline */}
                  {hoveredIndex !== null && (
                    <>
                      <line 
                        x1={activeConfig.data[hoveredIndex].cx} 
                        y1="24" 
                        x2={activeConfig.data[hoveredIndex].cx} 
                        y2="168" 
                        stroke="rgba(255, 255, 255, 0.12)" 
                        strokeDasharray="3,3" 
                      />
                      <circle 
                        cx={activeConfig.data[hoveredIndex].cx} 
                        cy={activeConfig.data[hoveredIndex].cy} 
                        r="7" 
                        fill="var(--secondary)" 
                        opacity="0.3" 
                      />
                    </>
                  )}

                  {/* Dots along path */}
                  {activeConfig.data.map((pt, idx) => (
                    <circle 
                      key={idx}
                      cx={pt.cx} 
                      cy={pt.cy} 
                      r={hoveredIndex === idx ? "6" : "4.5"} 
                      fill={hoveredIndex === idx ? "var(--secondary)" : "#FFF"} 
                      stroke="var(--secondary)" 
                      strokeWidth="2.5"
                      style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  ))}

                  {/* SVG Tooltip Group */}
                  {hoveredIndex !== null && (
                    <g 
                      transform={`translate(${activeConfig.data[hoveredIndex].cx > 350 ? activeConfig.data[hoveredIndex].cx - 130 : activeConfig.data[hoveredIndex].cx + 15}, ${activeConfig.data[hoveredIndex].cy - 20})`}
                      className="fade-in"
                    >
                      <rect width="115" height="42" rx="6" fill="rgba(15, 23, 42, 0.95)" stroke="var(--border-color)" strokeWidth="1" />
                      <text x="8" y="15" fill="#94a3b8" fontSize="8" fontWeight="700">
                        {activeConfig.data[hoveredIndex].month} Value
                      </text>
                      <text x="8" y="27" fill="var(--secondary)" fontSize="10" fontWeight="800">
                        {activeConfig.data[hoveredIndex].value}
                      </text>
                      <text x="75" y="27" fill="#22c55e" fontSize="7.5" fontWeight="700">
                        {activeConfig.data[hoveredIndex].change}
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Dynamic SERP Mockup Panel */}
              <div className="serp-preview-card glass-panel">
                <div className="serp-header">
                  <span className="serp-header-dot"></span>
                  <span className="serp-header-dot"></span>
                  <span className="serp-header-dot"></span>
                  <span className="serp-header-title">Google Search Engine Simulation</span>
                </div>
                <div className="serp-body">
                  {hoveredIndex !== null ? (
                    <div className="serp-item fade-in">
                      <div className="serp-url-row">
                        <span className="serp-favicon">🌐</span>
                        <span className="serp-url">{activeConfig.data[hoveredIndex].url}</span>
                        <span className="serp-breadcrumbs">› services</span>
                      </div>
                      <h4 className="serp-title">
                        {hoveredIndex === 5 ? "Best B2B Consulting Partner | Ranked #1 in Industry" : 
                         hoveredIndex === 4 ? "Top Consulting Partners & Advisors | Scale Fast" :
                         hoveredIndex === 3 ? "B2B Business Solutions & Marketing Consulting" :
                         "Business Solutions Partner - Services"}
                      </h4>
                      <div className="serp-rating-row">
                        <span className="serp-stars">★★★★★</span>
                        <span className="serp-rating-text">4.9 (88 reviews) - Rank: {activeConfig.data[hoveredIndex].rank}</span>
                      </div>
                      <p className="serp-description">
                        {hoveredIndex === 5 ? "Increase your organic B2B pipeline by 142.8%. Secure custom automated sales leads today with NetGenius technology implementations..." : 
                         hoveredIndex === 4 ? "Partner with NetGenius to scale search rankings up to position 6 on Google. Zero script blockages and lightning-fast loading layouts..." :
                         "Learn about our business consulting solutions. Optimize site performance and acquire top search impressions with high-end React development."}
                      </p>
                      <div className="serp-sitelinks">
                        <span className="sitelink">Custom Audits</span>
                        <span className="sitelink">B2B Retainers</span>
                      </div>
                      <div className="serp-audit-metrics mt-4">
                        💡 <strong>Keyword</strong>: <code>"{activeConfig.data[hoveredIndex].kw}"</code>
                      </div>
                    </div>
                  ) : (
                    <div className="serp-idle-state text-center py-6 fade-in">
                      <span className="google-g-logo">G</span>
                      <p className="mt-2 text-xs text-muted">Hover over any coordinate node on the chart to simulate real Google search index Snippet positioning.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'paid' && (
          <div className="analytics-view fade-in">
            <div className="metrics-summary">
              <div className="mini-metric hover-glow-border">
                <span className="metric-label">Paid Media Spend ROAS</span>
                <span className="metric-value">3.8x ROI</span>
                <span className="trend-up">▲ Scale efficient</span>
              </div>
              <div className="mini-metric hover-glow-border">
                <span className="metric-label">Avg. Conversion Rate</span>
                <span className="metric-value">6.8%</span>
                <span className="trend-up">▲ Industry Top 5%</span>
              </div>
              <div className="mini-metric hover-glow-border">
                <span className="metric-label">Cost per Lead Reduction</span>
                <span className="metric-value">-34.2%</span>
                <span className="trend-up">▼ Down vs last year</span>
              </div>
            </div>

            <div className="funnel-dashboard-grid">
              {/* Interactive SVG Funnel visualization */}
              <div className="funnel-svg-wrap glass-panel">
                <svg viewBox="0 0 400 300" className="funnel-3d-svg">
                  <defs>
                    <linearGradient id="funnelGrad1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="funnelGrad2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(263, 85%, 45%)" />
                      <stop offset="100%" stopColor="hsl(220, 85%, 45%)" />
                    </linearGradient>
                    <linearGradient id="funnelGrad3" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(263, 80%, 35%)" />
                      <stop offset="100%" stopColor="hsl(200, 80%, 35%)" />
                    </linearGradient>
                    <linearGradient id="funnelGrad4" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>

                  {/* Stage 1: Awareness */}
                  <polygon 
                    points="60,40 340,40 310,95 90,95" 
                    fill="url(#funnelGrad1)" 
                    opacity={hoveredFunnel === null || hoveredFunnel === 0 ? "0.95" : "0.5"}
                    style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredFunnel(0)}
                    onMouseLeave={() => setHoveredFunnel(null)}
                  />
                  <ellipse cx="200" cy="40" rx="140" ry="10" fill="#a78bfa" opacity="0.5" />
                  <text x="200" y="65" fill="#FFF" fontSize="11" fontWeight="700" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                    1. AWARENESS (100%)
                  </text>

                  {/* Connecting dropoff */}
                  <text x="345" y="98" fill="#ef4444" fontSize="8" fontWeight="600">-55% Drop-off</text>
                  <line x1="310" y1="95" x2="335" y2="95" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" strokeDasharray="2,2" />

                  {/* Stage 2: Intent */}
                  <polygon 
                    points="95,105 305,105 280,160 120,160" 
                    fill="url(#funnelGrad2)" 
                    opacity={hoveredFunnel === null || hoveredFunnel === 1 ? "0.95" : "0.5"}
                    style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredFunnel(1)}
                    onMouseLeave={() => setHoveredFunnel(null)}
                  />
                  <ellipse cx="200" cy="105" rx="105" ry="8" fill="#818cf8" opacity="0.5" />
                  <text x="200" y="130" fill="#FFF" fontSize="11" fontWeight="700" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                    2. INTENT (45%)
                  </text>

                  {/* Connecting dropoff */}
                  <text x="345" y="163" fill="#ef4444" fontSize="8" fontWeight="600">-56% Drop-off</text>
                  <line x1="280" y1="160" x2="335" y2="160" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" strokeDasharray="2,2" />

                  {/* Stage 3: Interest */}
                  <polygon 
                    points="125,170 275,170 255,225 145,225" 
                    fill="url(#funnelGrad3)" 
                    opacity={hoveredFunnel === null || hoveredFunnel === 2 ? "0.95" : "0.5"}
                    style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredFunnel(2)}
                    onMouseLeave={() => setHoveredFunnel(null)}
                  />
                  <ellipse cx="200" cy="170" rx="75" ry="6" fill="#6366f1" opacity="0.5" />
                  <text x="200" y="195" fill="#FFF" fontSize="11" fontWeight="700" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                    3. INTEREST (20%)
                  </text>

                  {/* Connecting dropoff */}
                  <text x="345" y="228" fill="#ef4444" fontSize="8" fontWeight="600">-66% Drop-off</text>
                  <line x1="255" y1="225" x2="335" y2="225" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" strokeDasharray="2,2" />

                  {/* Stage 4: Conversion */}
                  <polygon 
                    points="150,235 250,235 235,280 165,280" 
                    fill="url(#funnelGrad4)" 
                    opacity={hoveredFunnel === null || hoveredFunnel === 3 ? "0.95" : "0.5"}
                    style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredFunnel(3)}
                    onMouseLeave={() => setHoveredFunnel(null)}
                  />
                  <ellipse cx="200" cy="235" rx="50" ry="5" fill="#f97316" opacity="0.6" />
                  <text x="200" y="258" fill="#FFF" fontSize="11" fontWeight="700" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                    4. CONVERSION (6.8%)
                  </text>
                  <ellipse cx="200" cy="280" rx="35" ry="4" fill="#ea580c" />
                </svg>
              </div>

              {/* Explanatory cards */}
              <div className="funnel-specs-panel glass-panel">
                <h4>Interactive Funnel Audit</h4>
                <p className="panel-desc-mini">Hover over any funnel sector to inspect real-time campaign routing channels and metrics.</p>

                <div className="funnel-stage-detail-card">
                  {hoveredFunnel !== null ? (
                    <div className="detail-active fade-in">
                      <span className="badge" style={{ background: hoveredFunnel === 3 ? 'var(--secondary)' : 'var(--primary)' }}>
                        Stage {hoveredFunnel + 1}: {funnelDetails[hoveredFunnel].title}
                      </span>
                      <h5>{funnelDetails[hoveredFunnel].desc}</h5>
                      <p className="detailed-specs-metrics">{funnelDetails[hoveredFunnel].detail}</p>
                      <div className="simulated-roi-alert mt-4">
                        💡 <strong>NetGenius Optimization</strong>: Bypassing bloated redirect links saves 14% bounce drop-offs here.
                      </div>
                    </div>
                  ) : (
                    <div className="detail-idle fade-in text-center py-8">
                      <span className="icon-finger">👆</span>
                      <p>Hover over the SVG funnel sectors to inspect traffic volumes and conversion ratios.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'speed' && (
          <div className="analytics-view fade-in">
            {simState === 'idle' ? (
              <div className="speed-sim-start-gate text-center py-12">
                <span className="sim-speed-icon">⚡</span>
                <h3>Start B2B Page-Load Speed Simulation</h3>
                <p>Run a real-time side-by-side comparison between NetGenius React-Edge stack and typical WordPress setups.</p>
                <button className="btn btn-primary" onClick={triggerSpeedSimulation}>
                  Start Performance Simulator
                </button>
              </div>
            ) : (
              <div className="speed-sim-active-workspace fade-in">
                {/* Reset simulator */}
                {simState === 'done' && (
                  <button className="btn btn-secondary btn-mini mb-4" onClick={() => setSimState('idle')} style={{ float: 'right' }}>
                    ↻ Reset Test
                  </button>
                )}
                
                <div className="speed-dials-container">
                  {/* NetGenius Stack */}
                  <div className="speed-dial-card glass-panel" style={{ border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <div className="dial-header">NetGenius React Edge CDN</div>
                    
                    <div className="sim-progress-block">
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill green" style={{ width: `${netProgress}%` }}></div>
                      </div>
                      <span className="sim-log-text">{simLogNet}</span>
                    </div>

                    <div className="dial-visual green-dial">
                      <svg viewBox="0 0 100 100" className="dial-svg">
                        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                        <circle 
                          cx="50" cy="50" r="42" 
                          stroke="#22C55E" strokeWidth="8" fill="none" 
                          strokeDasharray="264" 
                          strokeDashoffset={264 - (264 * (netProgress / 100) * 0.99)}
                          className="dial-arc-animate"
                          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                        />
                        <text x="50" y="58" textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="700">
                          {Math.floor(netProgress * 0.99)}
                        </text>
                      </svg>
                    </div>

                    <ul className="dial-features">
                      <li>⚡ Fully loaded in: <strong>0.4 seconds</strong></li>
                      <li>⚡ LCP Layout Shift: <strong>0.00</strong> (Excellent)</li>
                      <li>⚡ Total Blocking Time: <strong>30ms</strong></li>
                    </ul>
                  </div>

                  {/* WordPress Stack */}
                  <div className="speed-dial-card glass-panel" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div className="dial-header">Typical WordPress CMS Setup</div>
                    
                    <div className="sim-progress-block">
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill red" style={{ width: `${wpProgress}%` }}></div>
                      </div>
                      <span className="sim-log-text">{simLogWp}</span>
                    </div>

                    <div className="dial-visual red-dial">
                      <svg viewBox="0 0 100 100" className="dial-svg">
                        <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                        <circle 
                          cx="50" cy="50" r="42" 
                          stroke="#EF4444" strokeWidth="8" fill="none" 
                          strokeDasharray="264" 
                          strokeDashoffset={264 - (264 * (wpProgress / 100) * 0.42)}
                          className="dial-arc-animate"
                          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                        />
                        <text x="50" y="58" textAnchor="middle" fill="#FFF" fontSize="22" fontWeight="700">
                          {Math.floor(wpProgress * 0.42)}
                        </text>
                      </svg>
                    </div>

                    <ul className="dial-features">
                      <li>🐌 Fully loaded in: <strong>3.8 seconds</strong></li>
                      <li>🐌 LCP Layout Shift: <strong>0.18</strong> (Warning)</li>
                      <li>🐌 Total Blocking Time: <strong>480ms</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


function InteractiveServiceShowcase() {
  const [activeKey, setActiveKey] = useState('paid-ads-media-buying');
  const [adSpend, setAdSpend] = useState(5000);
  const [brandTheme, setBrandTheme] = useState('cyber');
  const [ecommerceProcessing, setEcommerceProcessing] = useState(false);
  const [ecommerceSuccess, setEcommerceSuccess] = useState(false);

  // Paid Ads math
  const leadsCount = Math.floor((adSpend / 1.6) * 0.038);
  const conversionVal = leadsCount * 140;
  const adROAS = (conversionVal / adSpend).toFixed(1);

  const servicesDataList = {
    'paid-ads-media-buying': {
      title: 'Paid Ads & PPC',
      tagline: 'Maximize ROI with Strategic Media Buying',
      icon: '🎯',
      color: '#E17A00',
      desc: 'Squeeze maximum conversion value out of every marketing dollar. We design, launch, and optimize B2B acquisition campaigns across Google Search, Meta, TikTok, and LinkedIn.',
      details: [
        'Advanced audience targeting and custom conversion funnels.',
        'Continuous A/B testing of creatives, landing pages, and copy drafts.',
        'Daily budget optimization to reduce Cost Per Acquisition (CPA).',
        'Transparent real-time dashboards mapping direct ROAS & Pipeline growth.',
        'Enterprise CRM integrations (Salesforce, HubSpot) to track offline conversion value.',
        'Custom API bidding scripts adjusting budgets based on keyword search volume waves.',
        'Cross-channel attribution modeling to map multi-touch buyer journeys.'
      ],
      widget: (
        <div className="service-widget-card glass-panel fade-in">
          <h4>🧮 Paid Ads ROI Calculator</h4>
          <p className="widget-subtitle">Slide budget to estimate conversion value</p>
          
          <div className="slider-group">
            <label>Monthly Ad Spend: <strong>${adSpend.toLocaleString()}</strong></label>
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="1000" 
              value={adSpend} 
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="widget-slider"
            />
          </div>

          <div className="calculator-stats">
            <div>
              <span>Est. Leads</span>
              <strong>{leadsCount}</strong>
            </div>
            <div>
              <span>Pipeline Value</span>
              <strong>${conversionVal.toLocaleString()}</strong>
            </div>
            <div>
              <span>Target ROAS</span>
              <strong style={{ color: '#E17A00' }}>{adROAS}x ROI</strong>
            </div>
          </div>
        </div>
      )
    },
    'search-engine-optimization': {
      title: 'Search Engine Optimization',
      tagline: 'Rank #1 Globally to Capture High-Intent Leads',
      icon: '🚀',
      color: '#00D0FF',
      desc: 'Capture organic search share from the UK, USA, Australia, and Canada. Our SEO department handles full-scale audits, in-depth competitor keyword gaps, on-page optimization, and high-quality link building.',
      details: [
        'Comprehensive technical SEO crawls and architecture planning.',
        'International keyword mapping targeting high-intent commercial terms.',
        'B2B blog and service page content optimization that matches buyer intent.',
        'White-hat backlink acquisition strategies to build domain authority.',
        'Competitive gap intelligence mapping to capture traffic from direct market rivals.',
        'International scale mapping (hreflang setup) for multi-language global indexation.',
        'Core Web Vitals diagnostic alignment to ensure maximum crawl budget efficiency.'
      ],
      widget: (
        <div className="service-widget-card glass-panel fade-in">
          <h4>🔍 Google SERP Rank Mockup</h4>
          <p className="widget-subtitle">How your website appears at Rank #1</p>

          <div className="serp-mockup">
            <div className="serp-search-bar">🔍 b2b growth consulting agency</div>
            <div className="serp-result">
              <span className="serp-url">https://netgeniusconsult.com</span>
              <h5 className="serp-title">NetGenius Consult | B2B Growth & SEO Agency</h5>
              <p className="serp-snippet">
                Rank #1 globally. We drive B2B pipeline value with performance SEO, custom React stack setups, and conversion audit optimizations.
              </p>
              <div className="serp-badges">
                <span>⭐ 4.9 Rating</span>
                <span style={{ color: '#00D0FF' }}>📈 +142.8% Traffic</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    'web-design-development': {
      title: 'Web Design & Dev',
      tagline: 'High-Performance Custom React Web Apps',
      icon: '💻',
      color: '#8B5CF6',
      desc: 'Your website is your primary business asset. We build custom, ultra-fast, and secure web applications using React, Vite, and clean Vanilla CSS architectures.',
      details: [
        'Bespoke visual layouts designed for premium product presentation.',
        'Sub-second load times optimized for global edge CDN networks.',
        'Mobile-first responsive layouts rendering perfectly on iOS and Android.',
        'Zero bloated WordPress plugins, meaning high security and maintainability.',
        'Headless CMS integrations (Sanity, Contentful) for frictionless editor workflows.',
        'Interactive 3D visuals and WebGL integrations to boost dwell time and engagement.',
        'Automated visual regression testing to prevent layout breaks on new deployments.'
      ],
      widget: (
        <div className="service-widget-card glass-panel fade-in">
          <h4>⚡ Lighthouse Performance Audit</h4>
          <p className="widget-subtitle">Custom stack speed audit metrics</p>

          <div className="lighthouse-grid">
            <div className="lh-score-circle">
              <svg viewBox="0 0 36 36" className="lh-svg">
                <path className="lh-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="lh-progress green" strokeDasharray="99, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="21.5" className="lh-percentage green-text">99</text>
              </svg>
              <span>Performance</span>
            </div>
            <div className="lh-score-circle">
              <svg viewBox="0 0 36 36" className="lh-svg">
                <path className="lh-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="lh-progress green" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="21.5" className="lh-percentage green-text">100</text>
              </svg>
              <span>Accessibility</span>
            </div>
            <div className="lh-score-circle">
              <svg viewBox="0 0 36 36" className="lh-svg">
                <path className="lh-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="lh-progress green" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="21.5" className="lh-percentage green-text">100</text>
              </svg>
              <span>Best Practices</span>
            </div>
          </div>
        </div>
      )
    },
    'digital-marketing': {
      title: 'B2B Digital Marketing',
      tagline: 'Data-Driven Growth & Lead Pipeline Operations',
      icon: '📣',
      color: '#10B981',
      desc: 'Build a reliable B2B lead generation engine. We combine organic social strategy, content creation pipelines, and B2B email prospecting into a unified growth engine.',
      details: [
        'Organic social media calendars and professional feed templates.',
        'Automated outbound prospecting campaigns targeting key decision makers.',
        'High-value content assets (case studies, ebooks) to generate leads.',
        'Continuous CRM hygiene and integration with marketing automations.',
        'Lead scoring workflow automations inside CRM to prioritize hot inbound queries.',
        'Interactive newsletter templates and weekly analytics-driven engagement tracking.',
        'Account-Based Marketing (ABM) outreach playbooks targeting C-suite leaders.'
      ],
      widget: (
        <div className="service-widget-card glass-panel fade-in">
          <h4>📧 Cold Outreach Pipeline</h4>
          <p className="widget-subtitle">Outbound campaign transmission metrics</p>

          <div className="outreach-grid">
            <div className="outreach-row">
              <span>Emails Dispatched:</span>
              <strong>1,200</strong>
            </div>
            <div className="outreach-row">
              <span>Open Rate:</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '68%', background: '#10B981' }}></div></div>
              <strong>68.4%</strong>
            </div>
            <div className="outreach-row">
              <span>Reply Rate:</span>
              <div className="bar-track"><div className="bar-fill" style={{ width: '22%', background: '#10B981' }}></div></div>
              <strong>22.8%</strong>
            </div>
          </div>
        </div>
      )
    },
    'e-commerce': {
      title: 'E-Commerce Development',
      tagline: 'Shopping Experiences That Convert Visitors',
      icon: '🛒',
      color: '#EF4444',
      desc: 'Turn visitors into repeat buyers. We design and develop custom WooCommerce and headless e-commerce architectures optimized for fast checkout and international payments.',
      details: [
        'Optimized cart and multi-step checkout processes to minimize drop-off.',
        'Seamless integration with global payment Gateways (Stripe, PayPal, etc.).',
        'Multi-currency and multi-language support for international shipping.',
        'Inventory synchronization and automatic shipping rates configuration.',
        'Omnichannel sync with brick-and-mortar POS (Shopify POS, Square).',
        'Smart subscription and recurring billing integration (Recharge, Stripe Billing).',
        'Automated cart recovery workflows (Email + SMS notification systems).'
      ],
      widget: (
        <div className="service-widget-card glass-panel fade-in">
          <h4>💳 Stripe Payment Gateway Mockup</h4>
          <p className="widget-subtitle">Interactive checkout simulator</p>

          <div className="checkout-sim">
            {ecommerceSuccess ? (
              <div className="checkout-success fade-in">
                <span className="success-icon">✓</span>
                <h5>Payment Successful</h5>
                <p>$1,250.00 routed to Stripe Merchant Ledger</p>
                <button className="btn btn-secondary btn-mini" onClick={() => setEcommerceSuccess(false)}>Reset Payment</button>
              </div>
            ) : (
              <div className="checkout-form-sim">
                <div className="input-row-sim"><span>Cardholder:</span> <strong>Shahidul Bilash</strong></div>
                <div className="input-row-sim"><span>Total Charge:</span> <strong>$1,250.00 USD</strong></div>
                <button 
                  className="btn btn-primary btn-mini w-full mt-4" 
                  onClick={() => {
                    setEcommerceProcessing(true);
                    setTimeout(() => {
                      setEcommerceProcessing(false);
                      setEcommerceSuccess(true);
                    }, 1200);
                  }}
                  disabled={ecommerceProcessing}
                  style={{ width: '100%' }}
                >
                  {ecommerceProcessing ? 'Processing Transaction...' : 'Confirm Order & Process Payment'}
                </button>
              </div>
            )}
          </div>
        </div>
      )
    },
    'branding-creative-services': {
      title: 'Branding & Creative',
      tagline: 'Corporate Branding & Visual Identity Systems',
      icon: '🎨',
      color: '#EC4899',
      desc: 'Establish an authoritative presence in your market. We design cohesive corporate identities, vector logo systems, color standards, typography guidelines, and B2B marketing assets that project premium quality.',
      details: [
        'Bespoke corporate logo design with high-resolution vector exports.',
        'Comprehensive brand guidelines detailing typography, HSL schemes, and usage.',
        'Pitch deck and business presentation design for sales optimization.',
        'Custom social media feed templates and vector marketing graphics.',
        'Comprehensive corporate visual identity packages containing all logo assets.',
        'Custom corporate typography standards and licenses documentation.',
        '3D packaging render design and print-ready product mockups.'
      ],
      widget: (
        <div className="service-widget-card glass-panel fade-in">
          <h4>🎨 Active Branding Palette Switcher</h4>
          <p className="widget-subtitle">Select color palette to test identity mood</p>

          <div className="theme-circles">
            <button className={`theme-circle-btn cyber ${brandTheme === 'cyber' ? 'active' : ''}`} onClick={() => setBrandTheme('cyber')}></button>
            <button className={`theme-circle-btn warm ${brandTheme === 'warm' ? 'active' : ''}`} onClick={() => setBrandTheme('warm')}></button>
            <button className={`theme-circle-btn emerald ${brandTheme === 'emerald' ? 'active' : ''}`} onClick={() => setBrandTheme('emerald')}></button>
            <button className={`theme-circle-btn classic ${brandTheme === 'classic' ? 'active' : ''}`} onClick={() => setBrandTheme('classic')}></button>
          </div>

          <div className={`brand-identity-mockup ${brandTheme}`}>
            <div className="mockup-header">Company Logo</div>
            <div className="mockup-hero">Grow Your B2B Brand</div>
            <div className="mockup-btn">Primary Action</div>
          </div>
        </div>
      )
    }
  };

  const activeService = servicesDataList[activeKey];

  return (
    <div className="interactive-service-container">
      {/* Sidebar selection */}
      <div className="service-selector-sidebar">
        {Object.keys(servicesDataList).map(key => {
          const item = servicesDataList[key];
          const isActive = key === activeKey;
          return (
            <div 
              key={key} 
              className={`selector-item-card glass-panel ${isActive ? 'active' : ''}`}
              onClick={() => setActiveKey(key)}
              style={{ borderLeft: isActive ? `4px solid ${item.color}` : '1px solid var(--border-color)' }}
            >
              <div className="selector-icon" style={{ background: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div className="selector-text">
                <h5>{item.title}</h5>
                <p>{item.tagline.substring(0, 32)}...</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main details viewer */}
      <div className="service-details-viewer glass-panel">
        <span className="badge" style={{ color: activeService.color, background: `${activeService.color}15` }}>
          Core Offerings
        </span>
        <h2 className="viewer-title">{activeService.title}</h2>
        <p className="viewer-tagline gradient-text">{activeService.tagline}</p>
        
        <p className="viewer-desc">{activeService.desc}</p>

        {/* Dynamic widget rendering */}
        <div className="viewer-widget-wrap">
          {activeService.widget}
        </div>

        <div className="viewer-scope">
          <h3>Included Scope:</h3>
          <ul className="scope-list">
            {activeService.details.map((detail, idx) => (
              <li key={idx}>
                <span className="check-bullet" style={{ color: activeService.color }}>⚡</span>
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function B2BGrowthAuditor({ navigateTo, activeTab, setActiveTab }) {
  
  // Auditor States
  const [platform, setPlatform] = useState('wordpress');
  const [traffic, setTraffic] = useState(10000);
  const [adSpend, setAdSpend] = useState(2000);
  const [speed, setSpeed] = useState(3.5);
  
  const [auditForm, setAuditForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Schema Generator States
  const [schemaType, setSchemaType] = useState('organization');
  const [copied, setCopied] = useState(false);
  
  // Organization Schema Fields
  const [orgName, setOrgName] = useState('NetGenius Consult');
  const [orgUrl, setOrgUrl] = useState('https://netgeniusconsult.co.uk');
  const [orgLogo, setOrgLogo] = useState('https://netgeniusconsult.co.uk/logo.png');
  const [orgSocials, setOrgSocials] = useState('https://linkedin.com/company/netgeniusconsult, https://facebook.com/netgenius');
  
  // Local Business Schema Fields
  const [bizName, setBizName] = useState('NetGenius Consult London');
  const [bizAddress, setBizAddress] = useState('128 City Road');
  const [bizCity, setBizCity] = useState('London');
  const [bizZip, setBizZip] = useState('EC1V 2NX');
  const [bizPhone, setBizPhone] = useState('+44 20 7946 0958');
  const [bizHours, setBizHours] = useState('Mo-Fr 09:00-18:00');

  // FAQ Schema Fields
  const [faqs, setFaqs] = useState([
    { question: 'What is B2B web speed optimization?', answer: 'It is the process of rebuilding pages in frameworks like React to ensure load times under 1 second, reducing bounce rates and maximizing conversions.' },
    { question: 'How does high latency impact Meta ad ROI?', answer: 'Slow sites leak traffic. Up to 40% of users who click a paid ad will bounce if the landing page takes longer than 3 seconds to load.' }
  ]);

  const [schemaForm, setSchemaForm] = useState({ name: '', email: '', website: '' });
  const [schemaSubmitted, setSchemaSubmitted] = useState(false);
  const [isSchemaSending, setIsSchemaSending] = useState(false);

  // Mini SEO Crawler States
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawlLoading, setCrawlLoading] = useState(false);
  const [crawlError, setCrawlError] = useState(null);
  const [crawlResult, setCrawlResult] = useState(null);
  const [crawlLeadForm, setCrawlLeadForm] = useState({ name: '', email: '' });
  const [isCrawlLocked, setIsCrawlLocked] = useState(true);
  const [crawlLeadSubmitted, setCrawlLeadSubmitted] = useState(false);
  const [isCrawlSending, setIsCrawlSending] = useState(false);
  const [activeSubReport, setActiveSubReport] = useState('overview');

  // Auditor Calculations
  const getBounceProbability = (s) => {
    if (s < 1.0) return 0.10;
    if (s < 2.0) return 0.15;
    if (s < 3.0) return 0.24;
    if (s < 5.0) return 0.38;
    return 0.53;
  };

  const getConversionRate = (s) => {
    if (s < 1.0) return 0.025;
    if (s < 2.0) return 0.020;
    if (s < 3.0) return 0.015;
    if (s < 5.0) return 0.009;
    return 0.004;
  };

  const bounceRate = getBounceProbability(speed);
  const currentConv = getConversionRate(speed);
  const targetConv = 0.025;

  const wastedAdSpend = Math.round(adSpend * (bounceRate - 0.10));
  const currentLeads = Math.round(traffic * (1 - bounceRate) * currentConv);
  const targetLeads = Math.round(traffic * 0.9 * targetConv);
  const leadsLost = Math.max(0, targetLeads - currentLeads);
  const leadValue = 500;
  const annualRevLost = leadsLost * leadValue * 12;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAuditSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'B2B Performance Audit',
          value: annualRevLost,
          currency: 'GBP'
        });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'Engagement',
          event_label: 'B2B Performance Audit',
          value: annualRevLost
        });
      }
      await trackServerLead({
        name: auditForm.name,
        email: auditForm.email,
        phone: auditForm.phone,
        service: 'web-design-development',
        message: `B2B Audit Results: Platform: ${platform}, Traffic: ${traffic}, Ad Spend: £${adSpend}, Speed: ${speed}s. Wasted Spend: £${wastedAdSpend}, Leads Lost: ${leadsLost}, Annual Rev Lost: £${annualRevLost}`
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSending(false);
    }
  };

  // Schema Generator Logic
  const generateJsonLd = () => {
    if (schemaType === 'organization') {
      const socials = orgSocials ? orgSocials.split(',').map(s => s.trim()).filter(Boolean) : [];
      const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": orgName,
        "url": orgUrl,
        "logo": orgLogo
      };
      if (socials.length > 0) {
        schema.sameAs = socials;
      }
      return JSON.stringify(schema, null, 2);
    }
    if (schemaType === 'local_business') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": bizName,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": bizAddress,
          "addressLocality": bizCity,
          "postalCode": bizZip,
          "addressCountry": "GB"
        },
        "telephone": bizPhone,
        "openingHours": bizHours
      }, null, 2);
    }
    if (schemaType === 'faq') {
      const validFaqs = faqs.filter(f => f.question && f.answer);
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": validFaqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      }, null, 2);
    }
    return '';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`<script type="application/ld+json">\n${generateJsonLd()}\n<\/script>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addFaqRow = () => setFaqs(prev => [...prev, { question: '', answer: '' }]);
  const removeFaqRow = (index) => setFaqs(prev => prev.filter((_, idx) => idx !== index));
  const handleFaqChange = (index, field, val) => {
    setFaqs(prev => prev.map((f, idx) => idx === index ? { ...f, [field]: val } : f));
  };

  const handleSchemaSubmit = async (e) => {
    e.preventDefault();
    setIsSchemaSending(true);
    try {
      await trackServerLead({
        name: schemaForm.name,
        email: schemaForm.email,
        phone: 'N/A',
        service: 'seo',
        message: `Schema Audit Request: Website: ${schemaForm.website}. Generated Schema Type: ${schemaType}`
      });
      setSchemaSubmitted(true);
    } catch (err) {
      console.error(err);
      setSchemaSubmitted(true);
    } finally {
      setIsSchemaSending(false);
    }
  };

  // Mini SEO Crawler Logic
  const getCrawlLimitStatus = () => {
    try {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('ng_crawl_limit');
      if (!stored) {
        return { count: 0, date: today, limitReached: false };
      }
      const data = JSON.parse(stored);
      if (data.date !== today) {
        return { count: 0, date: today, limitReached: false };
      }
      return { count: data.count, date: data.date, limitReached: data.count >= 2 };
    } catch (e) {
      return { count: 0, date: '', limitReached: false };
    }
  };

  const incrementCrawlCount = () => {
    try {
      const today = new Date().toDateString();
      const status = getCrawlLimitStatus();
      const newCount = status.count + 1;
      localStorage.setItem('ng_crawl_limit', JSON.stringify({ count: newCount, date: today }));
    } catch (e) {
      // Ignore storage errors
    }
  };

  const handleCrawlSubmit = async (e) => {
    e.preventDefault();
    setCrawlError(null);
    setCrawlResult(null);
    setIsCrawlLocked(true);
    setCrawlLeadSubmitted(false);

    // 1. Check daily limit (Disabled temporarily for testing and design adjustments)
    // const limitStatus = getCrawlLimitStatus();
    // if (limitStatus.limitReached) {
    //   setCrawlError("Daily limit reached. You can scan up to 2 websites per day. To get deeper audits, please contact us.");
    //   return;
    // }

    if (!crawlUrl.trim()) {
      setCrawlError("Please enter a valid website URL.");
      return;
    }

    setCrawlLoading(true);
    try {
      const res = await fetch('/api/seo-crawler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: crawlUrl })
      });
      const data = await res.json();
      if (data.success) {
        setCrawlResult(data);
        incrementCrawlCount(); // Increment limit count on successful crawl
      } else {
        setCrawlError(data.error || "Failed to crawl the website. Please check the URL.");
      }
    } catch (err) {
      setCrawlError("Network connection error. Please try again later.");
    } finally {
      setCrawlLoading(false);
    }
  };

  const handleCrawlLeadSubmit = async (e) => {
    e.preventDefault();
    setIsCrawlSending(true);
    try {
      await trackServerLead({
        name: crawlLeadForm.name,
        email: crawlLeadForm.email,
        phone: 'N/A',
        service: 'seo',
        message: `SEO Crawler Lead: Website: ${crawlResult.url}. Size: ${crawlResult.pageSizeBytes} bytes. H1s: ${crawlResult.h1s.length}. Images missing alt: ${crawlResult.missingAltCount}`
      });
      setCrawlLeadSubmitted(true);
      setIsCrawlLocked(false); // Unlock the report card!
    } catch (err) {
      console.error(err);
      setCrawlLeadSubmitted(true);
      setIsCrawlLocked(false); // Unlock even on error so user is not blocked
    } finally {
      setIsCrawlSending(false);
    }
  };

  return (
    <section className="tools-page section-padding animate-float">
      <div className="container">
        
        {activeTab === 'directory' && (
          <div className="tools-directory-container">
            <div className="section-header text-center">
              <span className="badge">Growth Suite</span>
              <h2>Free Marketing & Conversion Tools</h2>
              <p className="section-subtitle">
                Select a tool below to audit your performance, estimate wasted ad budgets, and generate rich snippet schemas.
              </p>
            </div>

            <div className="tools-directory-grid">
              <div className="tool-directory-card glass-panel highlight-hover" onClick={() => setActiveTab('auditor')}>
                <div className="tool-card-icon">📊</div>
                <h3>Ad & Speed Conversion Auditor</h3>
                <p>Calculate exactly how much of your paid ad spend (Google/Meta) is wasted because of website load latency, and estimate your annual revenue recovery potential.</p>
                <button className="btn btn-secondary mt-6 w-full">Launch Auditor ➔</button>
              </div>

              <div className="tool-directory-card glass-panel highlight-hover" onClick={() => setActiveTab('schema')}>
                <div className="tool-card-icon">⚙️</div>
                <h3>Google Schema JSON-LD Generator</h3>
                <p>Generate clean, validation-ready structured data markup (Organization, Local Business, and FAQs) to boost rich search results and organic visibility on Google.</p>
                <button className="btn btn-secondary mt-6 w-full">Launch Generator ➔</button>
              </div>

              <div className="tool-directory-card glass-panel highlight-hover" onClick={() => setActiveTab('crawler')}>
                <div className="tool-card-icon">🔍</div>
                <h3>Mini SEO Site Crawler & Auditor</h3>
                <p>Crawl your website homepage in real-time to analyze on-page SEO issues, check meta headers, heading structures, and find images missing alt text.</p>
                <button className="btn btn-secondary mt-6 w-full">Launch Crawler ➔</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auditor' && (
          <div>
            <button className="back-to-tools-btn" onClick={() => setActiveTab('directory')}>
              ← Back to Tools Directory
            </button>
            <div className="section-header text-center">
              <span className="badge">Auditor Tool</span>
              <h2>B2B Conversion & Ad Waste Auditor</h2>
              <p className="section-subtitle">
                Calculate exactly how much ad spend you are wasting and how many leads you are losing due to website load speed latency.
              </p>
            </div>

            <div className="auditor-grid">
              <div className="auditor-card glass-panel">
                <h3>Configure Your Website Metrics</h3>
                
                <div className="form-group">
                  <label>Current Website Platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="form-select-tools">
                    <option value="wordpress">WordPress (Dynamic PHP)</option>
                    <option value="shopify">Shopify (Hosted Cloud)</option>
                    <option value="wix">Wix / Squarespace</option>
                    <option value="custom">Custom React / Static Site</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Monthly Website Traffic (Visitors): <strong>{traffic.toLocaleString()}</strong></label>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000" 
                    value={traffic} 
                    className="form-slider-tools"
                    onChange={(e) => setTraffic(Number(e.target.value))} 
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Paid Ad Spend (Google/Meta): <strong>£{adSpend.toLocaleString()}</strong></label>
                  <input 
                    type="range" 
                    min="0" 
                    max="25000" 
                    step="500" 
                    value={adSpend} 
                    className="form-slider-tools"
                    onChange={(e) => setAdSpend(Number(e.target.value))} 
                  />
                </div>

                <div className="form-group">
                  <label>Current Load Speed: <strong>{speed} seconds</strong></label>
                  <input 
                    type="range" 
                    min="0.4" 
                    max="10.0" 
                    step="0.1" 
                    value={speed} 
                    className="form-slider-tools"
                    onChange={(e) => setSpeed(Number(e.target.value))} 
                  />
                  <div className="speed-gauge-wrap">
                    <div 
                      className="speed-gauge-bar" 
                      style={{ 
                        width: `${(speed / 10) * 100}%`,
                        background: speed < 1.5 ? '#00D0FF' : speed < 3.0 ? '#E17A00' : '#ff4d4d'
                      }} 
                    />
                  </div>
                  <div className="speed-labels">
                    <span className="fast">0.4s (React Limit)</span>
                    <span className="slow">10.0s (Severe Latency)</span>
                  </div>
                </div>
              </div>

              <div className="results-card glass-panel highlight-border">
                <h3>Audit Assessment</h3>
                
                <div className="result-metric-row">
                  <div className="result-metric-box">
                    <span className="metric-label">Estimated Ad Click Waste</span>
                    <span className="metric-value text-red">
                      £{wastedAdSpend.toLocaleString()} <span className="period">/ month</span>
                    </span>
                    <p className="metric-desc">Money thrown away on users who clicked your ads but bounced before the page loaded.</p>
                  </div>

                  <div className="result-metric-box">
                    <span className="metric-label">Estimated Leads Lost</span>
                    <span className="metric-value text-orange">
                      {leadsLost} <span className="period">leads / month</span>
                    </span>
                    <p className="metric-desc">Inquiries lost due to high friction and latency in loading forms.</p>
                  </div>
                </div>

                <div className="revenue-lost-box">
                  <span className="rev-label">Annual Revenue Recovery Potential</span>
                  <span className="rev-value">£{annualRevLost.toLocaleString()}</span>
                  <p className="rev-desc">Estimated revenue lost annually based on a standard B2B client value of £500.</p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleAuditSubmit} className="audit-lead-form">
                    <h4>Receive Custom Audit Report & Action Plan</h4>
                    <p className="form-intro">Submit your details to get a detailed performance audit PDF and book a free speed consulting session with Zoya.</p>
                    
                    <div className="audit-form-grid">
                      <div className="form-group">
                        <input 
                          type="text" 
                          name="name" 
                          placeholder="Your Name *" 
                          required 
                          className="form-input-tools"
                          value={auditForm.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Your Email *" 
                          required 
                          className="form-input-tools"
                          value={auditForm.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <input 
                          type="tel" 
                          name="phone" 
                          placeholder="Phone Number *" 
                          required 
                          className="form-input-tools"
                          value={auditForm.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <input 
                          type="text" 
                          name="company" 
                          placeholder="Company Name *" 
                          required 
                          className="form-input-tools"
                          value={auditForm.company}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={isSending}>
                      {isSending ? 'Generating Report...' : 'Email My Audit & Book Free Call'}
                    </button>
                  </form>
                ) : (
                  <div className="audit-success-msg">
                    <h4>✓ Audit Saved Successfully!</h4>
                    <p>Thank you. Zoya is compiling your performance audit report. A consultant will reach out to you within 24 hours to present the findings and layout the React migration plan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div>
            <button className="back-to-tools-btn" onClick={() => setActiveTab('directory')}>
              ← Back to Tools Directory
            </button>
            <div className="section-header text-center">
              <span className="badge">SEO Tool</span>
              <h2>Google Schema JSON-LD Generator</h2>
              <p className="section-subtitle">
                Generate clean, error-free structured data schemas to boost your Google rich snippets and organic search visibility.
              </p>
            </div>

            <div className="auditor-grid">
              <div className="auditor-card glass-panel">
                <h3>Configure Your Schema Data</h3>
                
                <div className="form-group">
                  <label>Select Schema Type</label>
                  <select value={schemaType} onChange={(e) => setSchemaType(e.target.value)} className="form-select-tools">
                    <option value="organization">🏢 Organization Schema</option>
                    <option value="local_business">📍 Local Business Schema</option>
                    <option value="faq">❓ FAQ Page Schema</option>
                  </select>
                </div>

                {/* Organization Schema Fields */}
                {schemaType === 'organization' && (
                  <div>
                    <div className="form-group mt-4">
                      <label>Organization Name</label>
                      <input 
                        type="text" 
                        value={orgName} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setOrgName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Website URL</label>
                      <input 
                        type="url" 
                        value={orgUrl} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setOrgUrl(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Logo URL</label>
                      <input 
                        type="url" 
                        value={orgLogo} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setOrgLogo(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Social Profiles (Comma Separated)</label>
                      <input 
                        type="text" 
                        value={orgSocials} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setOrgSocials(e.target.value)} 
                      />
                    </div>
                  </div>
                )}

                {/* Local Business Schema Fields */}
                {schemaType === 'local_business' && (
                  <div>
                    <div className="form-group mt-4">
                      <label>Business Name</label>
                      <input 
                        type="text" 
                        value={bizName} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setBizName(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Street Address</label>
                      <input 
                        type="text" 
                        value={bizAddress} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setBizAddress(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>City / Town</label>
                      <input 
                        type="text" 
                        value={bizCity} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setBizCity(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Postcode / Zip</label>
                      <input 
                        type="text" 
                        value={bizZip} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setBizZip(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Telephone</label>
                      <input 
                        type="tel" 
                        value={bizPhone} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setBizPhone(e.target.value)} 
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Opening Hours</label>
                      <input 
                        type="text" 
                        value={bizHours} 
                        className="form-input-tools mt-2" 
                        onChange={(e) => setBizHours(e.target.value)} 
                      />
                    </div>
                  </div>
                )}

                {/* FAQ Schema Fields */}
                {schemaType === 'faq' && (
                  <div>
                    <div className="faq-inputs-list mt-4">
                      {faqs.map((faq, idx) => (
                        <div key={idx} className="faq-input-row glass-panel mt-3" style={{ padding: '15px', position: 'relative' }}>
                          <span className="faq-number" style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>FAQ #{idx + 1}</span>
                          {faqs.length > 1 && (
                            <button 
                              type="button" 
                              style={{ position: 'absolute', right: '15px', top: '12px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.9rem' }}
                              onClick={() => removeFaqRow(idx)}
                            >
                              ✕ Remove
                            </button>
                          )}
                          <div className="form-group mt-2">
                            <input 
                              type="text" 
                              placeholder="Question" 
                              className="form-input-tools"
                              value={faq.question}
                              onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                            />
                          </div>
                          <div className="form-group mt-2">
                            <textarea 
                              placeholder="Answer" 
                              className="form-input-tools" 
                              rows="2"
                              value={faq.answer}
                              style={{ resize: 'vertical', fontFamily: 'inherit' }}
                              onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-secondary w-full mt-3"
                      style={{ borderStyle: 'dashed', borderWidth: '1px' }}
                      onClick={addFaqRow}
                    >
                      + Add Another FAQ Row
                    </button>
                  </div>
                )}
              </div>

              <div className="results-card glass-panel highlight-border">
                <h3>Structured Data Code (JSON-LD)</h3>
                
                <div className="schema-code-box mt-4" style={{ position: 'relative' }}>
                  <button 
                    className="btn btn-secondary btn-copy-schema"
                    onClick={copyToClipboard}
                    style={{ position: 'absolute', right: '15px', top: '15px', padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    {copied ? '✓ Copied!' : '📋 Copy Script'}
                  </button>
                  <pre 
                    style={{ 
                      background: 'rgba(0,0,0,0.3)', 
                      padding: '25px', 
                      borderRadius: '10px', 
                      color: '#00D0FF', 
                      overflowX: 'auto', 
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      maxHeight: '300px'
                    }}
                  >
                    {`<script type="application/ld+json">\n${generateJsonLd()}\n<\/script>`}
                  </pre>
                </div>

                {!schemaSubmitted ? (
                  <form onSubmit={handleSchemaSubmit} className="audit-lead-form mt-8">
                    <h4>Request a Rich Snippet & Schema Audit</h4>
                    <p className="form-intro">Want our SEO team to verify your schema codes, fix Google Search Console warnings, and implement rich snippets on your website?</p>
                    
                    <div className="audit-form-grid">
                      <div className="form-group">
                        <input 
                          type="text" 
                          name="name" 
                          placeholder="Your Name *" 
                          required 
                          className="form-input-tools"
                          value={schemaForm.name}
                          onChange={(e) => setSchemaForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Your Email *" 
                          required 
                          className="form-input-tools"
                          value={schemaForm.email}
                          onChange={(e) => setSchemaForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="form-group mt-3">
                      <input 
                        type="url" 
                        name="website" 
                        placeholder="Your Website URL *" 
                        required 
                        className="form-input-tools"
                        value={schemaForm.website}
                        onChange={(e) => setSchemaForm(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={isSchemaSending}>
                      {isSchemaSending ? 'Submitting Request...' : 'Book Free Google Schema Audit'}
                    </button>
                  </form>
                ) : (
                  <div className="audit-success-msg mt-8">
                    <h4>✓ Audit Request Submitted!</h4>
                    <p>Thank you. Sophia (our Head of SEO) will review your website's search engine schemas and rich snippets. We will reach out to you within 24 hours with a custom report.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crawler' && (
          <div>
            <button className="back-to-tools-btn" onClick={() => setActiveTab('directory')}>
              ← Back to Tools Directory
            </button>
            
            <div className="section-header text-center">
              <span className="badge">SEO Site Crawler</span>
              <h2>Mini SEO Site Crawler & Auditor</h2>
              <p className="section-subtitle">
                Enter your website URL below to run a real-time, on-page search engine optimization audit.
              </p>
            </div>

            {/* Step 1: Input URL State */}
            {!crawlResult && !crawlLoading && (
              <div className="crawler-input-card glass-panel text-center">
                <h3>Start Free Website Scan</h3>
                <p>Verify your headings, alt tags, metadata lengths, and discover blocking SEO errors instantly.</p>
                <form onSubmit={handleCrawlSubmit} className="crawler-form">
                  <input 
                    type="text" 
                    placeholder="Enter Website URL (e.g. example.com) *" 
                    required 
                    className="form-input-tools"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                  />
                  {crawlError && <p className="crawler-error-msg mt-3">{crawlError}</p>}
                  <button type="submit" className="btn btn-primary w-full mt-4">
                    Run SEO Audit ➔
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Crawl Loading Animation */}
            {crawlLoading && (
              <div className="crawler-loading-card glass-panel text-center">
                <div className="radar-scanner-wrap">
                  <div className="radar-beam" />
                  <div className="radar-grid" />
                  <div className="radar-pulse" />
                </div>
                <h3>Crawling Website...</h3>
                <p className="pulse-text">Fetching HTML structure, scanning images, and auditing metadata tags.</p>
              </div>
            )}

            {/* Step 3: Lead Gate (Crawl Completed but Locked) */}
            {crawlResult && isCrawlLocked && (
              <div className="crawler-lead-card glass-panel text-center">
                <div className="lead-header-icon">🎉</div>
                <h3>✓ Crawl Complete for {crawlResult.url.replace(/^https?:\/\//i, '')}!</h3>
                <p className="mb-6">We identified on-page SEO issues on your website. Enter your email below to instantly view your health score and unlock the detailed report.</p>
                
                <form onSubmit={handleCrawlLeadSubmit} className="audit-lead-form max-w-md mx-auto">
                  <div className="form-group">
                    <input 
                      type="text" 
                      placeholder="Your Name *" 
                      required 
                      className="form-input-tools"
                      value={crawlLeadForm.name}
                      onChange={(e) => setCrawlLeadForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="form-group mt-3">
                    <input 
                      type="email" 
                      placeholder="Your Email Address *" 
                      required 
                      className="form-input-tools"
                      value={crawlLeadForm.email}
                      onChange={(e) => setCrawlLeadForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full mt-4" disabled={isCrawlSending}>
                    {isCrawlSending ? 'Unlocking Report...' : 'Reveal My Audit Report ➔'}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: SEO Report Dashboard (Unlocked) */}
            {crawlResult && !isCrawlLocked && (() => {
              // Calculate Health Score
              let score = 100;
              if (!crawlResult.title) score -= 20;
              else if (crawlResult.title.length < 40 || crawlResult.title.length > 70) score -= 5;

              if (!crawlResult.description) score -= 20;
              else if (crawlResult.description.length < 100 || crawlResult.description.length > 165) score -= 5;

              if (!crawlResult.canonical) score -= 10;
              if (crawlResult.h1s.length === 0) score -= 15;
              else if (crawlResult.h1s.length > 1) score -= 5;

              if (crawlResult.missingAltCount > 0) {
                score -= Math.min(15, crawlResult.missingAltCount * 2);
              }
              if (!crawlResult.hasSchema) score -= 10;

              const finalScore = Math.max(10, score);
              const scoreColor = finalScore >= 80 ? '#10B981' : finalScore >= 50 ? '#ffb020' : '#ff4d4d';
              const scoreText = finalScore >= 80 ? 'EXCELLENT' : finalScore >= 50 ? 'NEEDS ATTENTION' : 'CRITICAL ERRORS';

              return (
                <div className="seo-report-dashboard animate-fade-in">
                  
                  {/* High-End Sub-Navigation Tabs */}
                  <div className="seo-report-tabs glass-panel mt-6">
                    <button 
                      className={`seo-tab-btn ${activeSubReport === 'overview' ? 'active' : ''}`} 
                      onClick={() => setActiveSubReport('overview')}
                    >
                      <span className="tab-icon">🔍</span> Overview Report
                    </button>
                    <button 
                      className={`seo-tab-btn ${activeSubReport === 'details' ? 'active' : ''}`} 
                      onClick={() => setActiveSubReport('details')}
                    >
                      <span className="tab-icon">📑</span> Headings & Outline
                    </button>
                    <button 
                      className={`seo-tab-btn ${activeSubReport === 'roadmap' ? 'active' : ''}`} 
                      onClick={() => setActiveSubReport('roadmap')}
                    >
                      <span className="tab-icon">📋</span> SEO Fix Roadmap
                    </button>
                  </div>

                  {/* 1. OVERVIEW REPORT VIEW */}
                  {activeSubReport === 'overview' && (
                    <div className="tab-content-wrap">
                      <div className="seo-score-hero-premium glass-panel highlight-border">
                        <div className="score-flex-wrap-premium">
                          <div className="seo-score-gauge-wrap">
                            <svg className="score-ring-svg" viewBox="0 0 120 120">
                              <circle className="score-ring-bg" cx="60" cy="60" r="50" />
                              <circle 
                                className="score-ring-fill" 
                                cx="60" 
                                cy="60" 
                                r="50" 
                                style={{
                                  strokeDasharray: '314.159',
                                  strokeDashoffset: 314.159 - (314.159 * finalScore) / 100,
                                  stroke: scoreColor
                                }}
                              />
                            </svg>
                            <div className="score-ring-text">
                              <span className="score-num-val" style={{ color: scoreColor }}>{finalScore}</span>
                              <span className="score-label-pct">%</span>
                            </div>
                          </div>

                          <div className="score-text-box-premium">
                            <span className="assessment-badge" style={{ backgroundColor: `${scoreColor}15`, color: scoreColor, borderColor: `${scoreColor}30` }}>
                              ● {scoreText}
                            </span>
                            <h3>SEO Audit Assessment for {crawlResult.url.replace(/^https?:\/\//i, '')}</h3>
                            
                            {/* Plain-English Executive Verdict Panel */}
                            <div className="executive-verdict-box">
                              <h4 style={{ color: scoreColor, fontWeight: '700', fontSize: '1.2rem', margin: '0 0 10px 0' }}>
                                {finalScore >= 80 
                                  ? '🟢 Status: Highly SEO-Friendly' 
                                  : finalScore >= 50 
                                    ? '🟡 Status: Partially SEO-Friendly (Warnings Found)' 
                                    : '🔴 Status: Critical Action Required (Not SEO-Friendly)'}
                              </h4>
                              <p className="verdict-description" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 12px 0' }}>
                                {finalScore >= 80 
                                  ? 'Your website is in excellent health! It follows standard search engine guidelines, making it easy for Google to read your content and rank your business.' 
                                  : finalScore >= 50 
                                    ? 'Your website has a decent foundation, but has key structural errors. Google can read some parts, but warnings (like missing headings or alt tags) are holding back your search positions.' 
                                    : 'Your website has severe SEO issues and is NOT search engine friendly. Google cannot index your page properly, meaning you are actively losing organic visitors and potential clients to your competitors.'}
                              </p>
                              <div className="verdict-action-call" style={{ 
                                display: 'inline-block',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                padding: '10px 15px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                color: '#fff',
                                fontWeight: '600',
                                width: '100%',
                                boxSizing: 'border-box'
                              }}>
                                {finalScore >= 80 
                                  ? '✓ No urgent fixes needed. Keep maintaining your content.' 
                                  : finalScore >= 50 
                                    ? '⚠️ Action Recommended: You need to resolve the warnings below to rank higher.' 
                                    : '🚨 Urgent Action Needed: Rebuild your page setup or resolve critical errors immediately to prevent indexing drops.'}
                              </div>
                            </div>
                            
                            <div className="scan-meta-grid">
                              <div className="scan-meta-item">
                                <span className="meta-label">Total Size</span>
                                <span className="meta-value">{(crawlResult.pageSizeBytes / 1024).toFixed(1)} KB</span>
                              </div>
                              <div className="scan-meta-item">
                                <span className="meta-label">Images Found</span>
                                <span className="meta-value">{crawlResult.totalImages}</span>
                              </div>
                              <div className="scan-meta-item">
                                <span className="meta-label">Heading Tags</span>
                                <span className="meta-value">{crawlResult.h1s.length + crawlResult.h2s.length} total</span>
                              </div>
                            </div>

                            <button className="btn btn-secondary btn-small mt-4" onClick={() => { setCrawlResult(null); setCrawlUrl(''); }}>
                              🔀 Scan Another Website
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="auditor-grid mt-8">
                        {/* Meta Tags Analyzer Card */}
                        <div className="auditor-card-premium glass-panel">
                          <div className="card-header-premium">
                            <h4>Meta Tags & Search Snippets</h4>
                            <span className="card-subtitle-premium">How your page appears in Google search results</span>
                          </div>

                          {/* Title Tag */}
                          <div className="audit-item-box-premium">
                            <div className="audit-item-header">
                              <strong className="item-title">Page Title Tag</strong>
                              <span className={`status-pill ${crawlResult.title ? (crawlResult.title.length >= 40 && crawlResult.title.length <= 70 ? 'success' : 'warning') : 'error'}`}>
                                {crawlResult.title ? (crawlResult.title.length >= 40 && crawlResult.title.length <= 70 ? 'Perfect Length' : 'Adjust Length') : 'Missing'}
                              </span>
                            </div>
                            <div className="code-block-preview mt-2">
                              {crawlResult.title ? `"${crawlResult.title}"` : 'No title tag found.'}
                            </div>
                            
                            <div className="char-length-bar-wrap mt-3">
                              <div className="char-length-track">
                                <div className="ideal-range-highlight" style={{ left: '44%', width: '33%' }} />
                                <div className="current-length-pin" style={{ left: `${Math.min(100, (crawlResult.title.length / 90) * 100)}%`, backgroundColor: scoreColor }} />
                              </div>
                              <div className="char-length-labels">
                                <span>0 chars</span>
                                <span className="ideal-label">Ideal (40-70): {crawlResult.title.length} chars</span>
                                <span>90+ chars</span>
                              </div>
                            </div>
                          </div>

                          {/* Meta Description */}
                          <div className="audit-item-box-premium mt-6">
                            <div className="audit-item-header">
                              <strong className="item-title">Meta Description</strong>
                              <span className={`status-pill ${crawlResult.description ? (crawlResult.description.length >= 100 && crawlResult.description.length <= 165 ? 'success' : 'warning') : 'error'}`}>
                                {crawlResult.description ? (crawlResult.description.length >= 100 && crawlResult.description.length <= 165 ? 'Perfect Length' : 'Adjust Length') : 'Missing'}
                              </span>
                            </div>
                            <div className="code-block-preview mt-2">
                              {crawlResult.description ? `"${crawlResult.description}"` : 'No meta description found.'}
                            </div>
                            
                            <div className="char-length-bar-wrap mt-3">
                              <div className="char-length-track">
                                <div className="ideal-range-highlight" style={{ left: '50%', width: '32%' }} />
                                <div className="current-length-pin" style={{ left: `${Math.min(100, (crawlResult.description.length / 200) * 100)}%`, backgroundColor: scoreColor }} />
                              </div>
                              <div className="char-length-labels">
                                <span>0 chars</span>
                                <span className="ideal-label">Ideal (100-165): {crawlResult.description.length} chars</span>
                                <span>200+ chars</span>
                              </div>
                            </div>
                          </div>

                          {/* Canonical */}
                          <div className="audit-item-box-premium mt-6">
                            <div className="audit-item-header">
                              <strong className="item-title">Canonical Link Tag</strong>
                              <span className={`status-pill ${crawlResult.canonical ? 'success' : 'error'}`}>
                                {crawlResult.canonical ? 'Configured' : 'Missing'}
                              </span>
                            </div>
                            <div className="code-block-preview mt-2" style={{ fontSize: '0.8rem' }}>
                              {crawlResult.canonical ? crawlResult.canonical : 'No canonical link found.'}
                            </div>
                          </div>
                        </div>

                        {/* Accessibility & Tech SEO Card */}
                        <div className="auditor-card-premium glass-panel">
                          <div className="card-header-premium">
                            <h4>Accessibility & Tech Audits</h4>
                            <span className="card-subtitle-premium">Schema markup, page weights, and image tags</span>
                          </div>

                          {/* Image Alt tags */}
                          <div className="audit-item-box-premium">
                            <div className="audit-item-header">
                              <strong className="item-title">Image Alt Attributes</strong>
                              <span className={`status-pill ${crawlResult.missingAltCount === 0 ? 'success' : 'warning'}`}>
                                {crawlResult.missingAltCount === 0 ? 'Clean' : `${crawlResult.missingAltCount} Missing`}
                              </span>
                            </div>
                            <div className="progress-split-bar mt-3">
                              <div 
                                className="progress-split-fill success-bg" 
                                style={{ width: `${((crawlResult.totalImages - crawlResult.missingAltCount) / Math.max(1, crawlResult.totalImages)) * 100}%` }} 
                              />
                              <div 
                                className="progress-split-fill error-bg" 
                                style={{ width: `${(crawlResult.missingAltCount / Math.max(1, crawlResult.totalImages)) * 100}%` }} 
                              />
                            </div>
                            <div className="split-labels-info mt-2">
                              <span>Total Images: <strong>{crawlResult.totalImages}</strong></span>
                              <span className="text-red">Missing Alt: <strong>{crawlResult.missingAltCount}</strong></span>
                            </div>
                          </div>

                          {/* Structured Schema */}
                          <div className="audit-item-box-premium mt-6">
                            <div className="audit-item-header">
                              <strong className="item-title">Structured Data Schemas</strong>
                              <span className={`status-pill ${crawlResult.hasSchema ? 'success' : 'warning'}`}>
                                {crawlResult.hasSchema ? 'Active' : 'Not Detected'}
                              </span>
                            </div>
                            <p className="mt-2 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                              {crawlResult.hasSchema 
                                ? '✓ JSON-LD schema parsed correctly. Your page is eligible for Google rich results.' 
                                : '⚠ No on-page schema found. Adding Organization or LocalBusiness schema will display rich map details on search results.'}
                            </p>
                          </div>

                          {/* Page HTML Size */}
                          <div className="audit-item-box-premium mt-6">
                            <div className="audit-item-header">
                              <strong className="item-title">HTML Code Size</strong>
                              <span className="status-pill info">
                                {(crawlResult.pageSizeBytes / 1024).toFixed(1)} KB
                              </span>
                            </div>
                            <p className="mt-2 text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                              Your page weight is lightweight and loads quickly. Rebuilding this template in custom React will further improve parsing speed.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. HEADINGS & OUTLINE VIEW */}
                  {activeSubReport === 'details' && (
                    <div className="tab-content-wrap glass-panel highlight-border p-8 mt-6">
                      <div className="card-header-premium mb-6">
                        <h4>Website Headings & Outline Structuring</h4>
                        <span className="card-subtitle-premium">Auditing the H1 and H2 tags mapping of your page</span>
                      </div>

                      <div className="outline-audit-row">
                        <div className="outline-item-column">
                          <div className="heading-summary-box glass-panel text-center">
                            <span className="h-tag-label">H1 Header Tag</span>
                            <span className="h-tag-count" style={{ color: crawlResult.h1s.length === 1 ? '#10B981' : '#ff4d4d' }}>{crawlResult.h1s.length}</span>
                            <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Ideal: exactly 1 per page</p>
                          </div>
                          
                          <div className="h-content-list mt-4">
                            <strong>Parsed H1 Contents:</strong>
                            {crawlResult.h1s.length > 0 ? (
                              <ul className="h-items-ul">
                                {crawlResult.h1s.map((h1, i) => (
                                  <li key={i} className="h1-list-li">
                                    <span className="h-tag-pill">H1</span> {h1}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="error-alert-box mt-2">
                                ❌ No H1 tag detected on this page! Google relies on the H1 header to understand what your page is about.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="outline-item-column border-left-divider">
                          <div className="heading-summary-box glass-panel text-center">
                            <span className="h-tag-label">H2 Subheaders</span>
                            <span className="h-tag-count text-secondary">{crawlResult.h2s.length}</span>
                            <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Used for sectional outline</p>
                          </div>

                          <div className="h-content-list mt-4">
                            <strong>Parsed H2 Outline:</strong>
                            {crawlResult.h2s.length > 0 ? (
                              <div className="h2-outline-scroll">
                                <ul className="h-items-ul">
                                  {crawlResult.h2s.map((h2, i) => (
                                    <li key={i} className="h2-list-li">
                                      <span className="h-tag-pill h2-pill">H2</span> {h2}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="info-alert-box mt-2">
                                ℹ️ No H2 tags found. Adding secondary subheadings organizes your content for reader indexation.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. SEO FIX ROADMAP VIEW */}
                  {activeSubReport === 'roadmap' && (
                    <div className="tab-content-wrap glass-panel highlight-border p-8 mt-6">
                      <div className="card-header-premium mb-6">
                        <h4>SEO Fix Action Roadmap</h4>
                        <span className="card-subtitle-premium">Follow the checklist below to optimize your page structure and raise your health score to 100%</span>
                      </div>

                      <div className="roadmap-checklist">
                        {/* 1. Meta Description (High Priority) */}
                        <div className="roadmap-item glass-panel">
                          <div className="roadmap-chk-wrap">
                            <input type="checkbox" checked={!!crawlResult.description} readOnly className="roadmap-checkbox" />
                            <div className="roadmap-info">
                              <div className="roadmap-meta-row">
                                <strong className="roadmap-task">Add Meta Description Tag</strong>
                                <span className={`priority-pill ${!crawlResult.description ? 'high' : 'done'}`}>
                                  {!crawlResult.description ? 'High Priority' : 'Completed'}
                                </span>
                              </div>
                              <p className="text-muted mt-1">Provide a brief 100-165 character summary of the page for search result previews. Improves organic CTR.</p>
                            </div>
                          </div>
                          <span className="roadmap-impact">+20 pts</span>
                        </div>

                        {/* 2. Page Title length (Medium Priority) */}
                        <div className="roadmap-item glass-panel mt-3">
                          <div className="roadmap-chk-wrap">
                            <input type="checkbox" checked={crawlResult.title && crawlResult.title.length >= 40 && crawlResult.title.length <= 70} readOnly className="roadmap-checkbox" />
                            <div className="roadmap-info">
                              <div className="roadmap-meta-row">
                                <strong className="roadmap-task">Optimize Page Title Length (40-70 chars)</strong>
                                <span className={`priority-pill ${crawlResult.title && crawlResult.title.length >= 40 && crawlResult.title.length <= 70 ? 'done' : 'medium'}`}>
                                  {crawlResult.title && crawlResult.title.length >= 40 && crawlResult.title.length <= 70 ? 'Completed' : 'Medium Priority'}
                                </span>
                              </div>
                              <p className="text-muted mt-1">Adjust title tag to fit between 40 and 70 characters so it is not truncated on search result pages.</p>
                            </div>
                          </div>
                          <span className="roadmap-impact">+5 pts</span>
                        </div>

                        {/* 3. H1 Tag presence (High Priority) */}
                        <div className="roadmap-item glass-panel mt-3">
                          <div className="roadmap-chk-wrap">
                            <input type="checkbox" checked={crawlResult.h1s.length === 1} readOnly className="roadmap-checkbox" />
                            <div className="roadmap-info">
                              <div className="roadmap-meta-row">
                                <strong className="roadmap-task">Ensure Exactly One H1 Header Tag</strong>
                                <span className={`priority-pill ${crawlResult.h1s.length === 1 ? 'done' : 'high'}`}>
                                  {crawlResult.h1s.length === 1 ? 'Completed' : 'High Priority'}
                                </span>
                              </div>
                              <p className="text-muted mt-1">Add exactly one main H1 heading at the top of the body to set clear keyword context for search engines.</p>
                            </div>
                          </div>
                          <span className="roadmap-impact">+15 pts</span>
                        </div>

                        {/* 4. Canonical Tag (High Priority) */}
                        <div className="roadmap-item glass-panel mt-3">
                          <div className="roadmap-chk-wrap">
                            <input type="checkbox" checked={!!crawlResult.canonical} readOnly className="roadmap-checkbox" />
                            <div className="roadmap-info">
                              <div className="roadmap-meta-row">
                                <strong className="roadmap-task">Configure Canonical Link Rel</strong>
                                <span className={`priority-pill ${crawlResult.canonical ? 'done' : 'high'}`}>
                                  {crawlResult.canonical ? 'Completed' : 'High Priority'}
                                </span>
                              </div>
                              <p className="text-muted mt-1">Specify canonical URLs to inform search engines which version of a page is the master source, preventing duplicates.</p>
                            </div>
                          </div>
                          <span className="roadmap-impact">+10 pts</span>
                        </div>

                        {/* 5. Image Alt attributes (Medium Priority) */}
                        <div className="roadmap-item glass-panel mt-3">
                          <div className="roadmap-chk-wrap">
                            <input type="checkbox" checked={crawlResult.missingAltCount === 0} readOnly className="roadmap-checkbox" />
                            <div className="roadmap-info">
                              <div className="roadmap-meta-row">
                                <strong className="roadmap-task">Add Alt Attributes to All Images</strong>
                                <span className={`priority-pill ${crawlResult.missingAltCount === 0 ? 'done' : 'medium'}`}>
                                  {crawlResult.missingAltCount === 0 ? 'Completed' : 'Medium Priority'}
                                </span>
                              </div>
                              <p className="text-muted mt-1">Review image tags and add descriptive alt texts. Boosts Google Image search rankings and accessibility scores.</p>
                            </div>
                          </div>
                          <span className="roadmap-impact">+15 pts</span>
                        </div>

                        {/* 6. Schema JSON-LD (Medium Priority) */}
                        <div className="roadmap-item glass-panel mt-3">
                          <div className="roadmap-chk-wrap">
                            <input type="checkbox" checked={crawlResult.hasSchema} readOnly className="roadmap-checkbox" />
                            <div className="roadmap-info">
                              <div className="roadmap-meta-row">
                                <strong className="roadmap-task">Inject Structured JSON-LD Schema</strong>
                                <span className={`priority-pill ${crawlResult.hasSchema ? 'done' : 'medium'}`}>
                                  {crawlResult.hasSchema ? 'Completed' : 'Medium Priority'}
                                </span>
                              </div>
                              <p className="text-muted mt-1">Embed JSON-LD metadata schema templates to display ratings, reviews, or business addresses directly in search results.</p>
                            </div>
                          </div>
                          <span className="roadmap-impact">+10 pts</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* High-End CTA Consultation Block */}
                  <div className="cta-audit-banner-premium glass-panel highlight-border">
                    <div className="cta-banner-content-premium">
                      <div className="expert-avatar-wrap">
                        <img src="/team/sophia_taylor.png" alt="Sophia Taylor" className="expert-avatar" />
                        <span className="expert-status-dot"></span>
                        <div className="expert-badge">SEO Director</div>
                      </div>
                      <div className="cta-banner-text">
                        <h4>Let Sophia's SEO Team Implement These Fixes</h4>
                        <p>We found technical issues that are actively preventing <strong>{crawlResult.url.replace(/^https?:\/\//i, '')}</strong> from ranking in top positions. Book a free 15-minute roadmap call to let our specialists implement these structured codes on your website.</p>
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigateTo('contact')}>Book Free SEO Strategy Call</button>
                  </div>

                </div>
              );
            })()}
          </div>
        )}
      </div>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [currentPath, setCurrentPath] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showcaseFilter, setShowcaseFilter] = useState('All');
  const [activeTeamFilter, setActiveTeamFilter] = useState('All');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'seo', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isFormSending, setIsFormSending] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeToolTab, setActiveToolTab] = useState('directory');

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  // Initialize tracking system on mount
  useEffect(() => {
    initTracking();
  }, []);

  // Simple SPA Routing based on HTML5 History API (Clean Paths)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, '');
      const validPaths = ['home', 'about', 'team', 'services', 'blog', 'contact', 'tools'];
      
      if (path.startsWith('services/')) {
        const svc = path.split('/')[1];
        setCurrentPath('services');
        setSelectedService(svc);
        setSelectedPostId(null);
      } else if (validPaths.includes(path)) {
        setCurrentPath(path);
        setSelectedService(null);
        setSelectedPostId(null);
      } else if (path === '') {
        setCurrentPath('home');
        setSelectedService(null);
        setSelectedPostId(null);
      } else {
        setCurrentPath('home');
        setSelectedService(null);
        setSelectedPostId(null);
      }
      window.scrollTo(0, 0);
      setMobileMenuOpen(false);

      // Track page view event
      trackPageView(window.location.pathname + window.location.hash);
    };

    window.addEventListener('popstate', handleLocationChange);
    // Initialize
    handleLocationChange();

    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Dynamic SEO Metadata and Schema injection
  useEffect(() => {
    let title = "Digital Marketing & B2B SEO Agency - NetGenius Consult Ltd";
    let desc = "Accelerate business growth with a leading B2B digital marketing agency. Professional SEO campaigns, Google Ads PPC, and premium custom React development in the UK, US, CA, and AU.";
    let canonical = "https://netgeniusconsult.co.uk/";

    if (currentPath === 'about') {
      title = "About Us | NetGenius Consult - Leading B2B Digital Marketing Agency";
      desc = "Meet the digital marketing experts at NetGenius Consult. Learn about our data-driven approach, performance marketing, and B2B growth solutions.";
      canonical = "https://netgeniusconsult.co.uk/about";
    } else if (currentPath === 'team') {
      title = "Meet the Team | NetGenius Consult Ltd";
      desc = "Get to know the experts behind NetGenius Consult. Leading strategists, developers, and consultants dedicated to your business success.";
      canonical = "https://netgeniusconsult.co.uk/team";
    } else if (currentPath === 'services') {
      title = "Our Services | NetGenius Consult - SEO, PPC & Custom React Web Development";
      desc = "Explore our suite of premium B2B growth services, including speed-optimized React migrations, SEO campaign marketing, and lead-gen campaigns.";
      canonical = "https://netgeniusconsult.co.uk/services";
    } else if (currentPath === 'blog') {
      title = "B2B Marketing & Growth Blog | NetGenius Consult";
      desc = "Read the latest insights, strategies, and case studies on B2B digital marketing, search engine optimization, and custom web development.";
      canonical = "https://netgeniusconsult.co.uk/blog";
    } else if (currentPath === 'tools') {
      title = "Free B2B Marketing, Speed & SEO Tools | NetGenius Consult";
      desc = "Access our free interactive growth utilities: calculate your wasted ad spend due to page load speed latency, and generate schema JSON-LD markup.";
      canonical = "https://netgeniusconsult.co.uk/tools";
    } else if (currentPath === 'contact') {
      title = "Book a Free Growth Consultation | NetGenius Consult";
      desc = "Contact NetGenius Consult today to schedule your free performance audit and B2B growth strategy consultation. Speak with our experts.";
      canonical = "https://netgeniusconsult.co.uk/contact";
    }

    // Apply updates
    document.title = title;
    
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', desc);
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', canonical);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

    // Inject dynamic structured data schema
    let schemaJson = null;
    if (currentPath === 'tools') {
      schemaJson = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "NetGenius Growth Tools Suite",
        "description": "Interactive conversion auditor and Google Schema markup generator built to optimize B2B website performance and organic indexing.",
        "url": "https://netgeniusconsult.co.uk/tools",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "creator": {
          "@type": "Organization",
          "name": "NetGenius Consult Ltd",
          "url": "https://netgeniusconsult.co.uk"
        }
      };
    }

    const existingSchema = document.getElementById('dynamic-page-schema');
    if (existingSchema) existingSchema.remove();

    if (schemaJson) {
      const script = document.createElement('script');
      script.id = 'dynamic-page-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaJson);
      document.head.appendChild(script);
    }

  }, [currentPath]);

  const navigateTo = (path) => {
    const cleanPath = path === 'home' ? '/' : `/${path}`;
    window.history.pushState({}, '', cleanPath);
    
    // Manually trigger the router update event
    const popStateEvent = new PopStateEvent('popstate');
    window.dispatchEvent(popStateEvent);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setIsFormSending(true);
      try {
        const response = await fetch("https://formsubmit.co/ajax/business@netgeniusconsult.co.uk", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            Name: formData.name,
            Email: formData.email,
            Phone: formData.phone || "Not provided",
            Service: formData.service,
            Message: formData.message,
            _subject: "New NetGenius Consultation Booking Request"
          })
        });
        
        if (response.ok) {
          setFormSubmitted(true);
          // Fire Lead Conversion Event to Google Analytics, Meta Pixel, and LinkedIn
          trackLeadEvent(formData.service);
          
          // Securely send server-to-server lead conversion details to Meta via Cloudflare Pages Workers
          trackServerLead({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service
          });
          
          setFormData({ name: '', email: '', phone: '', service: 'seo', message: '' });
          setTimeout(() => {
            setFormSubmitted(false);
          }, 6000);
        } else {
          alert("Submission failed. Please try again or email directly to business@netgeniusconsult.co.uk");
        }
      } catch (error) {
        console.error("Form error:", error);
        alert("An error occurred. Please try again or email directly to business@netgeniusconsult.co.uk");
      } finally {
        setIsFormSending(false);
      }
    }
  };

  // Portfolio items data
  const portfolioItems = [
    { title: 'Neon Lights', category: 'Digital Marketing', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=60' },
    { title: 'VR Experience', category: 'Websites', img: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&auto=format&fit=crop&q=60' },
    { title: 'Smart Living', category: 'Websites', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=60' },
    { title: 'Light Painting', category: 'Branding', img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=60' },
    { title: 'Robo Seven', category: 'Branding', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=60' },
    { title: 'Futuristic Furniture', category: 'Websites', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=60' },
    { title: 'Zero Gravity', category: 'Websites', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60' },
    { title: 'Ideabox', category: 'Branding', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=60' }
  ];

  const filteredPortfolio = showcaseFilter === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === showcaseFilter);

  // Services detailed copy map
  const servicesData = {
    'paid-ads-media-buying': {
      title: 'Paid Ads & B2B Media Buying',
      tagline: 'Maximize ROI with Strategic Paid Search & Paid Social Campaigns',
      desc: 'Squeeze maximum conversion value out of every marketing dollar. We design, launch, and optimize cross-channel campaigns across Google Search, Meta (Facebook & Instagram), TikTok, and LinkedIn.',
      details: [
        'Advanced audience targeting and custom conversion funnels.',
        'Continuous A/B testing of creatives, landing pages, and copy drafts.',
        'Daily budget optimization to reduce Cost Per Acquisition (CPA).',
        'Transparent real-time dashboards mapping direct ROAS & Pipeline growth.'
      ]
    },
    'search-engine-optimization': {
      title: 'Search Engine Optimization (SEO)',
      tagline: 'Rank #1 Globally on Google to Capture High-Intent Leads',
      desc: 'Capture organic search share from the UK, USA, Australia, and Canada. Our SEO department handles full-scale audits, in-depth competitor keyword gaps, on-page optimization, and high-quality digital PR link building.',
      details: [
        'Comprehensive technical SEO crawls and architecture planning.',
        'International keyword mapping targeting high-intent commercial terms.',
        'B2B blog and service page content optimization that matches buyer intent.',
        'White-hat backlink acquisition strategies to build domain authority.'
      ]
    },
    'web-design-development': {
      title: 'Web Design & Development',
      tagline: 'High-Performance Custom React Web Development',
      desc: 'Your website is your primary business asset. We build custom, ultra-fast, and secure web applications using React, Vite, and clean Vanilla CSS architectures.',
      details: [
        'Bespoke visual layouts designed for premium product presentation.',
        'Sub-second load times optimized for global edge CDN networks.',
        'Mobile-first responsive layouts rendering perfectly on iOS and Android.',
        'Zero bloated WordPress plugins, meaning high security and maintainability.'
      ]
    },
    'digital-marketing': {
      title: 'B2B Digital Marketing',
      tagline: 'Data-Driven Growth Management & Brand Scalability',
      desc: 'Build a reliable lead generation engine. We combine organic social media strategy, content creation pipelines, and B2B email marketing into a unified strategy to build brand authority and generate consistent inbound pipeline.',
      details: [
        'Organic social media calendars and professional feed templates.',
        'Automated outbound prospecting campaigns targeting key decision makers.',
        'High-value content assets (case studies, ebooks) to generate leads.',
        'Continuous CRM hygiene and integration with marketing automations.'
      ]
    },
    'e-commerce': {
      title: 'E-Commerce Development',
      tagline: 'Fast & Beautiful Shopping Experiences That Convert Visitors',
      desc: 'Turn visitors into repeat buyers. We design and develop custom WooCommerce and headless e-commerce architectures optimized for fast checkout, secure payments, and international localization.',
      details: [
        'Optimized cart and multi-step checkout processes to minimize drop-off.',
        'Seamless integration with global payment Gateways (Stripe, PayPal, etc.).',
        'Multi-currency and multi-language support for international shipping.',
        'Inventory synchronization and automatic shipping rates configuration.'
      ]
    },
    'branding-creative-services': {
      title: 'Branding & Creative Services',
      tagline: 'Premium Corporate Branding & Visual Identity Systems',
      desc: 'Establish an authoritative presence in your market. We design cohesive corporate identities, vector logo systems, color standards, typography guidelines, and B2B marketing assets that project premium quality.',
      details: [
        'Bespoke corporate logo design with high-resolution vector exports.',
        'Comprehensive brand guidelines detailing typography, HSL schemes, and usage.',
        'Premium graphics templates for social feeds, slide decks, and banner ads.',
        'Stationery design and brand kits for international business presence.'
      ]
    }
  };

  return (
    <div className={`app-wrapper ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* Background Glow Elements */}
      <div className="pulse-glow-bg" style={{ top: '10%', left: '5%' }}></div>
      <div className="pulse-glow-bg" style={{ top: '60%', right: '5%', background: 'var(--gradient-glow)' }}></div>

      {/* Navigation Header */}
      <header className="site-header glass-panel">
        <div className="container header-container">
          <div className="logo-section" onClick={() => navigateTo('home')}>
            <img src="/logo-black.png" alt="NetGenius Consult" className="logo-img" />
          </div>

          <nav className={`desktop-nav ${mobileMenuOpen ? 'open' : ''}`}>
            <button className={`nav-link ${currentPath === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>Home</button>
            <button className={`nav-link ${currentPath === 'about' ? 'active' : ''}`} onClick={() => navigateTo('about')}>About</button>
            <button className={`nav-link ${currentPath === 'team' ? 'active' : ''}`} onClick={() => navigateTo('team')}>Team</button>
            <button className={`nav-link ${currentPath === 'services' ? 'active' : ''}`} onClick={() => navigateTo('services')}>Services</button>
            <button className={`nav-link ${currentPath === 'blog' ? 'active' : ''}`} onClick={() => navigateTo('blog')}>Blog</button>
            <button className={`nav-link ${currentPath === 'tools' ? 'active' : ''}`} onClick={() => { navigateTo('tools'); setActiveToolTab('directory'); }}>Free Tools</button>
            <button className={`nav-link ${currentPath === 'contact' ? 'active' : ''}`} onClick={() => navigateTo('contact')}>Contact</button>
          </nav>

          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="btn btn-primary btn-nav-cta" onClick={() => navigateTo('contact')}>Book Consult</button>
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className={`bar ${mobileMenuOpen ? 'close' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'close' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'close' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer glass-panel">
          <button className="mobile-drawer-link" onClick={() => navigateTo('home')}>Home</button>
          <button className="mobile-drawer-link" onClick={() => navigateTo('about')}>About</button>
          <button className="mobile-drawer-link" onClick={() => navigateTo('team')}>Team</button>
          <button className="mobile-drawer-link" onClick={() => navigateTo('services')}>Services</button>
          <button className="mobile-drawer-link" onClick={() => navigateTo('blog')}>Blog</button>
          <button className="mobile-drawer-link" onClick={() => { navigateTo('tools'); setActiveToolTab('directory'); }}>Free Tools</button>
          <button className="mobile-drawer-link" onClick={() => navigateTo('contact')}>Contact</button>
          <button className="btn btn-primary" onClick={() => navigateTo('contact')}>Book Consultation</button>
        </div>
      )}

      {/* Page Content Router */}
      <main className="main-content">
        {/* HOMEPAGE VIEW */}
        {currentPath === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="hero-section section-padding">
              <div className="container hero-container">
                <div className="hero-text animate-float">
                  <span className="badge">Next-Gen Growth Agency</span>
                  <h1 className="hero-title">
                    Empowering Brands Through <span className="gradient-text">Creative Technology</span>
                  </h1>
                  <p className="hero-subtitle">
                    We drive measurable business growth with precision media buying, B2B SEO strategies, and high-impact custom web development for clients across the UK, USA, Canada, and Australia.
                  </p>
                  <div className="hero-ctas">
                    <button className="btn btn-primary" onClick={() => navigateTo('services')}>
                      Explore Services <ArrowRightIcon />
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigateTo('contact')}>
                      Book a Consultation
                    </button>
                  </div>
                </div>
                <Interactive3DCanvas />
              </div>
            </section>

            {/* Stats section */}
            <section className="stats-section">
              <div className="container stats-grid">
                <div className="stat-card glass-panel">
                  <h3>10+</h3>
                  <p>Years Industry Experience</p>
                </div>
                <div className="stat-card glass-panel">
                  <h3>100%</h3>
                  <p>Data-First Strategy</p>
                </div>
                <div className="stat-card glass-panel">
                  <h3>100+</h3>
                  <p>Impactful Projects Delivered</p>
                </div>
                <div className="stat-card glass-panel">
                  <h3>24/7</h3>
                  <p>Client Service Support</p>
                </div>
              </div>
            </section>

            {/* Analytics Dashboard Section */}
            <section className="analytics-dashboard-section section-padding">
              <div className="container">
                <div className="section-header">
                  <span className="badge">Performance Insights</span>
                  <h2>B2B Growth Analytics Visualized</h2>
                  <p className="section-description">
                    We replace assumptions with real-time conversion metrics. Watch how our digital solutions outpace traditional setups.
                  </p>
                </div>
                <B2BAnalyticsDashboard />
              </div>
            </section>

            {/* Expertise Section */}
            <section className="expertise-section section-padding">
              <div className="container">
                <div className="section-header">
                  <span className="badge">Our Expertise</span>
                  <h2>Services Built to Accelerate Your Inbound Pipeline</h2>
                </div>
                
                <div className="expertise-grid">
                  <div className="expertise-card glass-panel" onClick={() => { navigateTo('services/paid-ads-media-buying'); }}>
                    <div className="card-icon">🎯</div>
                    <h3>Paid Ads / Media Buying</h3>
                    <p>Squeeze maximum conversion value out of Google, Meta, TikTok, and LinkedIn campaigns.</p>
                    <span className="learn-more">Learn more <ArrowRightIcon /></span>
                  </div>

                  <div className="expertise-card glass-panel" onClick={() => { navigateTo('services/search-engine-optimization'); }}>
                    <div className="card-icon">🚀</div>
                    <h3>Search Engine Optimization</h3>
                    <p>Capture organic search share globally with white-hat SEO strategies and domain indexing.</p>
                    <span className="learn-more">Learn more <ArrowRightIcon /></span>
                  </div>

                  <div className="expertise-card glass-panel" onClick={() => { navigateTo('services/web-design-development'); }}>
                    <div className="card-icon">💻</div>
                    <h3>Web Design & Dev</h3>
                    <p>Sub-second load times and custom React front-ends built for premium brand representation.</p>
                    <span className="learn-more">Learn more <ArrowRightIcon /></span>
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section section-padding">
              <div className="container">
                <div className="section-header">
                  <span className="badge">Testimonials</span>
                  <h2>What Our Partners Say</h2>
                </div>
                <div className="testimonials-grid">
                  <div className="testimonial-card glass-panel">
                    <p className="quote">"NetGenius helped us scale our B2B lead generation across the US and UK. Our cost-per-lead dropped by 34% within the first 60 days."</p>
                    <div className="client-info">
                      <h4>Alexander Black</h4>
                      <span>CEO, Seven Consulting</span>
                    </div>
                  </div>
                  <div className="testimonial-card glass-panel">
                    <p className="quote">"The site rebuild Anika's team did is incredibly fast. We got a 98% Lighthouse performance score, which instantly boosted our organic rankings."</p>
                    <div className="client-info">
                      <h4>Tiffany Whitewood</h4>
                      <span>COO, Seven Media</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ABOUT PAGE VIEW */}
        {currentPath === 'about' && (
          <section className="about-page section-padding">
            <div className="container">
              <div className="section-header">
                <span className="badge">Who We Are</span>
                <h2>Turning Digital Opportunities into Business Growth</h2>
              </div>

              <div className="about-content-grid">
                <div className="about-text-column">
                  <h3>Empowering Your Digital Journey</h3>
                  <p>At NetGenius Consult Ltd, we specialize in developing modern digital solutions that fuel business growth. From performance-driven media buying campaigns to cutting-edge front-end applications, we align creative technology with your B2B commercial goals.</p>
                  <p>Founded in 2023, we bridge global quality with deep local insights. We operate out of our offices in London and Dhaka, providing scalable support for clients worldwide.</p>
                  
                  <div className="about-stats-mini">
                    <div>
                      <h4>2+ Years</h4>
                      <p>Company Operations</p>
                    </div>
                    <div>
                      <h4>50+ Cases</h4>
                      <p>Completed Projects</p>
                    </div>
                  </div>
                </div>
                
                <div className="about-image-column glass-panel">
                  <h3>Our Values</h3>
                  <ul>
                    <li><strong>Results-Oriented:</strong> We measure success by conversion rates and client ROI, not page impressions.</li>
                    <li><strong>Ethical Operations:</strong> Standard white-hat SEO rules and transparent paid acquisition setups.</li>
                    <li><strong>Continuous Integration:</strong> Code updates deployed seamlessly to Cloudflare Pages at the click of a button.</li>
                  </ul>
                </div>
              </div>

              {/* Office Locations */}
              <div className="offices-section section-padding">
                <h3 className="section-subtitle">Our Office Hubs</h3>
                <div className="offices-grid">
                  <div className="office-card glass-panel">
                    <div className="office-badge">UK HQ</div>
                    <h4>London</h4>
                    <p>2nd Floor College House, 17 King Edwards Road, Ruislip, London HA4 7AE, United Kingdom</p>
                  </div>
                  <div className="office-card glass-panel">
                    <div className="office-badge">Dev Hub</div>
                    <h4>Dhaka</h4>
                    <p>Mirpur, Dhaka - 1216, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TEAM PAGE VIEW */}
        {currentPath === 'team' && (
          <section className="team-page section-padding">
            <div className="container">
              <div className="section-header">
                <span className="badge">Our Team</span>
                <h2>Meet the Minds Driving NetGenius</h2>
                <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '16px auto 0 auto' }}>
                  A B2B marketing and development team combining global standards with local execution.
                </p>
              </div>

              <div className="team-detailed-grid">
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-detail glass-panel">
                      <div className="team-avatar-wrap-lg">
                        <img 
                          src={member.img} 
                          alt={member.name} 
                          className={`team-avatar ${member.name === 'Shahidul Bilash' ? 'bilash-avatar' : ''}`} 
                        />
                      </div>
                      <div className="team-member-info">
                        <span className="member-dept">{member.dept}</span>
                        <h3>{member.name}</h3>
                        <p className="member-role">{member.role}</p>
                        <p className="member-bio">{member.bio}</p>
                        <div className="member-skills">
                          {member.skills.map(s => (
                            <span key={s} className="skill-tag">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
        {/* SERVICES VIEW */}
        {currentPath === 'services' && (
          <section className="services-page section-padding">
            <div className="container">
              <div className="section-header">
                <span className="badge">Services Scope</span>
                <h2>Integrating Creativity and Technical Performance</h2>
                <p className="section-description">
                  Click through our core capabilities below to explore interactive models and estimate deliverables.
                </p>
              </div>

              <InteractiveServiceShowcase />

              {/* Process */}
              <div className="process-section section-padding">
                <div className="section-header">
                  <span className="badge">How We Work</span>
                  <h2>A Streamlined Process Focused on ROI</h2>
                </div>
                <div className="process-timeline">
                  <div className="process-step glass-panel">
                    <div className="step-num">1</div>
                    <h4>Discover</h4>
                    <p>In-depth competitor keyword gaps, crawl audits, and target market profiling (UK, US, CA, AU).</p>
                  </div>
                  <div className="process-step glass-panel">
                    <div className="step-num">2</div>
                    <h4>Plan</h4>
                    <p>SEO content map design, custom visual style templates, and functional technical brief documentation.</p>
                  </div>
                  <div className="process-step glass-panel">
                    <div className="step-num">3</div>
                    <h4>Design</h4>
                    <p>Crafting wireframes, user flows, and modern design components using brand HSL tokens.</p>
                  </div>
                  <div className="process-step glass-panel">
                    <div className="step-num">4</div>
                    <h4>Develop</h4>
                    <p>Writing fast, secure, and clean code in React, removing third-party plugin liabilities.</p>
                  </div>
                  <div className="process-step glass-panel">
                    <div className="step-num">5</div>
                    <h4>Launch</h4>
                    <p>Strict QA testing, Lighthouse audits, edge-routing setups, and immediate CDN indexation.</p>
                  </div>
                </div>
              </div>

              {/* General Consultation Call to Action */}
              <div className="service-detail-cta glass-panel mt-12">
                <h3>Ready to scale your business?</h3>
                <p>Book a consultation to map these strategies directly to your commercial goals.</p>
                <button className="btn btn-primary" onClick={() => navigateTo('contact')}>Book Strategy Session</button>
              </div>

            </div>
          </section>
        )}
        {currentPath === 'blog' && (
          <section className="blog-page section-padding animate-float">
            <div className="container">
              {selectedPostId === null ? (
                // Blog Grid List
                <div>
                  <div className="section-header">
                    <span className="badge">Insights & Strategies</span>
                    <h2>NetGenius B2B Growth Blog</h2>
                    <p className="section-subtitle">
                      Actionable playbooks, industry updates, and deep dives on performance marketing, speed engineering, and B2B search dominance.
                    </p>
                  </div>
                  
                  <div className="blog-grid">
                    <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedPostId('speed-ranking-2026')}>
                      <div className="blog-card-body">
                        <div className="blog-card-meta">
                          <span className="blog-card-badge" style={{ color: '#00D0FF', background: 'rgba(0, 208, 255, 0.1)' }}>SEO & Performance</span>
                          <span>July 2, 2026</span>
                        </div>
                        <h3 className="blog-card-title">Why Site Speed is the #1 Google Ranking Factor for B2B Websites in 2026</h3>
                        <p className="blog-card-excerpt">
                          Discover why B2B sites that load in under 1 second win the SEO race and how legacy architectures like WordPress fall short compared to modern React configurations.
                        </p>
                        <div className="blog-card-footer">
                          <span>Read full article →</span>
                          <span>6 min read</span>
                        </div>
                      </div>
                    </article>

                    <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedPostId('b2b-paid-ads-2026')}>
                      <div className="blog-card-body">
                        <div className="blog-card-meta">
                          <span className="blog-card-badge" style={{ color: '#E17A00', background: 'rgba(225, 122, 0, 0.1)' }}>Paid Ads & PPC</span>
                          <span>July 2, 2026</span>
                        </div>
                        <h3 className="blog-card-title">Google Ads vs. Meta Ads: Where Should B2B Professional Services Spend Their First £5,000?</h3>
                        <p className="blog-card-excerpt">
                          Allocating B2B advertising budgets is challenging. Learn how to divide a £5,000 spend between Google intent search and Meta social retargeting to maximize ROI.
                        </p>
                        <div className="blog-card-footer">
                          <span>Read full article →</span>
                          <span>5 min read</span>
                        </div>
                      </div>
                    </article>

                    <article className="blog-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedPostId('wp-latency-vs-react')}>
                      <div className="blog-card-body">
                        <div className="blog-card-meta">
                          <span className="blog-card-badge" style={{ color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)' }}>Engineering</span>
                          <span>July 9, 2026</span>
                        </div>
                        <h3 className="blog-card-title">WordPress Database Latency vs. React Static Compilations: An Architectural Guide</h3>
                        <p className="blog-card-excerpt">
                          Analyze the performance bottleneck of dynamic database queries in WordPress vs. the zero-latency speed of pre-rendered React static builds served on the edge.
                        </p>
                        <div className="blog-card-footer">
                          <span>Read full article →</span>
                          <span>7 min read</span>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              ) : (
                <>
                  {selectedPostId === 'speed-ranking-2026' && (
                    <div className="article-detail-container">
                      <button className="back-to-blog" onClick={() => setSelectedPostId(null)}>
                        ← Back to all articles
                      </button>
                      
                      <header className="article-header">
                        <div className="article-meta">
                          <span className="blog-card-badge" style={{ color: '#00D0FF', background: 'rgba(0, 208, 255, 0.1)' }}>SEO & Performance</span>
                          <span>Published: July 2, 2026</span>
                          <span>• 6 min read</span>
                        </div>
                        <h1 className="article-title">Why Site Speed is the #1 Google Ranking Factor for B2B Websites in 2026</h1>
                        
                        <div className="article-author-info">
                          <img 
                            src="/team/sophia_taylor.png" 
                            alt="Sophia Taylor" 
                            className="article-author-avatar" 
                          />
                          <div>
                            <div className="article-author-name">Sophia Taylor</div>
                            <div className="article-author-role">Head of Search Engine Optimization</div>
                          </div>
                        </div>
                      </header>
                      
                      <div className="article-body">
                        <p>
                          In the B2B landscape, speed is no longer just a metric for developer satisfaction; it is a primary driver of organic visibility and conversion rates. With Google's latest Core Web Vitals (CWV) updates, page load times have transformed from minor search tie-breakers into major ranking triggers that directly impact your pipeline.
                        </p>
                        
                        <h2>1. The Core Web Vitals Equation (LCP, INP, CLS)</h2>
                        <p>
                          Google’s algorithm measures user experience through three key metrics. If your B2B website fails any of these thresholds, Google actively demotes your organic position in favor of faster competitors:
                        </p>
                        <ul>
                          <li><strong>Largest Contentful Paint (LCP)</strong>: Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.</li>
                          <li><strong>Interaction to Next Paint (INP)</strong>: Measures responsiveness. INP tracks how quickly a page responds to user clicks or keypresses. An INP of 200 milliseconds or less shows good responsiveness.</li>
                          <li><strong>Cumulative Layout Shift (CLS)</strong>: Measures visual stability. Pages must maintain a CLS score of less than 0.1 to avoid unexpected layout shifts that frustrate users.</li>
                        </ul>
                        
                        <blockquote>
                          "Websites that load in under 1 second see conversion rates up to 3x higher than sites that take 5 seconds to load. Speed is the ultimate user experience factor."
                        </blockquote>
                        
                        <h2>2. The Business Impact: Conversion Rate Decay</h2>
                        <p>
                          In B2B marketing, user behavior is extremely fast-paced. A business decision-maker looking for a consulting partner has zero patience for lagging websites. Analysis of B2B traffic reveals a steep conversion decay curve as load times increase:
                        </p>
                        
                        <table>
                          <thead>
                            <tr>
                              <th>Load Time (Seconds)</th>
                              <th>Average Bounce Rate (%)</th>
                              <th>Conversion Impact</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>0.4s (NetGenius React)</strong></td>
                              <td><strong>9.8%</strong></td>
                              <td><strong>Baseline (100% Target)</strong></td>
                            </tr>
                            <tr>
                              <td>1.5s</td>
                              <td>22.0%</td>
                              <td>-18% Conversion Loss</td>
                            </tr>
                            <tr>
                              <td>3.0s</td>
                              <td>38.0%</td>
                              <td>-50% Conversion Loss</td>
                            </tr>
                            <tr>
                              <td>5.0s (Average WordPress)</td>
                              <td>53.0%</td>
                              <td>-73% Conversion Loss</td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <h2>3. WordPress vs. Custom React (The Architectural Gap)</h2>
                        <p>
                          Why do typical B2B websites run slowly? Most businesses build their digital presence on WordPress templates. While WordPress is easy to set up, it suffers from massive architectural issues that slow down load speeds:
                        </p>
                        <ol>
                          <li><strong>Database Latency</strong>: WordPress generates pages dynamically by querying a database on every single visit. This introduces server response latency (TTFB) of 1.0s to 2.0s before the browser even gets the HTML.</li>
                          <li><strong>Bloated Code</strong>: Themes and plugins load massive, unused CSS and JS files, delaying the browser from rendering the page.</li>
                          <li><strong>Render-Blocking Resources</strong>: Layout shifts (CLS) are common as heavy plugins compile asynchronously in the browser.</li>
                        </ol>
                        <p>
                          By contrast, our custom <strong>React + Vite</strong> framework compiles your entire website into static, pre-rendered assets. These assets are served globally via edge CDNs (like Cloudflare's network) with <strong>0ms database query time</strong>. The browser receives clean, optimized code instantly, rendering pages in <strong>0.4 seconds</strong>.
                        </p>
                        
                        <div className="highlight-box">
                          <h4>⚡ Try the Site-Speed Simulator</h4>
                          <p>
                            We have built an interactive side-by-side site speed simulator in our Services dashboard. You can watch how a React-Edge stack loads instantly in 0.4s with 99+ Lighthouse scores, while WordPress configurations trigger layout shifts and plugin bottlenecks.
                          </p>
                          <button className="btn btn-secondary mt-4" onClick={() => navigateTo('services')}>
                            Open Speed Simulator
                          </button>
                        </div>
                        
                        <h2>4. How to Optimize Your B2B Site for 2026</h2>
                        <p>
                          To protect your organic positions and capture high-intent leads across the UK, USA, Canada, and Australia, we recommend executing these three technical optimizations immediately:
                        </p>
                        <ul>
                          <li><strong>Migrate to Static Architectures</strong>: Replace database-reliant templates with pre-compiled Vite+React assets served over global CDNs.</li>
                          <li><strong>Declare Location Schema</strong>: Add explicit JSON-LD LocalBusiness or ProfessionalService schemas to help search bots verify physical office coordinates.</li>
                          <li><strong>Implement Clean Redirect Maps</strong>: When rebuilding, ensure all old WordPress URLs map via permanent 301 redirects to preserve historical backlink trust.</li>
                        </ul>
                        
                        <div className="service-detail-cta glass-panel mt-12" style={{ padding: '30px', marginTop: '40px' }}>
                          <h3>Ready to Upgrade Your Site Speed and Organic Rankings?</h3>
                          <p>Book a consultation with our technology team to audit your current website speed and map out a custom React-Edge upgrade.</p>
                          <button className="btn btn-primary mt-4" onClick={() => navigateTo('contact')}>
                            Book a Free Speed & SEO Audit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPostId === 'b2b-paid-ads-2026' && (
                    <div className="article-detail-container">
                      <button className="back-to-blog" onClick={() => setSelectedPostId(null)}>
                        ← Back to all articles
                      </button>
                      
                      <header className="article-header">
                        <div className="article-meta">
                          <span className="blog-card-badge" style={{ color: '#E17A00', background: 'rgba(225, 122, 0, 0.1)' }}>Paid Ads & PPC</span>
                          <span>Published: July 2, 2026</span>
                          <span>• 5 min read</span>
                        </div>
                        <h1 className="article-title">Google Ads vs. Meta Ads: Where Should B2B Professional Services Spend Their First £5,000?</h1>
                        
                        <div className="article-author-info">
                          <img 
                            src="/team/sophia_taylor.png" 
                            alt="Sophia Taylor" 
                            className="article-author-avatar" 
                          />
                          <div>
                            <div className="article-author-name">Sophia Taylor</div>
                            <div className="article-author-role">Head of Search Engine Optimization</div>
                          </div>
                        </div>
                      </header>
                      
                      <div className="article-body">
                        <p>
                          Allocating your first £5,000 in advertising spend as a B2B professional services firm can be a daunting decision. If you burn through your budget without producing pipeline leads, you risk losing momentum. To scale successfully, you must match your marketing channels to the buyer's journey.
                        </p>
                        
                        <h2>1. Google Ads (Search): High Intent, High Cost</h2>
                        <p>
                          Google Search Ads capture <strong>active intent</strong>. When a prospect searches for <em>"B2B digital marketing agency London"</em> or <em>"best React development company,"</em> they are actively looking to hire a provider.
                        </p>
                        <ul>
                          <li><strong>The Advantage</strong>: Leads are highly qualified and closer to making a purchase decision.</li>
                          <li><strong>The Downside</strong>: Cost Per Click (CPC) in B2B professional services can be extremely high (often ranging from £8 to £25 per click). A £5,000 budget might only yield 200–500 clicks, meaning your landing page conversion rate must be outstanding to secure an ROI.</li>
                        </ul>
                        
                        <h2>2. Meta Ads (Facebook/Instagram): Audience Targeting at Scale</h2>
                        <p>
                          Meta Ads target <strong>passive demographic profiles</strong>. A user browsing Instagram is not actively looking for a consulting firm, but they might match your target buyer profile (e.g. Founder, CEO, or Director of Marketing).
                        </p>
                        <ul>
                          <li><strong>The Advantage</strong>: Visually engaging, brand-building placement with very low CPCs (often under £1.50). You can reach thousands of relevant decision-makers at a fraction of the cost of Google.</li>
                          <li><strong>The Downside</strong>: Leads have much lower initial purchase intent. They require nurturing through content, downloads, and newsletters before booking a consultation.</li>
                        </ul>

                        <blockquote>
                          "Wasting ad budget is the most common mistake B2B agencies make. You cannot run search ads and social awareness ads with the same budget split. They require distinct placement strategies."
                        </blockquote>
                        
                        <h2>3. The NetGenius £5,000 Budget Optimization Strategy</h2>
                        <p>
                          We advise B2B consultancies starting out to use a <strong>Hybrid Attribution Model</strong>. This balances high-intent search capture with budget-friendly social retargeting:
                        </p>
                        
                        <table>
                          <thead>
                            <tr>
                              <th>Channel</th>
                              <th>Budget Split</th>
                              <th>Role & Objective</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>Google Search (Exact Match)</strong></td>
                              <td><strong>60% (£3,000)</strong></td>
                              <td>Capture immediate buying intent for high-value services.</td>
                            </tr>
                            <tr>
                              <td><strong>Meta Retargeting & Custom Audiences</strong></td>
                              <td><strong>30% (£1,500)</strong></td>
                              <td>Show case studies and social proof to search visitors who bounced.</td>
                            </tr>
                            <tr>
                              <td><strong>Speed & Landing Page Optimization</strong></td>
                              <td><strong>10% (£500)</strong></td>
                              <td>Verify page load speed is under 1.0s to stop ad click drop-offs.</td>
                            </tr>
                          </tbody>
                        </table>

                        <h2>4. The Hidden Drain: Slow Loading Landing Pages</h2>
                        <p>
                          If your landing page takes longer than 3 seconds to load on a mobile device, <strong>over 50% of the users who click your ad will bounce before the page loads</strong>.
                        </p>
                        <p>
                          If you are paying £10 per click on Google Search, a slow landing page means you are throwing £5 away on every single click. Rebuilding your ad landing pages in a modern framework like React and serving them from edge locations guarantees that every visitor lands instantly, doubling your conversion rate without spending a single extra pound on ads.
                        </p>
                        
                        <div className="service-detail-cta glass-panel mt-12" style={{ padding: '30px', marginTop: '40px' }}>
                          <h3>Want to Audit Your Advertising ROI?</h3>
                          <p>Let our PPC team review your current Google & Meta ad accounts. We will identify wasted spend, verify tracking pixel conversions, and build high-speed landing pages that double your leads.</p>
                          <button className="btn btn-primary mt-4" onClick={() => navigateTo('contact')}>
                            Book a Free PPC & Conversion Audit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPostId === 'wp-latency-vs-react' && (
                    <div className="article-detail-container">
                      <button className="back-to-blog" onClick={() => setSelectedPostId(null)}>
                        ← Back to all articles
                      </button>
                      
                      <header className="article-header">
                        <div className="article-meta">
                          <span className="blog-card-badge" style={{ color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)' }}>Engineering</span>
                          <span>Published: July 9, 2026</span>
                          <span>• 7 min read</span>
                        </div>
                        <h1 className="article-title">WordPress Database Latency vs. React Static Compilations: An Architectural Guide</h1>
                        
                        <div className="article-author-info">
                          <img 
                            src="/team/sophia_taylor.png" 
                            alt="Sophia Taylor" 
                            className="article-author-avatar" 
                          />
                          <div>
                            <div className="article-author-name">Sophia Taylor</div>
                            <div className="article-author-role">Head of Search Engine Optimization</div>
                          </div>
                        </div>
                      </header>
                      
                      <div className="article-body">
                        <p>
                          For over a decade, WordPress has been the default content management system for B2B websites. However, as Google's Core Web Vitals elevate loading speeds to primary ranking factors, the underlying database-driven architecture of WordPress has become a critical bottleneck.
                        </p>
                        
                        <h2>1. How WordPress Handles a Request: The Latency Chain</h2>
                        <p>
                          Every time a prospect clicks your website link, WordPress compiles the page from scratch on the fly. This triggers a heavy chain of server operations:
                        </p>
                        <ol>
                          <li><strong>HTTP Request Received</strong>: The user's browser requests a page from your server.</li>
                          <li><strong>PHP Core & Theme Engine Loads</strong>: The server starts executing PHP scripts to construct the page layout.</li>
                          <li><strong>Database Queries (MySQL)</strong>: The server makes dozens of round-trip database queries to fetch page metadata, menu configurations, widget details, and content body.</li>
                          <li><strong>CSS and JS Compilation</strong>: Plugins inject their own style blocks and script libraries.</li>
                          <li><strong>HTML Output Sent</strong>: The server finally packages the compiled page and streams it back to the client.</li>
                        </ol>
                        <p>
                          This process introduces a heavy <strong>Time to First Byte (TTFB)</strong> delay (often 1.5s to 3.0s), meaning the user's browser displays a blank white screen for seconds before loading begins.
                        </p>
                        
                        <h2>2. How React Static Compilations Bypass the Database</h2>
                        <p>
                          Our custom <strong>React + Vite</strong> architecture utilizes static pre-rendering. Instead of generating the page <em>when a visitor arrives</em>, the entire site is pre-compiled into static HTML, CSS, and JS assets <em>during the build process</em>.
                        </p>
                        <ul>
                          <li><strong>0ms Database Queries</strong>: There is no MySQL database queried during a visit.</li>
                          <li><strong>Edge Network Delivery</strong>: The pre-rendered static assets are cached and distributed globally on Cloudflare's edge CDN nodes. When a London user visits, they receive the page directly from a London server; if a Dhaka user visits, it comes from a Dhaka hub.</li>
                          <li><strong>TTFB under 50ms</strong>: The server response time drops to near-zero, rendering pages in <strong>0.4 seconds</strong>.</li>
                        </ul>

                        <blockquote>
                          "Dynamic page generation on slow servers is the silent killer of B2B organic traffic. If your server response time exceeds 1 second, Googlebot will throttle its crawl rate, directly reducing your indexing capability."
                        </blockquote>

                        <h2>3. The Performance Breakdown: WordPress vs. React</h2>
                        <p>
                          Here is the performance metric comparison derived from our network simulations:
                        </p>
                        
                        <table>
                          <thead>
                            <tr>
                              <th>Metric</th>
                              <th>WordPress (Typical B2B Site)</th>
                              <th>React (NetGenius Rebuild)</th>
                              <th>SEO Impact</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>Server Response (TTFB)</strong></td>
                              <td>1.8 seconds</td>
                              <td><strong>35 milliseconds</strong></td>
                              <td>Direct Googlebot crawl rate boost</td>
                            </tr>
                            <tr>
                              <td><strong>Largest Contentful Paint</strong></td>
                              <td>4.2 seconds</td>
                              <td><strong>0.4 seconds</strong></td>
                              <td>Passes Google's Core Web Vitals</td>
                            </tr>
                            <tr>
                              <td><strong>Lighthouse Score</strong></td>
                              <td>45/100 (Poor)</td>
                              <td><strong>99/100 (Optimal)</strong></td>
                              <td>Maximum mobile ranking signals</td>
                            </tr>
                          </tbody>
                        </table>

                        <h2>4. Migration Strategy: Moving Without SEO Loss</h2>
                        <p>
                          If your business is migrating from WordPress to a fast React architecture, you must follow a strict migration plan to safeguard historical SEO rankings:
                        </p>
                        <ul>
                          <li><strong>Map All Permalinks</strong>: Ensure your new routes map perfectly to your old WordPress URLs.</li>
                          <li><strong>Configure 301 Redirects</strong>: If paths change, set up permanent redirects in a <code>_redirects</code> file on your CDN to pass on link equity.</li>
                          <li><strong>Synchronize Canonical Tags</strong>: Ensure all page heads declare correct self-referencing canonical tags to prevent duplicate content flags.</li>
                        </ul>
                        
                        <div className="service-detail-cta glass-panel mt-12" style={{ padding: '30px', marginTop: '40px' }}>
                          <h3>Ready to Eliminate Database Latency?</h3>
                          <p>Let our engineering team audit your current website speed and design a custom, high-performance React migration roadmap for your B2B enterprise.</p>
                          <button className="btn btn-primary mt-4" onClick={() => navigateTo('contact')}>
                            Book a Free Architecture Audit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )}
        {currentPath === 'tools' && (
          <B2BGrowthAuditor navigateTo={navigateTo} activeTab={activeToolTab} setActiveTab={setActiveToolTab} />
        )}
        {currentPath === 'contact' && (
          <section className="contact-page section-padding">
            <div className="container">
              <div className="section-header">
                <span className="badge">Get In Touch</span>
                <h2>Let's Start Right Now!</h2>
              </div>

              <div className="contact-grid">
                <div className="contact-info-column">
                  <h3>Drop Us a Line</h3>
                  <p className="contact-sub">Have a project idea, B2B campaigns to scale, or need a technical review? Fill out our form and a specialist will contact you.</p>
                  
                  <div className="contact-cards-stack">
                    <div className="contact-detail-card glass-panel">
                      <h4>✉️ Email Us</h4>
                      <p>info@netgeniusconsult.com</p>
                    </div>

                    <div className="contact-detail-card glass-panel">
                      <h4>📍 Office Locations</h4>
                      <p><strong>UK:</strong> 2nd Floor College House, 17 King Edwards Road, Ruislip, HA4 7AE</p>
                      <p className="spaced"><strong>Dhaka:</strong> Road 10, Block D, Mirpur, Dhaka - 1216</p>
                    </div>
                  </div>
                </div>

                <div className="contact-form-column glass-panel">
                  {formSubmitted ? (
                    <div className="form-success-message">
                      <h3>✓ Message Sent Successfully!</h3>
                      <p>Thank you for reaching out. Zoya will coordinate with Sophia and Anika to review your request, and our client service lead will get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit}>
                      <h3>Request a Growth Consultation</h3>
                      
                      <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          required 
                          value={formData.name} 
                          onChange={handleFormChange}
                          placeholder="Your name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Work Email *</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required 
                          value={formData.email} 
                          onChange={handleFormChange}
                          placeholder="you@company.com"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleFormChange}
                          placeholder="+44 7400 000000"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="service">Interested Service *</label>
                        <select 
                          id="service" 
                          name="service" 
                          value={formData.service} 
                          onChange={handleFormChange}
                        >
                          <option value="paid-ads">Paid Ads & Media Buying</option>
                          <option value="seo">Search Engine Optimization (SEO)</option>
                          <option value="web-dev">Web Design & React Dev</option>
                          <option value="digital-marketing">Digital Marketing</option>
                          <option value="ecommerce">E-Commerce</option>
                          <option value="branding">Branding & Creative</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="message">Message *</label>
                        <textarea 
                          id="message" 
                          name="message" 
                          required 
                          rows="4" 
                          value={formData.message} 
                          onChange={handleFormChange}
                          placeholder="Tell us about your project requirements..."
                        ></textarea>
                      </div>

                      <button type="submit" className="btn btn-primary form-submit-btn" disabled={isFormSending}>
                        {isFormSending ? 'Sending Request...' : 'Submit Consultation Request'} <ArrowRightIcon />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer glass-panel">
        <div className="container footer-grid">
          <div className="footer-brand-col">
            <h4>NetGenius Consult</h4>
            <p>Integrating creative design with custom technology to drive measurable pipeline value internationally.</p>
            <p className="reg-info">NetGenius Consult Ltd is registered in England & Wales. Company No. 14511875.</p>
          </div>

          <div className="footer-links-col">
            <h4>Company</h4>
            <ul>
              <li><button onClick={() => navigateTo('home')}>Home</button></li>
              <li><button onClick={() => navigateTo('about')}>About Us</button></li>
              <li><button onClick={() => navigateTo('team')}>Our Team</button></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Services</h4>
            <ul>
              <li><button onClick={() => { navigateTo('services'); setSelectedService('paid-ads-media-buying'); }}>Paid Ads</button></li>
              <li><button onClick={() => { navigateTo('services'); setSelectedService('search-engine-optimization'); }}>B2B SEO</button></li>
              <li><button onClick={() => { navigateTo('services'); setSelectedService('web-design-development'); }}>React Web Dev</button></li>
              <li><button onClick={() => { navigateTo('services'); setSelectedService('branding-creative-services'); }}>Creative Brand</button></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>Connect</h4>
            <p>📧 info@netgeniusconsult.com</p>
            <p className="loc-label">HQ: Ruislip, London</p>
            <p className="loc-label">Hub: Mirpur, Dhaka</p>
          </div>
        </div>

        <div className="footer-copyright container">
          <p>© 2026 NetGenius Consultant Limited. All rights reserved. Preserving local service, delivering global reach.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
