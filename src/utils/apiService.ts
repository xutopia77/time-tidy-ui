import { getApiClient } from './apiClient';
import type { ApiResponse } from './apiClient';
import * as DatTypes from '@/utils/dataTypedef';

export class ApiService {
  static async projectGet(): Promise<ApiResponse<DatTypes.Prj>> {
    return getApiClient().post('/api/v1/project');
  }

  static async projectSet(req: DatTypes.PrjSetReq): Promise<ApiResponse<DatTypes.PrjSetResp>> {
    return getApiClient().post('/api/v1/project_set', req);
  }

  static async dictionaryGet(): Promise<ApiResponse<DatTypes.DictionaryResp>> {
    return getApiClient().post('/api/v1/dictionary_get');
  }

  static async dirCreate(req: DatTypes.DirCreateReq): Promise<ApiResponse<DatTypes.DirCreateResp>> {
    return getApiClient().post('/api/v1/dir_create', req);
  }

  static async filesGet(req: DatTypes.FilesGetReq): Promise<ApiResponse<DatTypes.FilesGetResp>> {
    return getApiClient().post('/api/v1/files_get', req);
  }

  static async filesDelete(req: DatTypes.FileDeleteReq): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/files_delete', req);
  }

  static async filesRestore(req: DatTypes.FileRestoreReq): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/files_restore', req);
  }

  static async filesPathChg(req: DatTypes.FilePathChgReq): Promise<ApiResponse<DatTypes.FilePathChgResp>> {
    return getApiClient().requestRaw('POST', '/api/v1/files_path_chg', req);
  }

  static async filesTagSet(req: DatTypes.FileTagSetReq): Promise<ApiResponse<DatTypes.FileTagSetResp>> {
    return getApiClient().post('/api/v1/files_tag_set', req);
  }

  static async filesTagDelete(req: DatTypes.FileTagDeleteReq): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/files_tag_delete', req);
  }

  static async tagsGet(): Promise<ApiResponse<DatTypes.TagItem[]>> {
    return getApiClient().post('/api/v1/tags_get');
  }

  static async tagsSet(req: DatTypes.TagsSetReq): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/tags_set', req);
  }

  static async tagsDelete(req: DatTypes.TagsDeleteReq): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/tags_delete', req);
  }

  static async fileSimilarityDetect(): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/file_similarity_detect');
  }

  static async fileSimilarityGet(page: number, pageSize: number): Promise<ApiResponse<DatTypes.SimilarityGetResp>> {
    return getApiClient().get(`/api/v1/file_similarity_get?page=${page}&pageSize=${pageSize}`);
  }

  static async fileSimilarityDelete(req: DatTypes.FileSimilarityDeleteReq): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/file_similarity_delete', req);
  }

  static async projectHealth(req: DatTypes.FileHealthGetReq): Promise<ApiResponse<void>> {
    return getApiClient().post('/api/v1/project_health', req);
  }
}
