#!/usr/bin/env node
/**
 * Cloud Scheduled Dispatcher for James Can't Code (@JamesCantCode)
 *
 * Runs in GitHub Actions (Cloud 24/7/365) and local fallback.
 * Checks the calendar schedule and executes the scheduled drop.
 * Idempotent: Never double-posts if already published.
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// Schedule Definition (2x per week: Mon & Thu at 08:30 BST)
export const SCHEDULE = [
  {
    date: '2026-09-21', // Mon 21 Sep
    name: 'SuperSkills & Progressive Disclosure',
    script: 'direct_publish_superskills.mjs',
    draftId: '2099250278117617670',
    stateFile: 'published_superskills.json'
  },
  {
    date: '2026-09-24', // Thu 24 Sep
    name: 'The Production Shield (Hardening AI Apps)',
    script: 'direct_publish_production_shield.mjs',
    draftId: '2099247997703929864',
    stateFile: 'published_production_shield.json'
  },
  {
    date: '2026-09-28', // Mon 28 Sep
    name: 'Taste as Code (Design & UI/UX Standards)',
    script: 'direct_publish_taste_as_code.mjs',
    draftId: '2099248005555650563',
    stateFile: 'published_taste_as_code.json'
  },
  {
    date: '2026-10-01', // Thu 01 Oct
    name: 'The Autonomous Studio (Swarms & Continuous Scale)',
    script: 'direct_publish_autonomous_studio.mjs',
    draftId: '2099248012199387143',
    stateFile: 'published_autonomous_studio.json'
  }
];

function getLondonDateString() {
  const d = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

async function runScript(scriptPath, draftId) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Executing publisher: ${scriptPath} --publish --draft-id ${draftId}\n`);
    const proc = spawn('node', [scriptPath, '--publish', '--draft-id', draftId], {
      cwd: REPO_ROOT,
      stdio: 'inherit',
      env: process.env
    });

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Script exited with code ${code}`));
    });

    proc.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const forceArg = args.find(a => a.startsWith('--force='));
  const forceName = forceArg ? forceArg.split('=')[1] : null;

  const londonToday = getLondonDateString();
  console.log(`==================================================`);
  console.log(`🛰️ JCC Cloud Publisher Dispatcher`);
  console.log(`Current London Date: ${londonToday}`);
  console.log(`==================================================\n`);

  let targetDrop = null;
  if (forceName) {
    targetDrop = SCHEDULE.find(s => s.script.includes(forceName) || s.name.toLowerCase().includes(forceName.toLowerCase()));
    if (!targetDrop) {
      console.error(`❌ Could not find drop matching --force=${forceName}`);
      process.exit(1);
    }
    console.log(`⚡ FORCED Execution for drop: "${targetDrop.name}"`);
  } else {
    targetDrop = SCHEDULE.find(s => s.date === londonToday);
  }

  if (!targetDrop) {
    console.log(`ℹ️ No drop scheduled for today (${londonToday}).`);
    console.log(`Upcoming schedule:`);
    for (const item of SCHEDULE) {
      const isPast = item.date < londonToday;
      const statePath = path.join(REPO_ROOT, item.stateFile);
      const isDone = fs.existsSync(statePath);
      console.log(`• [${item.date}] "${item.name}" -> ${isDone ? '✅ Published' : isPast ? '⚠️ Past' : '⏳ Scheduled'}`);
    }
    return;
  }

  const statePath = path.join(REPO_ROOT, targetDrop.stateFile);
  if (fs.existsSync(statePath) && !forceName) {
    console.log(`✅ Drop "${targetDrop.name}" has ALREADY been published! (Found ${targetDrop.stateFile})`);
    console.log(`Skipping to prevent duplicate posting.`);
    return;
  }

  console.log(`🎯 Executing Scheduled Drop: "${targetDrop.name}" (${targetDrop.date})`);
  const scriptPath = path.join(REPO_ROOT, 'scripts', targetDrop.script);
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Publisher script not found at ${scriptPath}`);
  }

  await runScript(scriptPath, targetDrop.draftId);
  console.log(`\n🎉 Scheduled drop "${targetDrop.name}" completed successfully!\n`);
}

main().catch(err => {
  console.error('❌ Cloud Dispatcher Error:', err);
  process.exit(1);
});
