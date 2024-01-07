import ora from "ora";

export const wrapLoading =async (msg, handle) => {
  const spinner = ora(msg)
  spinner.start()
  const res = await handle() // 将用户的逻辑包裹loading
  spinner.succeed()
  return res
}