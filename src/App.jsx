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
    img: '/team/zoya_vance.png'
  },
  {
    name: 'Ritu Raka',
    role: 'Team Leader',
    dept: 'Executive Leadership',
    category: 'executive',
    bio: 'Ritu manages cross-functional client operations, optimizing workflows and setting quality standards for campaign execution.',
    skills: ['Operations Mgmt', 'Quality Assurance', 'Team Leadership'],
    img: '/team/ritu_raka.png'
  },
  {
    name: 'Raj Gupta',
    role: 'Business Strategy',
    dept: 'Executive Leadership',
    category: 'executive',
    bio: 'Raj directs corporate strategy and market entry campaigns, developing actionable growth roadmaps for enterprise clients.',
    skills: ['Market Expansion', 'Corporate Strategy', 'Growth Hack'],
    img: '/team/raj_gupta.png'
  },
  {
    name: 'Anika Sharma',
    role: 'Head of Web Development',
    dept: 'Technical Operations',
    category: 'technical',
    bio: 'Anika heads our engineering team, focusing on building high-performance, accessible, and secure React/Next.js applications.',
    skills: ['React/Vite', 'Next.js', 'Architecture'],
    img: '/team/anika_sharma.png'
  },
  {
    name: 'Sarah Kabir',
    role: 'Head of IT',
    dept: 'Technical Operations',
    category: 'technical',
    bio: 'Sarah manages our IT infrastructure, cloud environments, and internal security, maintaining 99.9% uptime across all servers.',
    skills: ['DevOps', 'Cloud Infrastructure', 'SysOps'],
    img: '/team/sarah_kabir.png'
  },
  {
    name: 'Sophia Taylor',
    role: 'SEO Team Lead',
    dept: 'Search Engine Optimization',
    category: 'marketing',
    bio: 'Sophia designs and executes comprehensive enterprise SEO frameworks, managing keyword targeting, content gap audits, and technical fixes.',
    skills: ['Technical SEO', 'Content Auditing', 'Rankings'],
    img: '/team/sophia_taylor.png'
  },
  {
    name: 'Maya Jama',
    role: 'PPC Specialist',
    dept: 'Paid Media (PPC)',
    category: 'marketing',
    bio: 'Maya creates and optimizes high-ROI paid media campaigns on Google Search, LinkedIn Ads, and Meta, focusing on B2B lead generation.',
    skills: ['Google Ads', 'Meta Ads', 'B2B Lead Gen'],
    img: '/team/maya_jama.png'
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
    img: '/team/saad_rahat.png'
  },
  {
    name: 'Isabella Sermon',
    role: 'Social Media Manager',
    dept: 'Social Media & Organic Growth',
    category: 'marketing',
    bio: 'Isabella designs engaging organic social strategies, building brand recognition and community interaction for international clients.',
    skills: ['Content Strategy', 'Social Campaigns', 'Engagement'],
    img: '/team/isabella_sermon.png'
  },
  {
    name: 'Li Xiong',
    role: 'Accounts',
    dept: 'Finance & Accounts',
    category: 'finance',
    bio: 'Li manages company accounts and financial forecasting, overseeing international transactions and billing operations.',
    skills: ['Financial Planning', 'Accounts', 'Billing Systems'],
    img: '/team/li_xiong.png'
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
      const validPaths = ['home', 'about', 'team', 'services', 'blog', 'contact'];
      
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
                </>
              )}
            </div>
          </section>
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
