/**
 * 测试数据定义文件
 * 
 * 本文件定义了E2E测试中使用的静态测试数据，包括：
 * 1. 标签数据：用于测试标签管理功能
 * 2. 项目数据：用于测试项目配置功能
 * 3. 文件数据：用于测试文件管理功能
 * 
 * 设计原则：
 * - 数据与测试逻辑分离，便于维护
 * - 使用语义化的数据名称，提高可读性
 * - 数据结构清晰，符合业务逻辑
 * 
 * 使用场景：
 * - 测试数据准备：在beforeEach中创建测试数据
 * - 测试验证：验证功能是否正确处理数据
 * - 数据驱动测试：使用数据数组进行多次测试
 * 
 * @example
 * import { testTags, testProject } from './fixtures/test-data'
 * 
 * test('should create tags', async () => {
 *   for (const tag of testTags) {
 *     await api.createTag(tag.name, tag.color)
 *   }
 * })
 */

/**
 * 测试标签数据
 * 
 * 包含多个不同颜色和用途的标签，用于测试标签管理功能
 * 
 * 数据结构：
 * - name: 标签名称，使用中文便于理解
 * - color: 标签颜色，十六进制格式
 * 
 * 使用场景：
 * 1. 批量创建标签：测试批量操作能力
 * 2. 标签颜色验证：验证颜色显示是否正确
 * 3. 标签搜索：测试按名称搜索功能
 * 
 * @example
 * // 批量创建测试标签
 * for (const tag of testTags) {
 *   await api.createTag(tag.name, tag.color)
 * }
 * 
 * // 验证标签颜色
 * const createdTag = await getTag('重要')
 * expect(createdTag.color).toBe('#FF0000')
 */
export const testTags = [
  { name: '重要', color: '#FF0000' },      // 红色，表示重要事项
  { name: '工作', color: '#00FF00' },      // 绿色，表示工作相关
  { name: '生活', color: '#0000FF' },      // 蓝色，表示生活相关
  { name: '旅行', color: '#FFFF00' },      // 黄色，表示旅行相关
  { name: '美食', color: '#FF00FF' },      // 紫色，表示美食相关
]

/**
 * 测试项目数据
 * 
 * 定义测试项目的基本配置信息
 * 
 * 数据结构：
 * - name: 项目名称，用于显示和识别
 * - path: 项目路径，文件仓库的存储位置
 * 
 * 使用场景：
 * 1. 项目初始化：测试开始前创建测试项目
 * 2. 项目配置验证：验证项目配置是否正确保存
 * 3. 路径管理：测试文件路径相关功能
 * 
 * @example
 * // 创建测试项目
 * await api.createProject(testProject.name, testProject.path)
 * 
 * // 验证项目配置
 * const project = await api.getProject()
 * expect(project.name).toBe(testProject.name)
 * 
 * @remarks
 * - 项目路径需要是有效的文件系统路径
 * - 在CI环境中可能需要使用临时目录
 * - 建议使用相对路径或环境变量配置路径
 */
export const testProject = {
  name: 'E2E Test Project',      // 项目名称，标识这是一个测试项目
  path: 'D:/TestPhotos',         // 项目路径，存储测试文件的目录
}

/**
 * 测试文件数据
 * 
 * 定义用于测试文件管理功能的测试文件
 * 
 * 数据结构：
 * - name: 文件名称，包含扩展名
 * - type: 文件类型，'image' 或 'video'
 * 
 * 使用场景：
 * 1. 文件上传测试：测试文件上传功能
 * 2. 文件类型识别：验证文件类型判断是否正确
 * 3. 文件搜索：测试按文件名或类型搜索
 * 4. 文件删除和恢复：测试文件操作功能
 * 
 * @example
 * // 验证文件类型识别
 * for (const file of testFiles) {
 *   const fileType = await getFileType(file.name)
 *   expect(fileType).toBe(file.type)
 * }
 * 
 * @remarks
 * - 文件名应该唯一，避免冲突
 * - 文件类型应该与实际文件扩展名匹配
 * - 在实际测试中，需要准备真实的测试文件
 * - 建议使用小文件以加快测试速度
 */
export const testFiles = [
  { name: 'test-image-1.jpg', type: 'image' },   // 测试图片1
  { name: 'test-image-2.jpg', type: 'image' },   // 测试图片2
  { name: 'test-video-1.mp4', type: 'video' },   // 测试视频
]

/**
 * 数据使用最佳实践
 * 
 * 1. 数据隔离：
 *    - 使用唯一标识避免数据冲突
 *    - 在测试后清理创建的数据
 * 
 * 2. 数据准备：
 *    - 使用API创建数据，比UI更快
 *    - 在beforeEach中准备测试数据
 * 
 * 3. 数据清理：
 *    - 在afterEach中清理测试数据
 *    - 使用try-catch确保清理不会中断测试
 * 
 * 4. 动态数据：
 *    - 对于需要唯一性的数据，使用时间戳或UUID
 *    - 例如：`test-tag-${Date.now()}`
 * 
 * @example
 * // 完整的测试数据管理示例
 * test.describe('Tag Management', () => {
 *   let api: ApiHelpers
 *   
 *   test.beforeEach(async ({ request }) => {
 *     api = new ApiHelpers(request)
 *     
 *     // 准备测试数据
 *     for (const tag of testTags) {
 *       await api.createTag(tag.name, tag.color)
 *     }
 *   })
 *   
 *   test.afterEach(async () => {
 *     // 清理测试数据
 *     const tags = await api.getAllTags()
 *     for (const tag of tags.data) {
 *       await api.deleteTag(tag.name)
 *     }
 *   })
 *   
 *   test('should manage tags', async () => {
 *     // 测试逻辑
 *   })
 * })
 */
