// Search condition assembly: builds a FilesGetReq payload from the store's
// search conditions plus the current path, applying optional per-call
// overrides. Logic extracted verbatim from Utils.files_get. Type-only
// imports keep this module runnable directly under node:test.

import type { FileSearchCondition, FilesGetReq } from '@/utils/dataTypedef';

// Build the request for the files list endpoint.
// - no folder selected (curPath '' or '/') means "show all files",
//   so the dirs filter is an empty array
// - otherwise it is [curPath without the leading slash]; the backend
//   matches the directory itself and any sub-directory recursively
// - any non-null field of _req overrides the assembled value
export function buildFilesGetReq(
    searchCon: FileSearchCondition,
    curPath: string,
    _req: FilesGetReq | null = null,
): FilesGetReq {
    const req: FilesGetReq = {
        pageSize: 100000,
        page: 0,
        tags: searchCon.tags,
        noTag: searchCon.noTag,
        bReverseTag: searchCon.bReverseSltTag,
        bAndTag: searchCon.bAndSltTag,
        types: searchCon.types,
        dirs: (curPath === '' || curPath === '/') ? [] : [curPath.substring(1)],
        statuss: [],
        origins: [],
        startTime: '',
        endTime: '',
        sortBy: searchCon.sortBy,
        sortOrder: searchCon.sortOrder,
        fileId: 0,
        id: 0,
        bFilterModel: false,
        keyword: null,
        minSize: null,
        maxSize: null,
        hasGPS: null,
        minLat: null,
        maxLat: null,
        minLon: null,
        maxLon: null,
        minDuration: null,
        maxDuration: null,
        minWidth: null,
        maxWidth: null,
        minHeight: null,
        maxHeight: null,
        extensions: null,
        aiSearchEnabled: false,
        aiSearchQuery: '',
        aiSearchMinSimilar: 0.5,
        aiSearchTopK: 20,
        aiImageSearchEnabled: false,
        aiImageSearchRecordIds: [],
        aiImageSearchMinSimilar: 0.5,
        aiImageSearchTopK: 20,
    }
    if (_req != null) {
        if (_req.tags != null) { req.tags = _req.tags; }
        if (_req.noTag != null) { req.noTag = _req.noTag; }
        if (_req.bReverseTag != null) { req.bReverseTag = _req.bReverseTag; }
        if (_req.bAndTag != null) { req.bAndTag = _req.bAndTag; }
        if (_req.types != null) { req.types = _req.types; }
        if (_req.dirs != null) { req.dirs = _req.dirs; }
        if (_req.statuss != null) { req.statuss = _req.statuss; }
        if (_req.origins != null) { req.origins = _req.origins; }
        if (_req.startTime != null) { req.startTime = _req.startTime; }
        if (_req.endTime != null) { req.endTime = _req.endTime; }
        if (_req.sortOrder != null) { req.sortOrder = _req.sortOrder; }
        if (_req.sortBy != null) { req.sortBy = _req.sortBy; }

        if (_req.id != null) { req.id = _req.id; }
        if (_req.bFilterModel != null) { req.bFilterModel = _req.bFilterModel; }

        if (_req.keyword != null) { req.keyword = _req.keyword; }
        if (_req.minSize != null) { req.minSize = _req.minSize; }
        if (_req.maxSize != null) { req.maxSize = _req.maxSize; }
        if (_req.hasGPS != null) { req.hasGPS = _req.hasGPS; }
        if (_req.minLat != null) { req.minLat = _req.minLat; }
        if (_req.maxLat != null) { req.maxLat = _req.maxLat; }
        if (_req.minLon != null) { req.minLon = _req.minLon; }
        if (_req.maxLon != null) { req.maxLon = _req.maxLon; }
        if (_req.minDuration != null) { req.minDuration = _req.minDuration; }
        if (_req.maxDuration != null) { req.maxDuration = _req.maxDuration; }
        if (_req.minWidth != null) { req.minWidth = _req.minWidth; }
        if (_req.maxWidth != null) { req.maxWidth = _req.maxWidth; }
        if (_req.minHeight != null) { req.minHeight = _req.minHeight; }
        if (_req.maxHeight != null) { req.maxHeight = _req.maxHeight; }
        if (_req.extensions != null) { req.extensions = _req.extensions; }

        // AI Search fields
        if (_req.aiSearchEnabled) { req.aiSearchEnabled = _req.aiSearchEnabled; }
        if (_req.aiSearchQuery) { req.aiSearchQuery = _req.aiSearchQuery; }
        if (_req.aiSearchMinSimilar) { req.aiSearchMinSimilar = _req.aiSearchMinSimilar; }
        if (_req.aiSearchTopK) { req.aiSearchTopK = _req.aiSearchTopK; }
        if (_req.aiImageSearchEnabled) { req.aiImageSearchEnabled = _req.aiImageSearchEnabled; }
        if (_req.aiImageSearchRecordIds && _req.aiImageSearchRecordIds.length > 0) { req.aiImageSearchRecordIds = _req.aiImageSearchRecordIds; }
        if (_req.aiImageSearchMinSimilar) { req.aiImageSearchMinSimilar = _req.aiImageSearchMinSimilar; }
        if (_req.aiImageSearchTopK) { req.aiImageSearchTopK = _req.aiImageSearchTopK; }
    }
    return req;
}
