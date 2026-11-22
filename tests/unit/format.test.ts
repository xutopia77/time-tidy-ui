// Unit tests for src/common/format.ts (run via node:test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    convertToLinuxPath,
    formatUtcToLocal,
    gen_size_str,
    tag_text_color,
    tagName2Display,
} from '../../src/common/format.ts';

test('gen_size_str: 0 渲染为 0.00KB', () => {
    assert.equal(gen_size_str(0), '0.00KB');
});

test('gen_size_str: 小于 1KB 的字节渲染为 KB', () => {
    assert.equal(gen_size_str(512), '0.50KB');
});

test('gen_size_str: 100KB', () => {
    assert.equal(gen_size_str(102400), '100.00KB');
});

test('gen_size_str: 恰好 1MiB 切换为 MB', () => {
    assert.equal(gen_size_str(1024 * 1024), '1.00MB');
});

test('gen_size_str: 5MiB 渲染为 MB', () => {
    assert.equal(gen_size_str(5 * 1024 * 1024), '5.00MB');
});

test('gen_size_str: 恰好 1GiB 切换为 GB', () => {
    assert.equal(gen_size_str(1024 * 1024 * 1024), '1.00GB');
});

test('gen_size_str: 2.5GiB 渲染为 GB', () => {
    assert.equal(gen_size_str(Math.floor(2.5 * 1024 * 1024 * 1024)), '2.50GB');
});

test('formatUtcToLocal: UTC Z 后缀解析为本地时区显示', () => {
    const utc = '2026-01-02T03:04:05Z';
    const d = new Date(utc);
    const pad = (n: number): string => String(n).padStart(2, '0');
    const expected = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    assert.equal(formatUtcToLocal(utc), expected);
});

test('formatUtcToLocal: UTC 时刻按本地墙上时钟偏移', () => {
    // parse the same instant and compare field by field, timezone agnostic
    const utc = '2025-06-15T23:59:59Z';
    const d = new Date(utc);
    assert.equal(formatUtcToLocal(utc).startsWith(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`), true);
});

test('formatUtcToLocal: 空输入返回空字符串', () => {
    assert.equal(formatUtcToLocal(undefined), '');
    assert.equal(formatUtcToLocal(''), '');
});

test('formatUtcToLocal: 非法输入回退为原始字符串（T 换空格）', () => {
    assert.equal(formatUtcToLocal('not-a-date'), 'not-a-date');
    assert.equal(formatUtcToLocal('2026-13-99T99:99:99'), '2026-13-99 99:99:99');
});

test('tagName2Display: 空名称返回空字符串', () => {
    assert.equal(tagName2Display(''), '');
});

test('tagName2Display: 普通名称原样返回', () => {
    assert.equal(tagName2Display('风景'), '风景');
});

test('convertToLinuxPath: 反斜杠转为正斜杠', () => {
    assert.equal(convertToLinuxPath('C:\\a\\b'), 'C:/a/b');
});

test('convertToLinuxPath: 已是 Linux 路径保持不变', () => {
    assert.equal(convertToLinuxPath('/a/b/c'), '/a/b/c');
});

test('tag_text_color: 亮色背景返回深色文字', () => {
    assert.equal(tag_text_color('#F7DC6F'), '#1f1f1f');
    assert.equal(tag_text_color('#FFFFFF'), '#1f1f1f');
});

test('tag_text_color: 深色背景返回白色文字', () => {
    assert.equal(tag_text_color('#000000'), '#ffffff');
    assert.equal(tag_text_color('#4338CA'), '#ffffff');
});

test('tag_text_color: 非法颜色与空输入回退白色', () => {
    assert.equal(tag_text_color('not-a-color'), '#ffffff');
    assert.equal(tag_text_color(undefined), '#ffffff');
    assert.equal(tag_text_color(''), '#ffffff');
});
