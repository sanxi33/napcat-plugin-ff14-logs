import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

var EventType = ((EventType2) => {
  EventType2.MESSAGE = 'message';
  return EventType2;
})(EventType || {});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CONFIG = {
  enabled: true,
  commandPrefix: '/',
  requestTimeoutMs: 10000,
  jobDictPath: './data/job.json',
  bossDictPath: './data/boss.json'
};

export let plugin_config_ui = [];
let currentConfig = { ...DEFAULT_CONFIG };
let jobs = [];
let bosses = [];
let logger = null;

function normalize(text) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, '');
}

function sanitizeConfig(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ...DEFAULT_CONFIG };
  const out = { ...DEFAULT_CONFIG, ...raw };
  out.enabled = Boolean(out.enabled);
  out.commandPrefix = String(out.commandPrefix || '').trim();
  out.requestTimeoutMs = Math.max(1000, Math.min(30000, Number(out.requestTimeoutMs) || 10000));
  out.jobDictPath = String(out.jobDictPath || DEFAULT_CONFIG.jobDictPath).trim();
  out.bossDictPath = String(out.bossDictPath || DEFAULT_CONFIG.bossDictPath).trim();
  return out;
}

function stripPrefix(text) {
  const trimmed = String(text || '').trim();
  if (!currentConfig.commandPrefix) return trimmed;
  if (trimmed.startsWith(currentConfig.commandPrefix)) return trimmed.slice(currentConfig.commandPrefix.length).trim();
  return trimmed;
}

function resolveDictPath(dictPath) {
  if (path.isAbsolute(dictPath)) return dictPath;
  return path.resolve(__dirname, dictPath);
}

function parseCmd(raw) {
  const text = stripPrefix(raw);
  if (!normalize(text).includes('ff14logs')) return null;
  const rest = text.slice(text.toLowerCase().indexOf('ff14logs') + 'ff14logs'.length).trim();
  const parts = rest.split(/\s+/).filter(Boolean);
  if (parts.length !== 2 && parts.length !== 4) {
    return { error: '格式：/ff14logs boss job [day dps_type]\n示例：/ff14logs p9s 武僧 0 rdps' };
  }
  return {
    boss: parts[0],
    job: parts[1],
    day: parts[2] ? Number(parts[2]) : -1,
    dpsType: parts[3] || 'rdps'
  };
}

function matchJob(name) {
  const normalized = normalize(name);
  return jobs.find((job) =>
    normalize(job.name) === normalized ||
    normalize(job.cn_name) === normalized ||
    (job.nickname || []).some((nickname) => normalize(nickname) === normalized)
  );
}

function matchBoss(name) {
  const normalized = normalize(name);
  return bosses.find((boss) =>
    normalize(boss.name) === normalized ||
    normalize(boss.cn_name) === normalized ||
    (boss.nickname || []).some((nickname) => normalize(nickname) === normalized)
  );
}

