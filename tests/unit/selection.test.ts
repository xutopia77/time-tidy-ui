// Unit tests for src/common/selection.ts (run via node:test).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { File } from '../../src/utils/dataTypedef.ts';
import {
    checkedFileIds,
    clearChecked,
    filterCheckedFiles,
} from '../../src/common/selection.ts';

test('filterCheckedFiles: 空数组返回空数组', () => {
    assert.deepEqual(filterCheckedFiles([]), []);
});

test('filterCheckedFiles: 全部未选中返回空数组', () => {
    const a = new File();
    const b = new File();
    b.checked = false;
    assert.deepEqual(filterCheckedFiles([a, b]), []);
});

test('filterCheckedFiles: 部分选中仅返回选中项且保持顺序', () => {
    const a = new File();
    a.id = 1;
    a.checked = true;
    const b = new File();
    b.id = 2;
    const c = new File();
    c.id = 3;
    c.checked = true;
    const result = filterCheckedFiles([a, b, c]);
    assert.deepEqual(result, [a, c]);
    assert.deepEqual(result.map(f => f.id), [1, 3]);
});

test('filterCheckedFiles: checked 必须严格为 true', () => {
    const f = new File();
    f.checked = false;
    assert.deepEqual(filterCheckedFiles([f]), []);
    f.checked = true;
    assert.deepEqual(filterCheckedFiles([f]), [f]);
});

test('clearChecked: 清空所有选中标记', () => {
    const a = new File();
    const b = new File();
    a.checked = true;
    b.checked = true;
    clearChecked([a, b]);
    assert.equal(a.checked, false);
    assert.equal(b.checked, false);
});

test('checkedFileIds: 仅收集选中文件 id', () => {
    const a = new File();
    a.id = 11;
    a.checked = true;
    const b = new File();
    b.id = 22;
    assert.deepEqual(checkedFileIds([a, b]), [11]);
});
