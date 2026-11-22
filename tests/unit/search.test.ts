// Unit tests for src/common/search.ts (run via node:test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFilesGetReq } from '../../src/common/search.ts';
import { FileSearchCondition, FilesGetReq } from '../../src/utils/dataTypedef.ts';

test('根目录时 dirs 为空数组', () => {
    const sc = new FileSearchCondition();
    const req = buildFilesGetReq(sc, '/', null);
    assert.deepEqual(req.dirs, []);
});

test('非根目录时 dirs 为 [curPath.substring(1)]', () => {
    const sc = new FileSearchCondition();
    const req = buildFilesGetReq(sc, '/photos/2024', null);
    assert.deepEqual(req.dirs, ['photos/2024']);
});

test('未选择文件夹（空路径）时 dirs 为空数组，即显示全部文件', () => {
    const sc = new FileSearchCondition();
    const req = buildFilesGetReq(sc, '', null);
    assert.deepEqual(req.dirs, []);
});

test('bAndTag 从搜索条件透传', () => {
    const sc = new FileSearchCondition();
    sc.bAndSltTag = true;
    sc.bReverseSltTag = true;
    const req = buildFilesGetReq(sc, '/x', null);
    assert.equal(req.bAndTag, true);
    assert.equal(req.bReverseTag, true);
});

test('_req 覆盖项生效（tags/keyword/sortBy）', () => {
    const sc = new FileSearchCondition();
    const over = new FilesGetReq();
    over.tags = ['t1', 't2'];
    over.keyword = 'cat';
    over.sortBy = 'name';
    const req = buildFilesGetReq(sc, '/', over);
    assert.deepEqual(req.tags, ['t1', 't2']);
    assert.equal(req.keyword, 'cat');
    assert.equal(req.sortBy, 'name');
});

test('_req.bAndTag 为 false 时覆盖搜索条件中的 true', () => {
    const sc = new FileSearchCondition();
    sc.bAndSltTag = true;
    const over = new FilesGetReq();
    over.bAndTag = false;
    const req = buildFilesGetReq(sc, '/', over);
    assert.equal(req.bAndTag, false);
});

test('默认值：pageSize=100000、page=0、sortBy/sortOrder 来自搜索条件', () => {
    const sc = new FileSearchCondition();
    const req = buildFilesGetReq(sc, '/', null);
    assert.equal(req.pageSize, 100000);
    assert.equal(req.page, 0);
    assert.equal(req.sortBy, 'time');
    assert.equal(req.sortOrder, 'asc');
    assert.equal(req.keyword, null);
});