function loadDict() {
  try {
    jobs = JSON.parse(fs.readFileSync(resolveDictPath(currentConfig.jobDictPath), 'utf-8'));
  } catch {
    jobs = [];
  }
  try {
    bosses = JSON.parse(fs.readFileSync(resolveDictPath(currentConfig.bossDictPath), 'utf-8'));
  } catch {
    bosses = [];
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), currentConfig.requestTimeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { referer: 'https://cn.fflogs.com' }
    });
    if (!response.ok) throw new Error(`http_${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function parseSeries(html, suffix) {
  const key = suffix === 100 ? 'series' : `series${suffix}`;
  const re = new RegExp(`${key}\\.data\\.push\\(([+-]?(?:0|[1-9]\\d*)(?:\\.\\d+)?)\\)`, 'g');
  const arr = [];
  let match;
  while ((match = re.exec(html)) !== null) arr.push(Number(match[1]));
  return arr;
}

function fmt(value) {
  return Number(value || 0).toFixed(2);
}

async function sendMsg(ctx, event, message) {
  const params = {
    message,
    message_type: event.message_type,
    ...(event.message_type === 'group' && event.group_id ? { group_id: String(event.group_id) } : {}),
    ...(event.message_type === 'private' && event.user_id ? { user_id: String(event.user_id) } : {})
  };
  await ctx.actions.call('send_msg', params, ctx.adapterName, ctx.pluginManager.config);
}

async function runQuery(cmd) {
  const job = matchJob(cmd.job);
  if (!job) return '职业不正确';
  const boss = matchBoss(cmd.boss);
  if (!boss) return 'boss 不正确';

  const region = String((boss.cn_region || [])[0] || '国服###13').split('###');
  const regionName = region[0] || '国服';
  const regionId = Number(region[1] || 13);

  const url = `https://cn.fflogs.com/zone/statistics/table/${boss.quest}/dps/${boss.pk}/${boss.savage}/8/${regionId}/100/1000/7/${boss.patch}/${job.name}/All/0/normalized/single/0/-1/?keystone=15&dpstype=${cmd.dpsType}`;
  const html = await fetchText(url);

  const p10 = parseSeries(html, 10);
  const p25 = parseSeries(html, 25);
  const p50 = parseSeries(html, 50);
  const p75 = parseSeries(html, 75);
  const p95 = parseSeries(html, 95);
  const p99 = parseSeries(html, 99);
  const p100 = parseSeries(html, 100);
  const len = p100.length;
  if (!len) return '没抓到数据（可能页面结构变化）';

  const idx = cmd.day >= 0 && cmd.day < len ? cmd.day : len - 1;
  return `服务器: 国服(${regionName}) dps类型:${cmd.dpsType}\n副本:${boss.cn_zone_name || boss.zone_name}\nboss:${boss.cn_name || boss.name} 职业:${job.cn_name || job.name} 天数:${idx + 1}\n10%:${fmt(p10[idx])}\n25%:${fmt(p25[idx])}\n50%:${fmt(p50[idx])}\n75%:${fmt(p75[idx])}\n95%:${fmt(p95[idx])}\n99%:${fmt(p99[idx])}\n100%:${fmt(p100[idx])}`;
}

export const plugin_init = async (ctx) => {
  logger = ctx.logger;
  plugin_config_ui = ctx.NapCatConfig.combine(
    ctx.NapCatConfig.boolean('enabled', '启用插件', true, '总开关'),
    ctx.NapCatConfig.text('commandPrefix', '命令前缀', '/', '例如：/ff14logs p9s 武僧'),
    ctx.NapCatConfig.number('requestTimeoutMs', '请求超时(ms)', 10000, '1000-30000'),
    ctx.NapCatConfig.text('jobDictPath', '职业字典路径', DEFAULT_CONFIG.jobDictPath, '仓库内默认提供 ./data/job.json'),
    ctx.NapCatConfig.text('bossDictPath', 'Boss字典路径', DEFAULT_CONFIG.bossDictPath, '仓库内默认提供 ./data/boss.json')
  );
  try {
    if (ctx.configPath && fs.existsSync(ctx.configPath)) {
      currentConfig = sanitizeConfig(JSON.parse(fs.readFileSync(ctx.configPath, 'utf-8')));
    }
  } catch {}
  loadDict();
};

export const plugin_onmessage = async (ctx, event) => {
  if (!currentConfig.enabled) return;
  if (event.post_type !== EventType.MESSAGE) return;
  const raw = String(event.raw_message || '').trim();
  if (!raw) return;
  const cmd = parseCmd(raw);
  if (!cmd) return;
  if (cmd.error) return sendMsg(ctx, event, cmd.error);
  try {
    const message = await runQuery(cmd);
    await sendMsg(ctx, event, message);
  } catch (error) {
    logger?.error('ff14-logs error', error);
    await sendMsg(ctx, event, '查询失败，稍后再试');
  }
};

export const plugin_get_config = async () => currentConfig;
export const plugin_set_config = async (ctx, cfg) => {
  currentConfig = sanitizeConfig(cfg);
  loadDict();
  try {
    const dir = path.dirname(ctx.configPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ctx.configPath, JSON.stringify(currentConfig, null, 2), 'utf-8');
  } catch {}
};
export const plugin_on_config_change = async (ctx, ui, key, value, cur) => {
  currentConfig = sanitizeConfig(cur);
  if (key === 'jobDictPath' || key === 'bossDictPath') loadDict();
};
export const plugin_onevent = async () => {};
export const plugin_cleanup = async () => {};
