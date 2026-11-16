// The room's worker script, served as /room.js: the vendored ink-studio files + the scene + the frame loop.
import type { APIRoute } from 'astro';
import { workerSource } from '../lib/room.mjs';

export const GET: APIRoute = () =>
  new Response(workerSource(), { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
