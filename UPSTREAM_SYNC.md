# 同步上游仓库更新

本文档说明如何从原始作者仓库（anvaka/city-roads）获取更新并合并到本仓库。

**注意**：本仓库进行了大量破坏性修改，合并时会产生大量代码冲突，需要仔细处理。

## 操作步骤

### 1. 添加上游远程仓库

只需配置一次：

```bash
git remote add upstream https://github.com/anvaka/city-roads.git
```

验证是否添加成功：

```bash
git remote -v
```

应该看到 `upstream` 指向 `https://github.com/anvaka/city-roads.git`

### 2. 获取上游更新

每次想同步时使用：

```bash
git fetch upstream
```

这条命令会下载上游的所有更新，但不会修改你的代码。

### 3. 查看上游有什么更新

```bash
git log upstream/main --oneline
```

这会列出上游 `main` 分支的最新提交，你可以决定是否需要这些更新。

### 4. 合并上游更新到本地

```bash
git merge upstream/main master --allow-unrelated-histories
```

**参数解释**：
- `upstream/main`：上游的 main 分支（原始仓库的主分支）
- `master`：本地的 master 分支（你的主分支）
- `--allow-unrelated-histories`：允许合并不相关历史的分支

### 5. 解决冲突

由于本仓库进行了破坏性修改，合并时几乎一定会产生冲突。步骤：

1. 查看冲突文件：
   ```bash
   git status
   ```

2. 手动编辑冲突文件，选择保留哪些代码：
   - `<<<<<<<` 你的代码
   - `=======` 分隔线
   - `>>>>>>>` 上游的代码

3. 解决完所有冲突后，标记为已解决：
   ```bash
   git add <解决冲突的文件>
   ```

4. 完成合并提交：
   ```bash
   git commit -m "合并上游更新"
   ```

### 6. 推送到远程仓库

```bash
git push
```

## 完整流程示例

```bash
# 添加上游（如果还没添加过）
git remote add upstream https://github.com/anvaka/city-roads.git

# 获取更新
git fetch upstream

# 合并更新
git merge upstream/main master --allow-unrelated-histories

# 如果有冲突，按提示解决后执行：
git add .
git commit -m "合并上游更新"

# 推送到本仓库
git push
```

## 常见问题

### 如何取消一次合并？

如果在合并过程中遇到问题，想取消回到合并前状态：

```bash
git merge --abort
```

### 如何只应用上游的某个特定提交？

如果你只需要上游的某个特定修复，而不是全部更新：

```bash
# 查看上游的提交列表
git log upstream/main --oneline

# 使用 cherry-pick 应用某个具体提交
git cherry-pick <提交哈希值>
```

### 上游更新太多，不想合并？

完全可以选择性合并。你不必获取所有上游更新，只需要获取对你有用的部分。

## 建议

- 合并前先在本地测试，确认功能正常后再推送
- 建议保留分支备份，以防合并失败需要回退
- 可以创建临时分支进行合并测试：`git checkout -b test-merge`
