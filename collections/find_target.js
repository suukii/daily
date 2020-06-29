/**
 * 二分查找元素在有序数组中的位置，如果不存在，输出-1，
 * 如果存在，输出下标（存在多个，输出下标最小的）。
 */

/**
 * suukii
 * 如果找到目标元素，继续二分查找，但把当前下标也包含在查找范围中
 */
const findTarget = (arr, target) => {
  let left = 0,
    mid = 0,
    right = arr.length - 1

  while (left < right) {
    mid = ((left + right) / 2) << 0
    if (arr[mid] < target) {
      left = mid + 1
    } else if (arr[mid] > target) {
      right = mid - 1
    } else if (arr[mid] === target) {
      right = mid
    }
  }
  return arr[left] === target ? left : -1
}

/**
 * lucifer
 * 效率更高
 */
function left_bound(nums, target) {
  let left = 0,
    right = nums.length - 1
  // 搜索区间为 [left, right]
  while (left <= right) {
    let mid = (left + (right - left) / 2) << 0
    if (nums[mid] < target) {
      // 搜索区间变为 [mid+1, right]
      left = mid + 1
    } else if (nums[mid] > target) {
      // 搜索区间变为 [left, mid-1]
      right = mid - 1
    } else if (nums[mid] == target) {
      // 收缩右侧边界
      right = mid - 1
    }
  }
  // 检查出界情况
  if (left >= nums.length || nums[left] != target) return -1
  return left
}
