import type { Env } from "../db/db";
import { getEnv } from "./di";

/**
 * Cloudflare KV 缓存工具类
 * 提供边缘节点级别的毫秒级缓存读写
 * 
 * 默认 TTL: 3600 秒 (1 小时)
 * 绑定名称: CACHE_KV (需要用户在 Cloudflare Dashboard 创建并绑定)
 */

// 默认缓存过期时间 (秒) - 1年
// 因为 Rin 博客在写入/更新/删除时会主动清除缓存，所以可以设置较长
const DEFAULT_TTL = 31536000;

export class KVCache {
    private kv: KVNamespace | undefined;
    private env: Env;
    private prefix: string;

    constructor(prefix: string = "cache") {
        this.env = getEnv();
        this.kv = this.env.CACHE_KV;
        this.prefix = prefix;
    }

    /**
     * 检查 KV 是否可用
     */
    isAvailable(): boolean {
        return this.kv !== undefined;
    }

    /**
     * 构建带前缀的 key
     */
    private buildKey(key: string): string {
        return `${this.prefix}:${key}`;
    }

    /**
     * 从 KV 获取缓存
     * @param key 缓存键
     * @returns 缓存值，不存在或 KV 不可用时返回 null
     */
    async get<T>(key: string): Promise<T | null> {
        if (!this.kv) {
            return null;
        }

        try {
            const fullKey = this.buildKey(key);
            const value = await this.kv.get(fullKey, "json");
            if (value !== null) {
                console.log(`[KV Cache] HIT: ${fullKey}`);
            }
            return value as T | null;
        } catch (e: any) {
            console.error(`[KV Cache] GET error for key ${key}:`, e.message);
            return null;
        }
    }

    /**
     * 写入 KV 缓存
     * @param key 缓存键
     * @param value 缓存值
     * @param ttl 过期时间（秒），默认 3600 秒
     */
    async set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<boolean> {
        if (!this.kv) {
            return false;
        }

        try {
            const fullKey = this.buildKey(key);
            await this.kv.put(fullKey, JSON.stringify(value), {
                expirationTtl: ttl
            });
            console.log(`[KV Cache] SET: ${fullKey} (TTL: ${ttl}s)`);
            return true;
        } catch (e: any) {
            console.error(`[KV Cache] SET error for key ${key}:`, e.message);
            return false;
        }
    }

    /**
     * 删除 KV 缓存
     * @param key 缓存键
     */
    async delete(key: string): Promise<boolean> {
        if (!this.kv) {
            return false;
        }

        try {
            const fullKey = this.buildKey(key);
            await this.kv.delete(fullKey);
            console.log(`[KV Cache] DELETE: ${fullKey}`);
            return true;
        } catch (e: any) {
            console.error(`[KV Cache] DELETE error for key ${key}:`, e.message);
            return false;
        }
    }

    /**
     * 批量删除匹配前缀的缓存
     * 注意：KV list 操作有性能开销，谨慎使用
     * @param keyPrefix 要删除的 key 前缀
     */
    async deleteByPrefix(keyPrefix: string): Promise<number> {
        if (!this.kv) {
            return 0;
        }

        try {
            const fullPrefix = this.buildKey(keyPrefix);
            const listResult = await this.kv.list({ prefix: fullPrefix });

            let deletedCount = 0;
            for (const key of listResult.keys) {
                await this.kv.delete(key.name);
                deletedCount++;
            }

            if (deletedCount > 0) {
                console.log(`[KV Cache] DELETE PREFIX: ${fullPrefix} (${deletedCount} keys)`);
            }
            return deletedCount;
        } catch (e: any) {
            console.error(`[KV Cache] DELETE PREFIX error for ${keyPrefix}:`, e.message);
            return 0;
        }
    }

    /**
     * 清除所有该前缀下的缓存
     */
    async clear(): Promise<number> {
        return this.deleteByPrefix("");
    }
}

/**
 * 获取公共缓存的 KV 实例
 */
export function getKVCache(prefix: string = "cache"): KVCache {
    return new KVCache(prefix);
}
